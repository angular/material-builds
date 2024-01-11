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
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, Optional, ViewEncapsulation, ChangeDetectorRef, NgZone, CSP_NONCE, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, } from '@angular/material/progress-spinner';
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
// Boilerplate for applying mixins to MatLegacyProgressSpinner.
/** @docs-private */
const _MatProgressSpinnerBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}, 'primary');
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
 * @deprecated Use `MatProgressSpinner` from `@angular/material/progress-spinner` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyProgressSpinner extends _MatProgressSpinnerBase {
    /**
     * Tracks diameters of existing instances to de-dupe generated styles (default d = 100).
     * We need to keep track of which elements the diameters were attached to, because for
     * elements in the Shadow DOM the style tags are attached to the shadow root, rather
     * than the document head.
     */
    static { this._diameters = new WeakMap(); }
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
    constructor(elementRef, _platform, _document, animationMode, defaults, 
    /**
     * @deprecated `changeDetectorRef`, `viewportRuler` and `ngZone`
     * parameters to become required.
     * @breaking-change 14.0.0
     */
    changeDetectorRef, viewportRuler, ngZone, _nonce) {
        super(elementRef);
        this._document = _document;
        this._nonce = _nonce;
        this._diameter = BASE_SIZE;
        this._value = 0;
        this._resizeSubscription = Subscription.EMPTY;
        /** Mode of the progress circle */
        this.mode = 'determinate';
        const trackedDiameters = MatLegacyProgressSpinner._diameters;
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
        const diameters = MatLegacyProgressSpinner._diameters;
        let diametersForElement = diameters.get(styleRoot);
        if (!diametersForElement || !diametersForElement.has(currentDiameter)) {
            const styleTag = this._document.createElement('style');
            if (this._nonce) {
                styleTag.nonce = this._nonce;
            }
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacyProgressSpinner, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: DOCUMENT, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i0.NgZone }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatLegacyProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: { color: "color", diameter: "diameter", strokeWidth: "strokeWidth", mode: "mode", value: "value" }, host: { attributes: { "role": "progressbar", "tabindex": "-1" }, properties: { "class._mat-animation-noopable": "_noopAnimations", "style.width.px": "diameter", "style.height.px": "diameter", "attr.aria-valuemin": "mode === \"determinate\" ? 0 : null", "attr.aria-valuemax": "mode === \"determinate\" ? 100 : null", "attr.aria-valuenow": "mode === \"determinate\" ? value : null", "attr.mode": "mode" }, classAttribute: "mat-progress-spinner mat-spinner" }, exportAs: ["matProgressSpinner"], usesInheritance: true, ngImport: i0, template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG.\n-->\n<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_getViewBox()\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\"\n  aria-hidden=\"true\"\n  #svg>\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + _spinnerAnimationLabel\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n</svg>\n", styles: [".mat-progress-spinner{display:block;position:relative;overflow:hidden}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:rgba(0,0,0,0);transition:stroke-dashoffset 225ms linear}.cdk-high-contrast-active .mat-progress-spinner circle{stroke:CanvasText}.mat-progress-spinner[mode=indeterminate] svg{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}.mat-progress-spinner[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}.mat-progress-spinner._mat-animation-noopable svg,.mat-progress-spinner._mat-animation-noopable circle{animation:none;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}"], dependencies: [{ kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacyProgressSpinner, decorators: [{
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
                }] }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CSP_NONCE]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { diameter: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], mode: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1wcm9ncmVzcy1zcGlubmVyL3Byb2dyZXNzLXNwaW5uZXIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLGlCQUFpQixFQUVqQixpQkFBaUIsRUFFakIsTUFBTSxFQUNOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVcsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUVMLG9DQUFvQyxHQUVyQyxNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBRWxDOzs7R0FHRztBQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUV0Qjs7O0dBR0c7QUFDSCxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3QiwrREFBK0Q7QUFDL0Qsb0JBQW9CO0FBQ3BCLE1BQU0sdUJBQXVCLEdB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VUFBVTt3QkFDL0Isc0JBQXNCLEVBQUUsbUNBQW1DO3dCQUMzRCxzQkFBc0IsRUFBRSxxQ0FBcUM7d0JBQzdELHNCQUFzQixFQUFFLHVDQUF1Qzt3QkFDL0QsYUFBYSxFQUFFLE1BQU07cUJBQ3RCLFVBQ08sQ0FBQyxPQUFPLENBQUMsbUJBR0EsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSTs7MEJBdUVsQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7OzBCQUMzQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs7MEJBQ3hDLE1BQU07MkJBQUMsb0NBQW9DOzswQkFVM0MsTUFBTTsyQkFBQyxTQUFTOzswQkFBRyxRQUFROzRDQWpEMUIsUUFBUTtzQkFEWCxLQUFLO2dCQWdCRixXQUFXO3NCQURkLEtBQUs7Z0JBU0csSUFBSTtzQkFBWixLQUFLO2dCQUlGLEtBQUs7c0JBRFIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm0sIF9nZXRTaGFkb3dSb290fSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9uRGVzdHJveSxcbiAgTmdab25lLFxuICBDU1BfTk9OQ0UsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgbWl4aW5Db2xvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zLFxuICBNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlMsXG4gIFByb2dyZXNzU3Bpbm5lck1vZGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXInO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIEJhc2UgcmVmZXJlbmNlIHNpemUgb2YgdGhlIHNwaW5uZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IEJBU0VfU0laRSA9IDEwMDtcblxuLyoqXG4gKiBCYXNlIHJlZmVyZW5jZSBzdHJva2Ugd2lkdGggb2YgdGhlIHNwaW5uZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IEJBU0VfU1RST0tFX1dJRFRIID0gMTA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0TGVnYWN5UHJvZ3Jlc3NTcGlubmVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRQcm9ncmVzc1NwaW5uZXJCYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfSxcbiAgJ3ByaW1hcnknLFxuKTtcblxuLy8gLjAwMDEgcGVyY2VudGFnZSBkaWZmZXJlbmNlIGlzIG5lY2Vzc2FyeSBpbiBvcmRlciB0byBhdm9pZCB1bndhbnRlZCBhbmltYXRpb24gZnJhbWVzXG4vLyBmb3IgZXhhbXBsZSBiZWNhdXNlIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaXMgNCBzZWNvbmRzLCAuMSUgYWNjb3VudHMgdG8gNG1zXG4vLyB3aGljaCBhcmUgZW5vdWdoIHRvIHNlZSB0aGUgZmxpY2tlciBkZXNjcmliZWQgaW5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzg5ODRcbmNvbnN0IElOREVURVJNSU5BVEVfQU5JTUFUSU9OX1RFTVBMQVRFID0gYFxuIEBrZXlmcmFtZXMgbWF0LXByb2dyZXNzLXNwaW5uZXItc3Ryb2tlLXJvdGF0ZS1ESUFNRVRFUiB7XG4gICAgMCUgICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDApOyB9XG4gICAgMTIuNSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlKDApOyB9XG4gICAgMTIuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDcyLjVkZWcpOyB9XG4gICAgMjUlICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSg3Mi41ZGVnKTsgfVxuXG4gICAgMjUuMDAwMSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDI3MGRlZyk7IH1cbiAgICAzNy41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoMjcwZGVnKTsgfVxuICAgIDM3LjUwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgxNjEuNWRlZyk7IH1cbiAgICA1MCUgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDE2MS41ZGVnKTsgfVxuXG4gICAgNTAuMDAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTsgfVxuICAgIDYyLjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpOyB9XG4gICAgNjIuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDI1MS41ZGVnKTsgfVxuICAgIDc1JSAgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMjUxLjVkZWcpOyB9XG5cbiAgICA3NS4wMDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7IH1cbiAgICA4Ny41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpOyB9XG4gICAgODcuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDM0MS41ZGVnKTsgfVxuICAgIDEwMCUgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMzQxLjVkZWcpOyB9XG4gIH1cbmA7XG5cbi8qKlxuICogYDxtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcj5gIGNvbXBvbmVudC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0UHJvZ3Jlc3NTcGlubmVyYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1wcm9ncmVzcy1zcGlubmVyLCBtYXQtc3Bpbm5lcicsXG4gIGV4cG9ydEFzOiAnbWF0UHJvZ3Jlc3NTcGlubmVyJyxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ3Byb2dyZXNzYmFyJyxcbiAgICAvLyBgbWF0LXNwaW5uZXJgIGlzIGhlcmUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXG4gICAgJ2NsYXNzJzogJ21hdC1wcm9ncmVzcy1zcGlubmVyIG1hdC1zcGlubmVyJyxcbiAgICAvLyBzZXQgdGFiIGluZGV4IHRvIC0xIHNvIHNjcmVlbiByZWFkZXJzIHdpbGwgcmVhZCB0aGUgYXJpYS1sYWJlbFxuICAgIC8vIE5vdGU6IHRoZXJlIGlzIGEga25vd24gaXNzdWUgd2l0aCBKQVdTIHRoYXQgZG9lcyBub3QgcmVhZCBwcm9ncmVzc2JhciBhcmlhIGxhYmVscyBvbiBGaXJlRm94XG4gICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6IGBfbm9vcEFuaW1hdGlvbnNgLFxuICAgICdbc3R5bGUud2lkdGgucHhdJzogJ2RpYW1ldGVyJyxcbiAgICAnW3N0eWxlLmhlaWdodC5weF0nOiAnZGlhbWV0ZXInLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWluXSc6ICdtb2RlID09PSBcImRldGVybWluYXRlXCIgPyAwIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVtYXhdJzogJ21vZGUgPT09IFwiZGV0ZXJtaW5hdGVcIiA/IDEwMCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICdtb2RlID09PSBcImRldGVybWluYXRlXCIgPyB2YWx1ZSA6IG51bGwnLFxuICAgICdbYXR0ci5tb2RlXSc6ICdtb2RlJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIHRlbXBsYXRlVXJsOiAncHJvZ3Jlc3Mtc3Bpbm5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Byb2dyZXNzLXNwaW5uZXIuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lQcm9ncmVzc1NwaW5uZXJcbiAgZXh0ZW5kcyBfTWF0UHJvZ3Jlc3NTcGlubmVyQmFzZVxuICBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDYW5Db2xvclxue1xuICBwcml2YXRlIF9kaWFtZXRlciA9IEJBU0VfU0laRTtcbiAgcHJpdmF0ZSBfdmFsdWUgPSAwO1xuICBwcml2YXRlIF9zdHJva2VXaWR0aDogbnVtYmVyO1xuICBwcml2YXRlIF9yZXNpemVTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqXG4gICAqIEVsZW1lbnQgdG8gd2hpY2ggd2Ugc2hvdWxkIGFkZCB0aGUgZ2VuZXJhdGVkIHN0eWxlIHRhZ3MgZm9yIHRoZSBpbmRldGVybWluYXRlIGFuaW1hdGlvbi5cbiAgICogRm9yIG1vc3QgZWxlbWVudHMgdGhpcyBpcyB0aGUgZG9jdW1lbnQsIGJ1dCBmb3IgdGhlIG9uZXMgaW4gdGhlIFNoYWRvdyBET00gd2UgbmVlZCB0b1xuICAgKiB1c2UgdGhlIHNoYWRvdyByb290LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3R5bGVSb290OiBOb2RlO1xuXG4gIC8qKlxuICAgKiBUcmFja3MgZGlhbWV0ZXJzIG9mIGV4aXN0aW5nIGluc3RhbmNlcyB0byBkZS1kdXBlIGdlbmVyYXRlZCBzdHlsZXMgKGRlZmF1bHQgZCA9IDEwMCkuXG4gICAqIFdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiB3aGljaCBlbGVtZW50cyB0aGUgZGlhbWV0ZXJzIHdlcmUgYXR0YWNoZWQgdG8sIGJlY2F1c2UgZm9yXG4gICAqIGVsZW1lbnRzIGluIHRoZSBTaGFkb3cgRE9NIHRoZSBzdHlsZSB0YWdzIGFyZSBhdHRhY2hlZCB0byB0aGUgc2hhZG93IHJvb3QsIHJhdGhlclxuICAgKiB0aGFuIHRoZSBkb2N1bWVudCBoZWFkLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX2RpYW1ldGVycyA9IG5ldyBXZWFrTWFwPE5vZGUsIFNldDxudW1iZXI+PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBfbWF0LWFuaW1hdGlvbi1ub29wYWJsZSBjbGFzcyBzaG91bGQgYmUgYXBwbGllZCwgZGlzYWJsaW5nIGFuaW1hdGlvbnMuICAqL1xuICBfbm9vcEFuaW1hdGlvbnM6IGJvb2xlYW47XG5cbiAgLyoqIEEgc3RyaW5nIHRoYXQgaXMgdXNlZCBmb3Igc2V0dGluZyB0aGUgc3Bpbm5lciBhbmltYXRpb24tbmFtZSBDU1MgcHJvcGVydHkgKi9cbiAgX3NwaW5uZXJBbmltYXRpb25MYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgZGlhbWV0ZXIgb2YgdGhlIHByb2dyZXNzIHNwaW5uZXIgKHdpbGwgc2V0IHdpZHRoIGFuZCBoZWlnaHQgb2Ygc3ZnKS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpYW1ldGVyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RpYW1ldGVyO1xuICB9XG4gIHNldCBkaWFtZXRlcihzaXplOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2RpYW1ldGVyID0gY29lcmNlTnVtYmVyUHJvcGVydHkoc2l6ZSk7XG4gICAgdGhpcy5fc3Bpbm5lckFuaW1hdGlvbkxhYmVsID0gdGhpcy5fZ2V0U3Bpbm5lckFuaW1hdGlvbkxhYmVsKCk7XG5cbiAgICAvLyBJZiB0aGlzIGlzIHNldCBiZWZvcmUgYG5nT25Jbml0YCwgdGhlIHN0eWxlIHJvb3QgbWF5IG5vdCBoYXZlIGJlZW4gcmVzb2x2ZWQgeWV0LlxuICAgIGlmICh0aGlzLl9zdHlsZVJvb3QpIHtcbiAgICAgIHRoaXMuX2F0dGFjaFN0eWxlTm9kZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTdHJva2Ugd2lkdGggb2YgdGhlIHByb2dyZXNzIHNwaW5uZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdHJva2VXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zdHJva2VXaWR0aCB8fCB0aGlzLmRpYW1ldGVyIC8gMTA7XG4gIH1cbiAgc2V0IHN0cm9rZVdpZHRoKHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX3N0cm9rZVdpZHRoID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIE1vZGUgb2YgdGhlIHByb2dyZXNzIGNpcmNsZSAqL1xuICBASW5wdXQoKSBtb2RlOiBQcm9ncmVzc1NwaW5uZXJNb2RlID0gJ2RldGVybWluYXRlJztcblxuICAvKiogVmFsdWUgb2YgdGhlIHByb2dyZXNzIGNpcmNsZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gJ2RldGVybWluYXRlJyA/IHRoaXMuX3ZhbHVlIDogMDtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fdmFsdWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIGNvZXJjZU51bWJlclByb3BlcnR5KG5ld1ZhbHVlKSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlOiBzdHJpbmcsXG4gICAgQEluamVjdChNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlMpXG4gICAgZGVmYXVsdHM/OiBNYXRQcm9ncmVzc1NwaW5uZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgY2hhbmdlRGV0ZWN0b3JSZWZgLCBgdmlld3BvcnRSdWxlcmAgYW5kIGBuZ1pvbmVgXG4gICAgICogcGFyYW1ldGVycyB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjBcbiAgICAgKi9cbiAgICBjaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHZpZXdwb3J0UnVsZXI/OiBWaWV3cG9ydFJ1bGVyLFxuICAgIG5nWm9uZT86IE5nWm9uZSxcbiAgICBASW5qZWN0KENTUF9OT05DRSkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfbm9uY2U/OiBzdHJpbmcgfCBudWxsLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIGNvbnN0IHRyYWNrZWREaWFtZXRlcnMgPSBNYXRMZWdhY3lQcm9ncmVzc1NwaW5uZXIuX2RpYW1ldGVycztcbiAgICB0aGlzLl9zcGlubmVyQW5pbWF0aW9uTGFiZWwgPSB0aGlzLl9nZXRTcGlubmVyQW5pbWF0aW9uTGFiZWwoKTtcblxuICAgIC8vIFRoZSBiYXNlIHNpemUgaXMgYWxyZWFkeSBpbnNlcnRlZCB2aWEgdGhlIGNvbXBvbmVudCdzIHN0cnVjdHVyYWwgc3R5bGVzLiBXZSBzdGlsbFxuICAgIC8vIG5lZWQgdG8gdHJhY2sgaXQgc28gd2UgZG9uJ3QgZW5kIHVwIGFkZGluZyB0aGUgc2FtZSBzdHlsZXMgYWdhaW4uXG4gICAgaWYgKCF0cmFja2VkRGlhbWV0ZXJzLmhhcyhfZG9jdW1lbnQuaGVhZCkpIHtcbiAgICAgIHRyYWNrZWREaWFtZXRlcnMuc2V0KF9kb2N1bWVudC5oZWFkLCBuZXcgU2V0PG51bWJlcj4oW0JBU0VfU0laRV0pKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyA9XG4gICAgICBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnICYmICEhZGVmYXVsdHMgJiYgIWRlZmF1bHRzLl9mb3JjZUFuaW1hdGlvbnM7XG5cbiAgICBpZiAoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdtYXQtc3Bpbm5lcicpIHtcbiAgICAgIHRoaXMubW9kZSA9ICdpbmRldGVybWluYXRlJztcbiAgICB9XG5cbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGlmIChkZWZhdWx0cy5jb2xvcikge1xuICAgICAgICB0aGlzLmNvbG9yID0gdGhpcy5kZWZhdWx0Q29sb3IgPSBkZWZhdWx0cy5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLmRpYW1ldGVyKSB7XG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBkZWZhdWx0cy5kaWFtZXRlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLnN0cm9rZVdpZHRoKSB7XG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSBkZWZhdWx0cy5zdHJva2VXaWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTYWZhcmkgaGFzIGFuIGlzc3VlIHdoZXJlIHRoZSBjaXJjbGUgaXNuJ3QgcG9zaXRpb25lZCBjb3JyZWN0bHkgd2hlbiB0aGUgcGFnZSBoYXMgYVxuICAgIC8vIGRpZmZlcmVudCB6b29tIGxldmVsIGZyb20gdGhlIGRlZmF1bHQuIFRoaXMgaGFuZGxlciB0cmlnZ2VycyBhIHJlY2FsY3VsYXRpb24gb2YgdGhlXG4gICAgLy8gYHRyYW5zZm9ybS1vcmlnaW5gIHdoZW4gdGhlIHBhZ2Ugem9vbSBsZXZlbCBjaGFuZ2VzLlxuICAgIC8vIFNlZSBgX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbmAgZm9yIG1vcmUgaW5mby5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBSZW1vdmUgbnVsbCBjaGVja3MgZm9yIGBfY2hhbmdlRGV0ZWN0b3JSZWZgLFxuICAgIC8vIGB2aWV3cG9ydFJ1bGVyYCBhbmQgYG5nWm9uZWAuXG4gICAgaWYgKF9wbGF0Zm9ybS5pc0Jyb3dzZXIgJiYgX3BsYXRmb3JtLlNBRkFSSSAmJiB2aWV3cG9ydFJ1bGVyICYmIGNoYW5nZURldGVjdG9yUmVmICYmIG5nWm9uZSkge1xuICAgICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uID0gdmlld3BvcnRSdWxlci5jaGFuZ2UoMTUwKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBXaGVuIHRoZSB3aW5kb3cgaXMgcmVzaXplIHdoaWxlIHRoZSBzcGlubmVyIGlzIGluIGBpbmRldGVybWluYXRlYCBtb2RlLCB3ZVxuICAgICAgICAvLyBoYXZlIHRvIG1hcmsgZm9yIGNoZWNrIHNvIHRoZSB0cmFuc2Zvcm0gb3JpZ2luIG9mIHRoZSBjaXJjbGUgY2FuIGJlIHJlY29tcHV0ZWQuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdpbmRldGVybWluYXRlJykge1xuICAgICAgICAgIG5nWm9uZS5ydW4oKCkgPT4gY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gTm90ZSB0aGF0IHdlIG5lZWQgdG8gbG9vayB1cCB0aGUgcm9vdCBub2RlIGluIG5nT25Jbml0LCByYXRoZXIgdGhhbiB0aGUgY29uc3RydWN0b3IsIGJlY2F1c2VcbiAgICAvLyBBbmd1bGFyIHNlZW1zIHRvIGNyZWF0ZSB0aGUgZWxlbWVudCBvdXRzaWRlIHRoZSBzaGFkb3cgcm9vdCBhbmQgdGhlbiBtb3ZlcyBpdCBpbnNpZGUsIGlmIHRoZVxuICAgIC8vIG5vZGUgaXMgaW5zaWRlIGFuIGBuZ0lmYCBhbmQgYSBTaGFkb3dEb20tZW5jYXBzdWxhdGVkIGNvbXBvbmVudC5cbiAgICB0aGlzLl9zdHlsZVJvb3QgPSBfZ2V0U2hhZG93Um9vdChlbGVtZW50KSB8fCB0aGlzLl9kb2N1bWVudC5oZWFkO1xuICAgIHRoaXMuX2F0dGFjaFN0eWxlTm9kZSgpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXByb2dyZXNzLXNwaW5uZXItaW5kZXRlcm1pbmF0ZS1hbmltYXRpb24nKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIHNwaW5uZXIsIGFkanVzdGVkIGZvciBzdHJva2Ugd2lkdGguICovXG4gIF9nZXRDaXJjbGVSYWRpdXMoKSB7XG4gICAgcmV0dXJuICh0aGlzLmRpYW1ldGVyIC0gQkFTRV9TVFJPS0VfV0lEVEgpIC8gMjtcbiAgfVxuXG4gIC8qKiBUaGUgdmlldyBib3ggb2YgdGhlIHNwaW5uZXIncyBzdmcgZWxlbWVudC4gKi9cbiAgX2dldFZpZXdCb3goKSB7XG4gICAgY29uc3Qgdmlld0JveCA9IHRoaXMuX2dldENpcmNsZVJhZGl1cygpICogMiArIHRoaXMuc3Ryb2tlV2lkdGg7XG4gICAgcmV0dXJuIGAwIDAgJHt2aWV3Qm94fSAke3ZpZXdCb3h9YDtcbiAgfVxuXG4gIC8qKiBUaGUgc3Ryb2tlIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIHN2ZyBjaXJjbGUuICovXG4gIF9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDIgKiBNYXRoLlBJICogdGhpcy5fZ2V0Q2lyY2xlUmFkaXVzKCk7XG4gIH1cblxuICAvKiogVGhlIGRhc2ggb2Zmc2V0IG9mIHRoZSBzdmcgY2lyY2xlLiAqL1xuICBfZ2V0U3Ryb2tlRGFzaE9mZnNldCgpIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICByZXR1cm4gKHRoaXMuX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKSAqICgxMDAgLSB0aGlzLl92YWx1ZSkpIC8gMTAwO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFN0cm9rZSB3aWR0aCBvZiB0aGUgY2lyY2xlIGluIHBlcmNlbnQuICovXG4gIF9nZXRDaXJjbGVTdHJva2VXaWR0aCgpIHtcbiAgICByZXR1cm4gKHRoaXMuc3Ryb2tlV2lkdGggLyB0aGlzLmRpYW1ldGVyKSAqIDEwMDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBgdHJhbnNmb3JtLW9yaWdpbmAgZm9yIHRoZSBpbm5lciBjaXJjbGUgZWxlbWVudC4gKi9cbiAgX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmc6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICAvLyBTYWZhcmkgaGFzIGFuIGlzc3VlIHdoZXJlIHRoZSBgdHJhbnNmb3JtLW9yaWdpbmAgZG9lc24ndCB3b3JrIGFzIGV4cGVjdGVkIHdoZW4gdGhlIHBhZ2VcbiAgICAvLyBoYXMgYSBkaWZmZXJlbnQgem9vbSBsZXZlbCBmcm9tIHRoZSBkZWZhdWx0LiBUaGUgcHJvYmxlbSBhcHBlYXJzIHRvIGJlIHRoYXQgYSB6b29tXG4gICAgLy8gaXMgYXBwbGllZCBvbiB0aGUgYHN2Z2Agbm9kZSBpdHNlbGYuIFdlIGNhbiB3b3JrIGFyb3VuZCBpdCBieSBjYWxjdWxhdGluZyB0aGUgb3JpZ2luXG4gICAgLy8gYmFzZWQgb24gdGhlIHpvb20gbGV2ZWwuIE9uIGFsbCBvdGhlciBicm93c2VycyB0aGUgYGN1cnJlbnRTY2FsZWAgYXBwZWFycyB0byBhbHdheXMgYmUgMS5cbiAgICBjb25zdCBzY2FsZSA9ICgoc3ZnIGFzIHVua25vd24gYXMgU1ZHU1ZHRWxlbWVudCkuY3VycmVudFNjYWxlID8/IDEpICogNTA7XG4gICAgcmV0dXJuIGAke3NjYWxlfSUgJHtzY2FsZX0lYDtcbiAgfVxuXG4gIC8qKiBEeW5hbWljYWxseSBnZW5lcmF0ZXMgYSBzdHlsZSB0YWcgY29udGFpbmluZyB0aGUgY29ycmVjdCBhbmltYXRpb24gZm9yIHRoaXMgZGlhbWV0ZXIuICovXG4gIHByaXZhdGUgX2F0dGFjaFN0eWxlTm9kZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzdHlsZVJvb3QgPSB0aGlzLl9zdHlsZVJvb3Q7XG4gICAgY29uc3QgY3VycmVudERpYW1ldGVyID0gdGhpcy5fZGlhbWV0ZXI7XG4gICAgY29uc3QgZGlhbWV0ZXJzID0gTWF0TGVnYWN5UHJvZ3Jlc3NTcGlubmVyLl9kaWFtZXRlcnM7XG4gICAgbGV0IGRpYW1ldGVyc0ZvckVsZW1lbnQgPSBkaWFtZXRlcnMuZ2V0KHN0eWxlUm9vdCk7XG5cbiAgICBpZiAoIWRpYW1ldGVyc0ZvckVsZW1lbnQgfHwgIWRpYW1ldGVyc0ZvckVsZW1lbnQuaGFzKGN1cnJlbnREaWFtZXRlcikpIHtcbiAgICAgIGNvbnN0IHN0eWxlVGFnOiBIVE1MU3R5bGVFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgICAgaWYgKHRoaXMuX25vbmNlKSB7XG4gICAgICAgIHN0eWxlVGFnLm5vbmNlID0gdGhpcy5fbm9uY2U7XG4gICAgICB9XG5cbiAgICAgIHN0eWxlVGFnLnNldEF0dHJpYnV0ZSgnbWF0LXNwaW5uZXItYW5pbWF0aW9uJywgdGhpcy5fc3Bpbm5lckFuaW1hdGlvbkxhYmVsKTtcbiAgICAgIHN0eWxlVGFnLnRleHRDb250ZW50ID0gdGhpcy5fZ2V0QW5pbWF0aW9uVGV4dCgpO1xuICAgICAgc3R5bGVSb290LmFwcGVuZENoaWxkKHN0eWxlVGFnKTtcblxuICAgICAgaWYgKCFkaWFtZXRlcnNGb3JFbGVtZW50KSB7XG4gICAgICAgIGRpYW1ldGVyc0ZvckVsZW1lbnQgPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgICAgICAgZGlhbWV0ZXJzLnNldChzdHlsZVJvb3QsIGRpYW1ldGVyc0ZvckVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBkaWFtZXRlcnNGb3JFbGVtZW50LmFkZChjdXJyZW50RGlhbWV0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZW5lcmF0ZXMgYW5pbWF0aW9uIHN0eWxlcyBhZGp1c3RlZCBmb3IgdGhlIHNwaW5uZXIncyBkaWFtZXRlci4gKi9cbiAgcHJpdmF0ZSBfZ2V0QW5pbWF0aW9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0cm9rZUNpcmN1bWZlcmVuY2UgPSB0aGlzLl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIElOREVURVJNSU5BVEVfQU5JTUFUSU9OX1RFTVBMQVRFXG4gICAgICAgIC8vIEFuaW1hdGlvbiBzaG91bGQgYmVnaW4gYXQgNSUgYW5kIGVuZCBhdCA4MCVcbiAgICAgICAgLnJlcGxhY2UoL1NUQVJUX1ZBTFVFL2csIGAkezAuOTUgKiBzdHJva2VDaXJjdW1mZXJlbmNlfWApXG4gICAgICAgIC5yZXBsYWNlKC9FTkRfVkFMVUUvZywgYCR7MC4yICogc3Ryb2tlQ2lyY3VtZmVyZW5jZX1gKVxuICAgICAgICAucmVwbGFjZSgvRElBTUVURVIvZywgYCR7dGhpcy5fc3Bpbm5lckFuaW1hdGlvbkxhYmVsfWApXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBjaXJjbGUgZGlhbWV0ZXIgZm9ybWF0dGVkIGZvciB1c2Ugd2l0aCB0aGUgYW5pbWF0aW9uLW5hbWUgQ1NTIHByb3BlcnR5LiAqL1xuICBwcml2YXRlIF9nZXRTcGlubmVyQW5pbWF0aW9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAvLyBUaGUgc3RyaW5nIG9mIGEgZmxvYXQgcG9pbnQgbnVtYmVyIHdpbGwgaW5jbHVkZSBhIHBlcmlvZCDigJgu4oCZIGNoYXJhY3RlcixcbiAgICAvLyB3aGljaCBpcyBub3QgdmFsaWQgZm9yIGEgQ1NTIGFuaW1hdGlvbi1uYW1lLlxuICAgIHJldHVybiB0aGlzLmRpYW1ldGVyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICdfJyk7XG4gIH1cbn1cbiIsIjwhLS1cbiAgcHJlc2VydmVBc3BlY3RSYXRpbyBvZiB4TWlkWU1pZCBtZWV0IGFzIHRoZSBjZW50ZXIgb2YgdGhlIHZpZXdwb3J0IGlzIHRoZSBjaXJjbGUnc1xuICBjZW50ZXIuIFRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZSB3aWxsIHJlbWFpbiBhdCB0aGUgY2VudGVyIG9mIHRoZSBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lclxuICBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIFNWRy5cbi0tPlxuPCEtLVxuICBBbGwgY2hpbGRyZW4gbmVlZCB0byBiZSBoaWRkZW4gZm9yIHNjcmVlbiByZWFkZXJzIGluIG9yZGVyIHRvIHN1cHBvcnQgQ2hyb21lVm94LlxuICBNb3JlIGNvbnRleHQgaW4gdGhlIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMjE2NS5cbi0tPlxuPHN2Z1xuICBbc3R5bGUud2lkdGgucHhdPVwiZGlhbWV0ZXJcIlxuICBbc3R5bGUuaGVpZ2h0LnB4XT1cImRpYW1ldGVyXCJcbiAgW2F0dHIudmlld0JveF09XCJfZ2V0Vmlld0JveCgpXCJcbiAgcHJlc2VydmVBc3BlY3RSYXRpbz1cInhNaWRZTWlkIG1lZXRcIlxuICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gIFtuZ1N3aXRjaF09XCJtb2RlID09PSAnaW5kZXRlcm1pbmF0ZSdcIlxuICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAjc3ZnPlxuXG4gIDwhLS1cbiAgICBUZWNobmljYWxseSB3ZSBjYW4gcmV1c2UgdGhlIHNhbWUgYGNpcmNsZWAgZWxlbWVudCwgaG93ZXZlciBTYWZhcmkgaGFzIGFuIGlzc3VlIHRoYXQgYnJlYWtzXG4gICAgdGhlIFNWRyByZW5kZXJpbmcgaW4gZGV0ZXJtaW5hdGUgbW9kZSwgYWZ0ZXIgc3dpdGNoaW5nIGJldHdlZW4gaW5kZXRlcm1pbmF0ZSBhbmQgZGV0ZXJtaW5hdGUuXG4gICAgVXNpbmcgYSBkaWZmZXJlbnQgZWxlbWVudCBhdm9pZHMgdGhlIGlzc3VlLiBBbiBhbHRlcm5hdGl2ZSB0byB0aGlzIGlzIGFkZGluZyBgZGlzcGxheTogbm9uZWBcbiAgICBmb3IgYSBzcGxpdCBzZWNvbmQgYW5kIHRoZW4gcmVtb3ZpbmcgaXQgd2hlbiBzd2l0Y2hpbmcgYmV0d2VlbiBtb2RlcywgYnV0IGl0J3MgaGFyZCB0byBrbm93XG4gICAgZm9yIGhvdyBsb25nIHRvIGhpZGUgdGhlIGVsZW1lbnQgYW5kIGl0IGNhbiBjYXVzZSB0aGUgVUkgdG8gYmxpbmsuXG4gIC0tPlxuICA8Y2lyY2xlXG4gICAgKm5nU3dpdGNoQ2FzZT1cInRydWVcIlxuICAgIGN4PVwiNTAlXCJcbiAgICBjeT1cIjUwJVwiXG4gICAgW2F0dHIucl09XCJfZ2V0Q2lyY2xlUmFkaXVzKClcIlxuICAgIFtzdHlsZS5hbmltYXRpb24tbmFtZV09XCInbWF0LXByb2dyZXNzLXNwaW5uZXItc3Ryb2tlLXJvdGF0ZS0nICsgX3NwaW5uZXJBbmltYXRpb25MYWJlbFwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNob2Zmc2V0LnB4XT1cIl9nZXRTdHJva2VEYXNoT2Zmc2V0KClcIlxuICAgIFtzdHlsZS5zdHJva2UtZGFzaGFycmF5LnB4XT1cIl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKClcIlxuICAgIFtzdHlsZS5zdHJva2Utd2lkdGguJV09XCJfZ2V0Q2lyY2xlU3Ryb2tlV2lkdGgoKVwiXG4gICAgW3N0eWxlLnRyYW5zZm9ybS1vcmlnaW5dPVwiX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmcpXCI+PC9jaXJjbGU+XG5cbiAgPGNpcmNsZVxuICAgICpuZ1N3aXRjaENhc2U9XCJmYWxzZVwiXG4gICAgY3g9XCI1MCVcIlxuICAgIGN5PVwiNTAlXCJcbiAgICBbYXR0ci5yXT1cIl9nZXRDaXJjbGVSYWRpdXMoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNob2Zmc2V0LnB4XT1cIl9nZXRTdHJva2VEYXNoT2Zmc2V0KClcIlxuICAgIFtzdHlsZS5zdHJva2UtZGFzaGFycmF5LnB4XT1cIl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKClcIlxuICAgIFtzdHlsZS5zdHJva2Utd2lkdGguJV09XCJfZ2V0Q2lyY2xlU3Ryb2tlV2lkdGgoKVwiXG4gICAgW3N0eWxlLnRyYW5zZm9ybS1vcmlnaW5dPVwiX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmcpXCI+PC9jaXJjbGU+XG48L3N2Zz5cbiJdfQ==