/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Platform, _getShadowRoot } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, InjectionToken, Input, Optional, ViewEncapsulation, ChangeDetectorRef, NgZone, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/common";
/**
 * Base reference size of the spinner.
 * @docs-private
 */
const BASE_SIZE = 100;
/**
 * Base reference stroke width of the spinner.
 * @docs-private
 */
const BASE_STROKE_WIDTH = 10;
// Boilerplate for applying mixins to MatProgressSpinner.
/** @docs-private */
const _MatProgressSpinnerBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}, 'primary');
/** Injection token to be used to override the default options for `mat-progress-spinner`. */
export const MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS = new InjectionToken('mat-progress-spinner-default-options', {
    providedIn: 'root',
    factory: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY() {
    return { diameter: BASE_SIZE };
}
// .0001 percentage difference is necessary in order to avoid unwanted animation frames
// for example because the animation duration is 4 seconds, .1% accounts to 4ms
// which are enough to see the flicker described in
// https://github.com/angular/components/issues/8984
const INDETERMINATE_ANIMATION_TEMPLATE = `
 @keyframes mat-progress-spinner-stroke-rotate-DIAMETER {
    0%      { stroke-dashoffset: START_VALUE;  transform: rotate(0); }
    12.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(0); }
    12.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(72.5deg); }
    25%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(72.5deg); }

    25.0001%   { stroke-dashoffset: START_VALUE;  transform: rotate(270deg); }
    37.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(270deg); }
    37.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(161.5deg); }
    50%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(161.5deg); }

    50.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(180deg); }
    62.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(180deg); }
    62.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(251.5deg); }
    75%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(251.5deg); }

    75.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(90deg); }
    87.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(90deg); }
    87.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(341.5deg); }
    100%    { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(341.5deg); }
  }
`;
/**
 * `<mat-progress-spinner>` component.
 */
export class MatProgressSpinner extends _MatProgressSpinnerBase {
    constructor(elementRef, _platform, _document, animationMode, defaults, 
    /**
     * @deprecated `changeDetectorRef`, `viewportRuler` and `ngZone`
     * parameters to become required.
     * @breaking-change 14.0.0
     */
    changeDetectorRef, viewportRuler, ngZone) {
        super(elementRef);
        this._document = _document;
        this._diameter = BASE_SIZE;
        this._value = 0;
        this._resizeSubscription = Subscription.EMPTY;
        /** Mode of the progress circle */
        this.mode = 'determinate';
        const trackedDiameters = MatProgressSpinner._diameters;
        this._spinnerAnimationLabel = this._getSpinnerAnimationLabel();
        // The base size is already inserted via the component's structural styles. We still
        // need to track it so we don't end up adding the same styles again.
        if (!trackedDiameters.has(_document.head)) {
            trackedDiameters.set(_document.head, new Set([BASE_SIZE]));
        }
        this._noopAnimations =
            animationMode === 'NoopAnimations' && !!defaults && !defaults._forceAnimations;
        if (elementRef.nativeElement.nodeName.toLowerCase() === 'mat-spinner') {
            this.mode = 'indeterminate';
        }
        if (defaults) {
            if (defaults.color) {
                this.color = this.defaultColor = defaults.color;
            }
            if (defaults.diameter) {
                this.diameter = defaults.diameter;
            }
            if (defaults.strokeWidth) {
                this.strokeWidth = defaults.strokeWidth;
            }
        }
        // Safari has an issue where the circle isn't positioned correctly when the page has a
        // different zoom level from the default. This handler triggers a recalculation of the
        // `transform-origin` when the page zoom level changes.
        // See `_getCircleTransformOrigin` for more info.
        // @breaking-change 14.0.0 Remove null checks for `_changeDetectorRef`,
        // `viewportRuler` and `ngZone`.
        if (_platform.isBrowser && _platform.SAFARI && viewportRuler && changeDetectorRef && ngZone) {
            this._resizeSubscription = viewportRuler.change(150).subscribe(() => {
                // When the window is resize while the spinner is in `indeterminate` mode, we
                // have to mark for check so the transform origin of the circle can be recomputed.
                if (this.mode === 'indeterminate') {
                    ngZone.run(() => changeDetectorRef.markForCheck());
                }
            });
        }
    }
    /** The diameter of the progress spinner (will set width and height of svg). */
    get diameter() {
        return this._diameter;
    }
    set diameter(size) {
        this._diameter = coerceNumberProperty(size);
        this._spinnerAnimationLabel = this._getSpinnerAnimationLabel();
        // If this is set before `ngOnInit`, the style root may not have been resolved yet.
        if (this._styleRoot) {
            this._attachStyleNode();
        }
    }
    /** Stroke width of the progress spinner. */
    get strokeWidth() {
        return this._strokeWidth || this.diameter / 10;
    }
    set strokeWidth(value) {
        this._strokeWidth = coerceNumberProperty(value);
    }
    /** Value of the progress circle. */
    get value() {
        return this.mode === 'determinate' ? this._value : 0;
    }
    set value(newValue) {
        this._value = Math.max(0, Math.min(100, coerceNumberProperty(newValue)));
    }
    ngOnInit() {
        const element = this._elementRef.nativeElement;
        // Note that we need to look up the root node in ngOnInit, rather than the constructor, because
        // Angular seems to create the element outside the shadow root and then moves it inside, if the
        // node is inside an `ngIf` and a ShadowDom-encapsulated component.
        this._styleRoot = _getShadowRoot(element) || this._document.head;
        this._attachStyleNode();
        element.classList.add('mat-progress-spinner-indeterminate-animation');
    }
    ngOnDestroy() {
        this._resizeSubscription.unsubscribe();
    }
    /** The radius of the spinner, adjusted for stroke width. */
    _getCircleRadius() {
        return (this.diameter - BASE_STROKE_WIDTH) / 2;
    }
    /** The view box of the spinner's svg element. */
    _getViewBox() {
        const viewBox = this._getCircleRadius() * 2 + this.strokeWidth;
        return `0 0 ${viewBox} ${viewBox}`;
    }
    /** The stroke circumference of the svg circle. */
    _getStrokeCircumference() {
        return 2 * Math.PI * this._getCircleRadius();
    }
    /** The dash offset of the svg circle. */
    _getStrokeDashOffset() {
        if (this.mode === 'determinate') {
            return (this._getStrokeCircumference() * (100 - this._value)) / 100;
        }
        return null;
    }
    /** Stroke width of the circle in percent. */
    _getCircleStrokeWidth() {
        return (this.strokeWidth / this.diameter) * 100;
    }
    /** Gets the `transform-origin` for the inner circle element. */
    _getCircleTransformOrigin(svg) {
        // Safari has an issue where the `transform-origin` doesn't work as expected when the page
        // has a different zoom level from the default. The problem appears to be that a zoom
        // is applied on the `svg` node itself. We can work around it by calculating the origin
        // based on the zoom level. On all other browsers the `currentScale` appears to always be 1.
        const scale = (svg.currentScale ?? 1) * 50;
        return `${scale}% ${scale}%`;
    }
    /** Dynamically generates a style tag containing the correct animation for this diameter. */
    _attachStyleNode() {
        const styleRoot = this._styleRoot;
        const currentDiameter = this._diameter;
        const diameters = MatProgressSpinner._diameters;
        let diametersForElement = diameters.get(styleRoot);
        if (!diametersForElement || !diametersForElement.has(currentDiameter)) {
            const styleTag = this._document.createElement('style');
            styleTag.setAttribute('mat-spinner-animation', this._spinnerAnimationLabel);
            styleTag.textContent = this._getAnimationText();
            styleRoot.appendChild(styleTag);
            if (!diametersForElement) {
                diametersForElement = new Set();
                diameters.set(styleRoot, diametersForElement);
            }
            diametersForElement.add(currentDiameter);
        }
    }
    /** Generates animation styles adjusted for the spinner's diameter. */
    _getAnimationText() {
        const strokeCircumference = this._getStrokeCircumference();
        return (INDETERMINATE_ANIMATION_TEMPLATE
            // Animation should begin at 5% and end at 80%
            .replace(/START_VALUE/g, `${0.95 * strokeCircumference}`)
            .replace(/END_VALUE/g, `${0.2 * strokeCircumference}`)
            .replace(/DIAMETER/g, `${this._spinnerAnimationLabel}`));
    }
    /** Returns the circle diameter formatted for use with the animation-name CSS property. */
    _getSpinnerAnimationLabel() {
        // The string of a float point number will include a period ‘.’ character,
        // which is not valid for a CSS animation-name.
        return this.diameter.toString().replace('.', '_');
    }
}
/**
 * Tracks diameters of existing instances to de-dupe generated styles (default d = 100).
 * We need to keep track of which elements the diameters were attached to, because for
 * elements in the Shadow DOM the style tags are attached to the shadow root, rather
 * than the document head.
 */
MatProgressSpinner._diameters = new WeakMap();
MatProgressSpinner.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatProgressSpinner, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: DOCUMENT, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MatProgressSpinner.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: { color: "color", diameter: "diameter", strokeWidth: "strokeWidth", mode: "mode", value: "value" }, host: { attributes: { "role": "progressbar", "tabindex": "-1" }, properties: { "class._mat-animation-noopable": "_noopAnimations", "style.width.px": "diameter", "style.height.px": "diameter", "attr.aria-valuemin": "mode === \"determinate\" ? 0 : null", "attr.aria-valuemax": "mode === \"determinate\" ? 100 : null", "attr.aria-valuenow": "mode === \"determinate\" ? value : null", "attr.mode": "mode" }, classAttribute: "mat-progress-spinner mat-spinner" }, exportAs: ["matProgressSpinner"], usesInheritance: true, ngImport: i0, template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG.\n-->\n<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_getViewBox()\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\"\n  aria-hidden=\"true\"\n  #svg>\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + _spinnerAnimationLabel\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n</svg>\n", styles: [".mat-progress-spinner{display:block;position:relative;overflow:hidden}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:rgba(0,0,0,0);transition:stroke-dashoffset 225ms linear}.cdk-high-contrast-active .mat-progress-spinner circle{stroke:CanvasText}.mat-progress-spinner[mode=indeterminate] svg{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}.mat-progress-spinner[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}.mat-progress-spinner._mat-animation-noopable svg,.mat-progress-spinner._mat-animation-noopable circle{animation:none;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}"], dependencies: [{ kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatProgressSpinner, decorators: [{
            type: Component,
            args: [{ selector: 'mat-progress-spinner, mat-spinner', exportAs: 'matProgressSpinner', host: {
                        'role': 'progressbar',
                        // `mat-spinner` is here for backward compatibility.
                        'class': 'mat-progress-spinner mat-spinner',
                        // set tab index to -1 so screen readers will read the aria-label
                        // Note: there is a known issue with JAWS that does not read progressbar aria labels on FireFox
                        'tabindex': '-1',
                        '[class._mat-animation-noopable]': `_noopAnimations`,
                        '[style.width.px]': 'diameter',
                        '[style.height.px]': 'diameter',
                        '[attr.aria-valuemin]': 'mode === "determinate" ? 0 : null',
                        '[attr.aria-valuemax]': 'mode === "determinate" ? 100 : null',
                        '[attr.aria-valuenow]': 'mode === "determinate" ? value : null',
                        '[attr.mode]': 'mode',
                    }, inputs: ['color'], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG.\n-->\n<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_getViewBox()\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\"\n  aria-hidden=\"true\"\n  #svg>\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + _spinnerAnimationLabel\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n</svg>\n", styles: [".mat-progress-spinner{display:block;position:relative;overflow:hidden}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:rgba(0,0,0,0);transition:stroke-dashoffset 225ms linear}.cdk-high-contrast-active .mat-progress-spinner circle{stroke:CanvasText}.mat-progress-spinner[mode=indeterminate] svg{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}.mat-progress-spinner[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}.mat-progress-spinner._mat-animation-noopable svg,.mat-progress-spinner._mat-animation-noopable circle{animation:none;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS]
                }] }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i0.NgZone }]; }, propDecorators: { diameter: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], mode: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyL3Byb2dyZXNzLXNwaW5uZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxRQUFRLEVBQ1IsaUJBQWlCLEVBRWpCLGlCQUFpQixFQUVqQixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFXLFVBQVUsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBS2xDOzs7R0FHRztBQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUV0Qjs7O0dBR0c7QUFDSCxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qix5REFBeUQ7QUFDekQsb0JBQW9CO0FBQ3BCLE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUN4QztJQUNFLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lB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RSxVQUFVO3dCQUM5QixtQkFBbUIsRUFBRSxVQUFVO3dCQUMvQixzQkFBc0IsRUFBRSxtQ0FBbUM7d0JBQzNELHNCQUFzQixFQUFFLHFDQUFxQzt3QkFDN0Qsc0JBQXNCLEVBQUUsdUNBQXVDO3dCQUMvRCxhQUFhLEVBQUUsTUFBTTtxQkFDdEIsVUFDTyxDQUFDLE9BQU8sQ0FBQyxtQkFHQSx1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJOzswQkF1RWxDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsUUFBUTs7MEJBQzNCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzswQkFDeEMsTUFBTTsyQkFBQyxvQ0FBb0M7NkhBdkMxQyxRQUFRO3NCQURYLEtBQUs7Z0JBZ0JGLFdBQVc7c0JBRGQsS0FBSztnQkFTRyxJQUFJO3NCQUFaLEtBQUs7Z0JBSUYsS0FBSztzQkFEUixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtQbGF0Zm9ybSwgX2dldFNoYWRvd1Jvb3R9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9uRGVzdHJveSxcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuQ29sb3IsIG1peGluQ29sb3IsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuLyoqIFBvc3NpYmxlIG1vZGUgZm9yIGEgcHJvZ3Jlc3Mgc3Bpbm5lci4gKi9cbmV4cG9ydCB0eXBlIFByb2dyZXNzU3Bpbm5lck1vZGUgPSAnZGV0ZXJtaW5hdGUnIHwgJ2luZGV0ZXJtaW5hdGUnO1xuXG4vKipcbiAqIEJhc2UgcmVmZXJlbmNlIHNpemUgb2YgdGhlIHNwaW5uZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IEJBU0VfU0laRSA9IDEwMDtcblxuLyoqXG4gKiBCYXNlIHJlZmVyZW5jZSBzdHJva2Ugd2lkdGggb2YgdGhlIHNwaW5uZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IEJBU0VfU1RST0tFX1dJRFRIID0gMTA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0UHJvZ3Jlc3NTcGlubmVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRQcm9ncmVzc1NwaW5uZXJCYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfSxcbiAgJ3ByaW1hcnknLFxuKTtcblxuLyoqIERlZmF1bHQgYG1hdC1wcm9ncmVzcy1zcGlubmVyYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zIHtcbiAgLyoqIERlZmF1bHQgY29sb3Igb2YgdGhlIHNwaW5uZXIuICovXG4gIGNvbG9yPzogVGhlbWVQYWxldHRlO1xuICAvKiogRGlhbWV0ZXIgb2YgdGhlIHNwaW5uZXIuICovXG4gIGRpYW1ldGVyPzogbnVtYmVyO1xuICAvKiogV2lkdGggb2YgdGhlIHNwaW5uZXIncyBzdHJva2UuICovXG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICAvKipcbiAgICogV2hldGhlciB0aGUgYW5pbWF0aW9ucyBzaG91bGQgYmUgZm9yY2UgdG8gYmUgZW5hYmxlZCwgaWdub3JpbmcgaWYgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXNcbiAgICogdXNpbmcgTm9vcEFuaW1hdGlvbnNNb2R1bGUuXG4gICAqL1xuICBfZm9yY2VBbmltYXRpb25zPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcmAuICovXG5leHBvcnQgY29uc3QgTUFUX1BST0dSRVNTX1NQSU5ORVJfREVGQVVMVF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zPignbWF0LXByb2dyZXNzLXNwaW5uZXItZGVmYXVsdC1vcHRpb25zJywge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1BST0dSRVNTX1NQSU5ORVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0UHJvZ3Jlc3NTcGlubmVyRGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge2RpYW1ldGVyOiBCQVNFX1NJWkV9O1xufVxuXG4vLyAuMDAwMSBwZXJjZW50YWdlIGRpZmZlcmVuY2UgaXMgbmVjZXNzYXJ5IGluIG9yZGVyIHRvIGF2b2lkIHVud2FudGVkIGFuaW1hdGlvbiBmcmFtZXNcbi8vIGZvciBleGFtcGxlIGJlY2F1c2UgdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpcyA0IHNlY29uZHMsIC4xJSBhY2NvdW50cyB0byA0bXNcbi8vIHdoaWNoIGFyZSBlbm91Z2ggdG8gc2VlIHRoZSBmbGlja2VyIGRlc2NyaWJlZCBpblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvODk4NFxuY29uc3QgSU5ERVRFUk1JTkFURV9BTklNQVRJT05fVEVNUExBVEUgPSBgXG4gQGtleWZyYW1lcyBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1zdHJva2Utcm90YXRlLURJQU1FVEVSIHtcbiAgICAwJSAgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMCk7IH1cbiAgICAxMi41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoMCk7IH1cbiAgICAxMi41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoNzIuNWRlZyk7IH1cbiAgICAyNSUgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDcyLjVkZWcpOyB9XG5cbiAgICAyNS4wMDAxJSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMjcwZGVnKTsgfVxuICAgIDM3LjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSgyNzBkZWcpOyB9XG4gICAgMzcuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDE2MS41ZGVnKTsgfVxuICAgIDUwJSAgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMTYxLjVkZWcpOyB9XG5cbiAgICA1MC4wMDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpOyB9XG4gICAgNjIuNSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7IH1cbiAgICA2Mi41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMjUxLjVkZWcpOyB9XG4gICAgNzUlICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgyNTEuNWRlZyk7IH1cblxuICAgIDc1LjAwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTsgfVxuICAgIDg3LjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7IH1cbiAgICA4Ny41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMzQxLjVkZWcpOyB9XG4gICAgMTAwJSAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgzNDEuNWRlZyk7IH1cbiAgfVxuYDtcblxuLyoqXG4gKiBgPG1hdC1wcm9ncmVzcy1zcGlubmVyPmAgY29tcG9uZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciwgbWF0LXNwaW5uZXInLFxuICBleHBvcnRBczogJ21hdFByb2dyZXNzU3Bpbm5lcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdwcm9ncmVzc2JhcicsXG4gICAgLy8gYG1hdC1zcGlubmVyYCBpcyBoZXJlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuICAgICdjbGFzcyc6ICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciBtYXQtc3Bpbm5lcicsXG4gICAgLy8gc2V0IHRhYiBpbmRleCB0byAtMSBzbyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgdGhlIGFyaWEtbGFiZWxcbiAgICAvLyBOb3RlOiB0aGVyZSBpcyBhIGtub3duIGlzc3VlIHdpdGggSkFXUyB0aGF0IGRvZXMgbm90IHJlYWQgcHJvZ3Jlc3NiYXIgYXJpYSBsYWJlbHMgb24gRmlyZUZveFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX25vb3BBbmltYXRpb25zYCxcbiAgICAnW3N0eWxlLndpZHRoLnB4XSc6ICdkaWFtZXRlcicsXG4gICAgJ1tzdHlsZS5oZWlnaHQucHhdJzogJ2RpYW1ldGVyJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1pbl0nOiAnbW9kZSA9PT0gXCJkZXRlcm1pbmF0ZVwiID8gMCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtb2RlID09PSBcImRldGVybWluYXRlXCIgPyAxMDAgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnbW9kZSA9PT0gXCJkZXRlcm1pbmF0ZVwiID8gdmFsdWUgOiBudWxsJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnbW9kZScsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ3Byb2dyZXNzLXNwaW5uZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwcm9ncmVzcy1zcGlubmVyLmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UHJvZ3Jlc3NTcGlubmVyXG4gIGV4dGVuZHMgX01hdFByb2dyZXNzU3Bpbm5lckJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3JcbntcbiAgcHJpdmF0ZSBfZGlhbWV0ZXIgPSBCQVNFX1NJWkU7XG4gIHByaXZhdGUgX3ZhbHVlID0gMDtcbiAgcHJpdmF0ZSBfc3Ryb2tlV2lkdGg6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcmVzaXplU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBFbGVtZW50IHRvIHdoaWNoIHdlIHNob3VsZCBhZGQgdGhlIGdlbmVyYXRlZCBzdHlsZSB0YWdzIGZvciB0aGUgaW5kZXRlcm1pbmF0ZSBhbmltYXRpb24uXG4gICAqIEZvciBtb3N0IGVsZW1lbnRzIHRoaXMgaXMgdGhlIGRvY3VtZW50LCBidXQgZm9yIHRoZSBvbmVzIGluIHRoZSBTaGFkb3cgRE9NIHdlIG5lZWQgdG9cbiAgICogdXNlIHRoZSBzaGFkb3cgcm9vdC5cbiAgICovXG4gIHByaXZhdGUgX3N0eWxlUm9vdDogTm9kZTtcblxuICAvKipcbiAgICogVHJhY2tzIGRpYW1ldGVycyBvZiBleGlzdGluZyBpbnN0YW5jZXMgdG8gZGUtZHVwZSBnZW5lcmF0ZWQgc3R5bGVzIChkZWZhdWx0IGQgPSAxMDApLlxuICAgKiBXZSBuZWVkIHRvIGtlZXAgdHJhY2sgb2Ygd2hpY2ggZWxlbWVudHMgdGhlIGRpYW1ldGVycyB3ZXJlIGF0dGFjaGVkIHRvLCBiZWNhdXNlIGZvclxuICAgKiBlbGVtZW50cyBpbiB0aGUgU2hhZG93IERPTSB0aGUgc3R5bGUgdGFncyBhcmUgYXR0YWNoZWQgdG8gdGhlIHNoYWRvdyByb290LCByYXRoZXJcbiAgICogdGhhbiB0aGUgZG9jdW1lbnQgaGVhZC5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9kaWFtZXRlcnMgPSBuZXcgV2Vha01hcDxOb2RlLCBTZXQ8bnVtYmVyPj4oKTtcblxuICAvKiogV2hldGhlciB0aGUgX21hdC1hbmltYXRpb24tbm9vcGFibGUgY2xhc3Mgc2hvdWxkIGJlIGFwcGxpZWQsIGRpc2FibGluZyBhbmltYXRpb25zLiAgKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIC8qKiBBIHN0cmluZyB0aGF0IGlzIHVzZWQgZm9yIHNldHRpbmcgdGhlIHNwaW5uZXIgYW5pbWF0aW9uLW5hbWUgQ1NTIHByb3BlcnR5ICovXG4gIF9zcGlubmVyQW5pbWF0aW9uTGFiZWw6IHN0cmluZztcblxuICAvKiogVGhlIGRpYW1ldGVyIG9mIHRoZSBwcm9ncmVzcyBzcGlubmVyICh3aWxsIHNldCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHN2ZykuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaWFtZXRlcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kaWFtZXRlcjtcbiAgfVxuICBzZXQgZGlhbWV0ZXIoc2l6ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9kaWFtZXRlciA9IGNvZXJjZU51bWJlclByb3BlcnR5KHNpemUpO1xuICAgIHRoaXMuX3NwaW5uZXJBbmltYXRpb25MYWJlbCA9IHRoaXMuX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpO1xuXG4gICAgLy8gSWYgdGhpcyBpcyBzZXQgYmVmb3JlIGBuZ09uSW5pdGAsIHRoZSBzdHlsZSByb290IG1heSBub3QgaGF2ZSBiZWVuIHJlc29sdmVkIHlldC5cbiAgICBpZiAodGhpcy5fc3R5bGVSb290KSB7XG4gICAgICB0aGlzLl9hdHRhY2hTdHlsZU5vZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3Ryb2tlIHdpZHRoIG9mIHRoZSBwcm9ncmVzcyBzcGlubmVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3Ryb2tlV2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3Ryb2tlV2lkdGggfHwgdGhpcy5kaWFtZXRlciAvIDEwO1xuICB9XG4gIHNldCBzdHJva2VXaWR0aCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9zdHJva2VXaWR0aCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBNb2RlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUgKi9cbiAgQElucHV0KCkgbW9kZTogUHJvZ3Jlc3NTcGlubmVyTW9kZSA9ICdkZXRlcm1pbmF0ZSc7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZScgPyB0aGlzLl92YWx1ZSA6IDA7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX3ZhbHVlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCBjb2VyY2VOdW1iZXJQcm9wZXJ0eShuZXdWYWx1ZSkpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZTogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX1BST0dSRVNTX1NQSU5ORVJfREVGQVVMVF9PUFRJT05TKVxuICAgIGRlZmF1bHRzPzogTWF0UHJvZ3Jlc3NTcGlubmVyRGVmYXVsdE9wdGlvbnMsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYGNoYW5nZURldGVjdG9yUmVmYCwgYHZpZXdwb3J0UnVsZXJgIGFuZCBgbmdab25lYFxuICAgICAqIHBhcmFtZXRlcnMgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wXG4gICAgICovXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICB2aWV3cG9ydFJ1bGVyPzogVmlld3BvcnRSdWxlcixcbiAgICBuZ1pvbmU/OiBOZ1pvbmUsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgY29uc3QgdHJhY2tlZERpYW1ldGVycyA9IE1hdFByb2dyZXNzU3Bpbm5lci5fZGlhbWV0ZXJzO1xuICAgIHRoaXMuX3NwaW5uZXJBbmltYXRpb25MYWJlbCA9IHRoaXMuX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpO1xuXG4gICAgLy8gVGhlIGJhc2Ugc2l6ZSBpcyBhbHJlYWR5IGluc2VydGVkIHZpYSB0aGUgY29tcG9uZW50J3Mgc3RydWN0dXJhbCBzdHlsZXMuIFdlIHN0aWxsXG4gICAgLy8gbmVlZCB0byB0cmFjayBpdCBzbyB3ZSBkb24ndCBlbmQgdXAgYWRkaW5nIHRoZSBzYW1lIHN0eWxlcyBhZ2Fpbi5cbiAgICBpZiAoIXRyYWNrZWREaWFtZXRlcnMuaGFzKF9kb2N1bWVudC5oZWFkKSkge1xuICAgICAgdHJhY2tlZERpYW1ldGVycy5zZXQoX2RvY3VtZW50LmhlYWQsIG5ldyBTZXQ8bnVtYmVyPihbQkFTRV9TSVpFXSkpO1xuICAgIH1cblxuICAgIHRoaXMuX25vb3BBbmltYXRpb25zID1cbiAgICAgIGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycgJiYgISFkZWZhdWx0cyAmJiAhZGVmYXVsdHMuX2ZvcmNlQW5pbWF0aW9ucztcblxuICAgIGlmIChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ21hdC1zcGlubmVyJykge1xuICAgICAgdGhpcy5tb2RlID0gJ2luZGV0ZXJtaW5hdGUnO1xuICAgIH1cblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmNvbG9yKSB7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmRlZmF1bHRDb2xvciA9IGRlZmF1bHRzLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVmYXVsdHMuZGlhbWV0ZXIpIHtcbiAgICAgICAgdGhpcy5kaWFtZXRlciA9IGRlZmF1bHRzLmRpYW1ldGVyO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVmYXVsdHMuc3Ryb2tlV2lkdGgpIHtcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IGRlZmF1bHRzLnN0cm9rZVdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNhZmFyaSBoYXMgYW4gaXNzdWUgd2hlcmUgdGhlIGNpcmNsZSBpc24ndCBwb3NpdGlvbmVkIGNvcnJlY3RseSB3aGVuIHRoZSBwYWdlIGhhcyBhXG4gICAgLy8gZGlmZmVyZW50IHpvb20gbGV2ZWwgZnJvbSB0aGUgZGVmYXVsdC4gVGhpcyBoYW5kbGVyIHRyaWdnZXJzIGEgcmVjYWxjdWxhdGlvbiBvZiB0aGVcbiAgICAvLyBgdHJhbnNmb3JtLW9yaWdpbmAgd2hlbiB0aGUgcGFnZSB6b29tIGxldmVsIGNoYW5nZXMuXG4gICAgLy8gU2VlIGBfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luYCBmb3IgbW9yZSBpbmZvLlxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBudWxsIGNoZWNrcyBmb3IgYF9jaGFuZ2VEZXRlY3RvclJlZmAsXG4gICAgLy8gYHZpZXdwb3J0UnVsZXJgIGFuZCBgbmdab25lYC5cbiAgICBpZiAoX3BsYXRmb3JtLmlzQnJvd3NlciAmJiBfcGxhdGZvcm0uU0FGQVJJICYmIHZpZXdwb3J0UnVsZXIgJiYgY2hhbmdlRGV0ZWN0b3JSZWYgJiYgbmdab25lKSB7XG4gICAgICB0aGlzLl9yZXNpemVTdWJzY3JpcHRpb24gPSB2aWV3cG9ydFJ1bGVyLmNoYW5nZSgxNTApLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFdoZW4gdGhlIHdpbmRvdyBpcyByZXNpemUgd2hpbGUgdGhlIHNwaW5uZXIgaXMgaW4gYGluZGV0ZXJtaW5hdGVgIG1vZGUsIHdlXG4gICAgICAgIC8vIGhhdmUgdG8gbWFyayBmb3IgY2hlY2sgc28gdGhlIHRyYW5zZm9ybSBvcmlnaW4gb2YgdGhlIGNpcmNsZSBjYW4gYmUgcmVjb21wdXRlZC5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gJ2luZGV0ZXJtaW5hdGUnKSB7XG4gICAgICAgICAgbmdab25lLnJ1bigoKSA9PiBjaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBOb3RlIHRoYXQgd2UgbmVlZCB0byBsb29rIHVwIHRoZSByb290IG5vZGUgaW4gbmdPbkluaXQsIHJhdGhlciB0aGFuIHRoZSBjb25zdHJ1Y3RvciwgYmVjYXVzZVxuICAgIC8vIEFuZ3VsYXIgc2VlbXMgdG8gY3JlYXRlIHRoZSBlbGVtZW50IG91dHNpZGUgdGhlIHNoYWRvdyByb290IGFuZCB0aGVuIG1vdmVzIGl0IGluc2lkZSwgaWYgdGhlXG4gICAgLy8gbm9kZSBpcyBpbnNpZGUgYW4gYG5nSWZgIGFuZCBhIFNoYWRvd0RvbS1lbmNhcHN1bGF0ZWQgY29tcG9uZW50LlxuICAgIHRoaXMuX3N0eWxlUm9vdCA9IF9nZXRTaGFkb3dSb290KGVsZW1lbnQpIHx8IHRoaXMuX2RvY3VtZW50LmhlYWQ7XG4gICAgdGhpcy5fYXR0YWNoU3R5bGVOb2RlKCk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1pbmRldGVybWluYXRlLWFuaW1hdGlvbicpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogVGhlIHJhZGl1cyBvZiB0aGUgc3Bpbm5lciwgYWRqdXN0ZWQgZm9yIHN0cm9rZSB3aWR0aC4gKi9cbiAgX2dldENpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gKHRoaXMuZGlhbWV0ZXIgLSBCQVNFX1NUUk9LRV9XSURUSCkgLyAyO1xuICB9XG5cbiAgLyoqIFRoZSB2aWV3IGJveCBvZiB0aGUgc3Bpbm5lcidzIHN2ZyBlbGVtZW50LiAqL1xuICBfZ2V0Vmlld0JveCgpIHtcbiAgICBjb25zdCB2aWV3Qm94ID0gdGhpcy5fZ2V0Q2lyY2xlUmFkaXVzKCkgKiAyICsgdGhpcy5zdHJva2VXaWR0aDtcbiAgICByZXR1cm4gYDAgMCAke3ZpZXdCb3h9ICR7dmlld0JveH1gO1xuICB9XG5cbiAgLyoqIFRoZSBzdHJva2UgY2lyY3VtZmVyZW5jZSBvZiB0aGUgc3ZnIGNpcmNsZS4gKi9cbiAgX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMiAqIE1hdGguUEkgKiB0aGlzLl9nZXRDaXJjbGVSYWRpdXMoKTtcbiAgfVxuXG4gIC8qKiBUaGUgZGFzaCBvZmZzZXQgb2YgdGhlIHN2ZyBjaXJjbGUuICovXG4gIF9nZXRTdHJva2VEYXNoT2Zmc2V0KCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZScpIHtcbiAgICAgIHJldHVybiAodGhpcy5fZ2V0U3Ryb2tlQ2lyY3VtZmVyZW5jZSgpICogKDEwMCAtIHRoaXMuX3ZhbHVlKSkgLyAxMDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogU3Ryb2tlIHdpZHRoIG9mIHRoZSBjaXJjbGUgaW4gcGVyY2VudC4gKi9cbiAgX2dldENpcmNsZVN0cm9rZVdpZHRoKCkge1xuICAgIHJldHVybiAodGhpcy5zdHJva2VXaWR0aCAvIHRoaXMuZGlhbWV0ZXIpICogMTAwO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGB0cmFuc2Zvcm0tb3JpZ2luYCBmb3IgdGhlIGlubmVyIGNpcmNsZSBlbGVtZW50LiAqL1xuICBfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luKHN2ZzogSFRNTEVsZW1lbnQpOiBzdHJpbmcge1xuICAgIC8vIFNhZmFyaSBoYXMgYW4gaXNzdWUgd2hlcmUgdGhlIGB0cmFuc2Zvcm0tb3JpZ2luYCBkb2Vzbid0IHdvcmsgYXMgZXhwZWN0ZWQgd2hlbiB0aGUgcGFnZVxuICAgIC8vIGhhcyBhIGRpZmZlcmVudCB6b29tIGxldmVsIGZyb20gdGhlIGRlZmF1bHQuIFRoZSBwcm9ibGVtIGFwcGVhcnMgdG8gYmUgdGhhdCBhIHpvb21cbiAgICAvLyBpcyBhcHBsaWVkIG9uIHRoZSBgc3ZnYCBub2RlIGl0c2VsZi4gV2UgY2FuIHdvcmsgYXJvdW5kIGl0IGJ5IGNhbGN1bGF0aW5nIHRoZSBvcmlnaW5cbiAgICAvLyBiYXNlZCBvbiB0aGUgem9vbSBsZXZlbC4gT24gYWxsIG90aGVyIGJyb3dzZXJzIHRoZSBgY3VycmVudFNjYWxlYCBhcHBlYXJzIHRvIGFsd2F5cyBiZSAxLlxuICAgIGNvbnN0IHNjYWxlID0gKChzdmcgYXMgdW5rbm93biBhcyBTVkdTVkdFbGVtZW50KS5jdXJyZW50U2NhbGUgPz8gMSkgKiA1MDtcbiAgICByZXR1cm4gYCR7c2NhbGV9JSAke3NjYWxlfSVgO1xuICB9XG5cbiAgLyoqIER5bmFtaWNhbGx5IGdlbmVyYXRlcyBhIHN0eWxlIHRhZyBjb250YWluaW5nIHRoZSBjb3JyZWN0IGFuaW1hdGlvbiBmb3IgdGhpcyBkaWFtZXRlci4gKi9cbiAgcHJpdmF0ZSBfYXR0YWNoU3R5bGVOb2RlKCk6IHZvaWQge1xuICAgIGNvbnN0IHN0eWxlUm9vdCA9IHRoaXMuX3N0eWxlUm9vdDtcbiAgICBjb25zdCBjdXJyZW50RGlhbWV0ZXIgPSB0aGlzLl9kaWFtZXRlcjtcbiAgICBjb25zdCBkaWFtZXRlcnMgPSBNYXRQcm9ncmVzc1NwaW5uZXIuX2RpYW1ldGVycztcbiAgICBsZXQgZGlhbWV0ZXJzRm9yRWxlbWVudCA9IGRpYW1ldGVycy5nZXQoc3R5bGVSb290KTtcblxuICAgIGlmICghZGlhbWV0ZXJzRm9yRWxlbWVudCB8fCAhZGlhbWV0ZXJzRm9yRWxlbWVudC5oYXMoY3VycmVudERpYW1ldGVyKSkge1xuICAgICAgY29uc3Qgc3R5bGVUYWc6IEhUTUxTdHlsZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGVUYWcuc2V0QXR0cmlidXRlKCdtYXQtc3Bpbm5lci1hbmltYXRpb24nLCB0aGlzLl9zcGlubmVyQW5pbWF0aW9uTGFiZWwpO1xuICAgICAgc3R5bGVUYWcudGV4dENvbnRlbnQgPSB0aGlzLl9nZXRBbmltYXRpb25UZXh0KCk7XG4gICAgICBzdHlsZVJvb3QuYXBwZW5kQ2hpbGQoc3R5bGVUYWcpO1xuXG4gICAgICBpZiAoIWRpYW1ldGVyc0ZvckVsZW1lbnQpIHtcbiAgICAgICAgZGlhbWV0ZXJzRm9yRWxlbWVudCA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgICAgICBkaWFtZXRlcnMuc2V0KHN0eWxlUm9vdCwgZGlhbWV0ZXJzRm9yRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGRpYW1ldGVyc0ZvckVsZW1lbnQuYWRkKGN1cnJlbnREaWFtZXRlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdlbmVyYXRlcyBhbmltYXRpb24gc3R5bGVzIGFkanVzdGVkIGZvciB0aGUgc3Bpbm5lcidzIGRpYW1ldGVyLiAqL1xuICBwcml2YXRlIF9nZXRBbmltYXRpb25UZXh0KCk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3Ryb2tlQ2lyY3VtZmVyZW5jZSA9IHRoaXMuX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gKFxuICAgICAgSU5ERVRFUk1JTkFURV9BTklNQVRJT05fVEVNUExBVEVcbiAgICAgICAgLy8gQW5pbWF0aW9uIHNob3VsZCBiZWdpbiBhdCA1JSBhbmQgZW5kIGF0IDgwJVxuICAgICAgICAucmVwbGFjZSgvU1RBUlRfVkFMVUUvZywgYCR7MC45NSAqIHN0cm9rZUNpcmN1bWZlcmVuY2V9YClcbiAgICAgICAgLnJlcGxhY2UoL0VORF9WQUxVRS9nLCBgJHswLjIgKiBzdHJva2VDaXJjdW1mZXJlbmNlfWApXG4gICAgICAgIC5yZXBsYWNlKC9ESUFNRVRFUi9nLCBgJHt0aGlzLl9zcGlubmVyQW5pbWF0aW9uTGFiZWx9YClcbiAgICApO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGNpcmNsZSBkaWFtZXRlciBmb3JtYXR0ZWQgZm9yIHVzZSB3aXRoIHRoZSBhbmltYXRpb24tbmFtZSBDU1MgcHJvcGVydHkuICovXG4gIHByaXZhdGUgX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpOiBzdHJpbmcge1xuICAgIC8vIFRoZSBzdHJpbmcgb2YgYSBmbG9hdCBwb2ludCBudW1iZXIgd2lsbCBpbmNsdWRlIGEgcGVyaW9kIOKAmC7igJkgY2hhcmFjdGVyLFxuICAgIC8vIHdoaWNoIGlzIG5vdCB2YWxpZCBmb3IgYSBDU1MgYW5pbWF0aW9uLW5hbWUuXG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJ18nKTtcbiAgfVxufVxuIiwiPCEtLVxuICBwcmVzZXJ2ZUFzcGVjdFJhdGlvIG9mIHhNaWRZTWlkIG1lZXQgYXMgdGhlIGNlbnRlciBvZiB0aGUgdmlld3BvcnQgaXMgdGhlIGNpcmNsZSdzXG4gIGNlbnRlci4gVGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlIHdpbGwgcmVtYWluIGF0IHRoZSBjZW50ZXIgb2YgdGhlIG1hdC1wcm9ncmVzcy1zcGlubmVyXG4gIGVsZW1lbnQgY29udGFpbmluZyB0aGUgU1ZHLlxuLS0+XG48IS0tXG4gIEFsbCBjaGlsZHJlbiBuZWVkIHRvIGJlIGhpZGRlbiBmb3Igc2NyZWVuIHJlYWRlcnMgaW4gb3JkZXIgdG8gc3VwcG9ydCBDaHJvbWVWb3guXG4gIE1vcmUgY29udGV4dCBpbiB0aGUgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIyMTY1LlxuLS0+XG48c3ZnXG4gIFtzdHlsZS53aWR0aC5weF09XCJkaWFtZXRlclwiXG4gIFtzdHlsZS5oZWlnaHQucHhdPVwiZGlhbWV0ZXJcIlxuICBbYXR0ci52aWV3Qm94XT1cIl9nZXRWaWV3Qm94KClcIlxuICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiXG4gIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgW25nU3dpdGNoXT1cIm1vZGUgPT09ICdpbmRldGVybWluYXRlJ1wiXG4gIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICNzdmc+XG5cbiAgPCEtLVxuICAgIFRlY2huaWNhbGx5IHdlIGNhbiByZXVzZSB0aGUgc2FtZSBgY2lyY2xlYCBlbGVtZW50LCBob3dldmVyIFNhZmFyaSBoYXMgYW4gaXNzdWUgdGhhdCBicmVha3NcbiAgICB0aGUgU1ZHIHJlbmRlcmluZyBpbiBkZXRlcm1pbmF0ZSBtb2RlLCBhZnRlciBzd2l0Y2hpbmcgYmV0d2VlbiBpbmRldGVybWluYXRlIGFuZCBkZXRlcm1pbmF0ZS5cbiAgICBVc2luZyBhIGRpZmZlcmVudCBlbGVtZW50IGF2b2lkcyB0aGUgaXNzdWUuIEFuIGFsdGVybmF0aXZlIHRvIHRoaXMgaXMgYWRkaW5nIGBkaXNwbGF5OiBub25lYFxuICAgIGZvciBhIHNwbGl0IHNlY29uZCBhbmQgdGhlbiByZW1vdmluZyBpdCB3aGVuIHN3aXRjaGluZyBiZXR3ZWVuIG1vZGVzLCBidXQgaXQncyBoYXJkIHRvIGtub3dcbiAgICBmb3IgaG93IGxvbmcgdG8gaGlkZSB0aGUgZWxlbWVudCBhbmQgaXQgY2FuIGNhdXNlIHRoZSBVSSB0byBibGluay5cbiAgLS0+XG4gIDxjaXJjbGVcbiAgICAqbmdTd2l0Y2hDYXNlPVwidHJ1ZVwiXG4gICAgY3g9XCI1MCVcIlxuICAgIGN5PVwiNTAlXCJcbiAgICBbYXR0ci5yXT1cIl9nZXRDaXJjbGVSYWRpdXMoKVwiXG4gICAgW3N0eWxlLmFuaW1hdGlvbi1uYW1lXT1cIidtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1zdHJva2Utcm90YXRlLScgKyBfc3Bpbm5lckFuaW1hdGlvbkxhYmVsXCJcbiAgICBbc3R5bGUuc3Ryb2tlLWRhc2hvZmZzZXQucHhdPVwiX2dldFN0cm9rZURhc2hPZmZzZXQoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNoYXJyYXkucHhdPVwiX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS13aWR0aC4lXT1cIl9nZXRDaXJjbGVTdHJva2VXaWR0aCgpXCJcbiAgICBbc3R5bGUudHJhbnNmb3JtLW9yaWdpbl09XCJfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luKHN2ZylcIj48L2NpcmNsZT5cblxuICA8Y2lyY2xlXG4gICAgKm5nU3dpdGNoQ2FzZT1cImZhbHNlXCJcbiAgICBjeD1cIjUwJVwiXG4gICAgY3k9XCI1MCVcIlxuICAgIFthdHRyLnJdPVwiX2dldENpcmNsZVJhZGl1cygpXCJcbiAgICBbc3R5bGUuc3Ryb2tlLWRhc2hvZmZzZXQucHhdPVwiX2dldFN0cm9rZURhc2hPZmZzZXQoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNoYXJyYXkucHhdPVwiX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS13aWR0aC4lXT1cIl9nZXRDaXJjbGVTdHJva2VXaWR0aCgpXCJcbiAgICBbc3R5bGUudHJhbnNmb3JtLW9yaWdpbl09XCJfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luKHN2ZylcIj48L2NpcmNsZT5cbjwvc3ZnPlxuIl19