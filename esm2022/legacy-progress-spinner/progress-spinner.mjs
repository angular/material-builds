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
class MatLegacyProgressSpinner extends _MatProgressSpinnerBase {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyProgressSpinner, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: DOCUMENT, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i0.NgZone }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: { color: "color", diameter: "diameter", strokeWidth: "strokeWidth", mode: "mode", value: "value" }, host: { attributes: { "role": "progressbar", "tabindex": "-1" }, properties: { "class._mat-animation-noopable": "_noopAnimations", "style.width.px": "diameter", "style.height.px": "diameter", "attr.aria-valuemin": "mode === \"determinate\" ? 0 : null", "attr.aria-valuemax": "mode === \"determinate\" ? 100 : null", "attr.aria-valuenow": "mode === \"determinate\" ? value : null", "attr.mode": "mode" }, classAttribute: "mat-progress-spinner mat-spinner" }, exportAs: ["matProgressSpinner"], usesInheritance: true, ngImport: i0, template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG.\n-->\n<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_getViewBox()\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\"\n  aria-hidden=\"true\"\n  #svg>\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + _spinnerAnimationLabel\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n</svg>\n", styles: [".mat-progress-spinner{display:block;position:relative;overflow:hidden}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:rgba(0,0,0,0);transition:stroke-dashoffset 225ms linear}.cdk-high-contrast-active .mat-progress-spinner circle{stroke:CanvasText}.mat-progress-spinner[mode=indeterminate] svg{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}.mat-progress-spinner[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}.mat-progress-spinner._mat-animation-noopable svg,.mat-progress-spinner._mat-animation-noopable circle{animation:none;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}"], dependencies: [{ kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyProgressSpinner };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyProgressSpinner, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1wcm9ncmVzcy1zcGlubmVyL3Byb2dyZXNzLXNwaW5uZXIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLGlCQUFpQixFQUVqQixpQkFBaUIsRUFFakIsTUFBTSxFQUNOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVcsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUVMLG9DQUFvQyxHQUVyQyxNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBRWxDOzs7R0FHRztBQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUV0Qjs7O0dBR0c7QUFDSCxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3QiwrREFBK0Q7QUFDL0Qsb0JBQW9CO0FBQ3BCLE1BQU0sdUJBQXVCLEdB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bUIsRUFBRSxVQUFVO3dCQUMvQixzQkFBc0IsRUFBRSxtQ0FBbUM7d0JBQzNELHNCQUFzQixFQUFFLHFDQUFxQzt3QkFDN0Qsc0JBQXNCLEVBQUUsdUNBQXVDO3dCQUMvRCxhQUFhLEVBQUUsTUFBTTtxQkFDdEIsVUFDTyxDQUFDLE9BQU8sQ0FBQyxtQkFHQSx1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJOzswQkF1RWxDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsUUFBUTs7MEJBQzNCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzswQkFDeEMsTUFBTTsyQkFBQyxvQ0FBb0M7OzBCQVUzQyxNQUFNOzJCQUFDLFNBQVM7OzBCQUFHLFFBQVE7NENBakQxQixRQUFRO3NCQURYLEtBQUs7Z0JBZ0JGLFdBQVc7c0JBRGQsS0FBSztnQkFTRyxJQUFJO3NCQUFaLEtBQUs7Z0JBSUYsS0FBSztzQkFEUixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtQbGF0Zm9ybSwgX2dldFNoYWRvd1Jvb3R9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25Jbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25EZXN0cm95LFxuICBOZ1pvbmUsXG4gIENTUF9OT05DRSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBtaXhpbkNvbG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgTWF0UHJvZ3Jlc3NTcGlubmVyRGVmYXVsdE9wdGlvbnMsXG4gIE1BVF9QUk9HUkVTU19TUElOTkVSX0RFRkFVTFRfT1BUSU9OUyxcbiAgUHJvZ3Jlc3NTcGlubmVyTW9kZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogQmFzZSByZWZlcmVuY2Ugc2l6ZSBvZiB0aGUgc3Bpbm5lci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgQkFTRV9TSVpFID0gMTAwO1xuXG4vKipcbiAqIEJhc2UgcmVmZXJlbmNlIHN0cm9rZSB3aWR0aCBvZiB0aGUgc3Bpbm5lci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgQkFTRV9TVFJPS0VfV0lEVEggPSAxMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRMZWdhY3lQcm9ncmVzc1NwaW5uZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFByb2dyZXNzU3Bpbm5lckJhc2UgPSBtaXhpbkNvbG9yKFxuICBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuICB9LFxuICAncHJpbWFyeScsXG4pO1xuXG4vLyAuMDAwMSBwZXJjZW50YWdlIGRpZmZlcmVuY2UgaXMgbmVjZXNzYXJ5IGluIG9yZGVyIHRvIGF2b2lkIHVud2FudGVkIGFuaW1hdGlvbiBmcmFtZXNcbi8vIGZvciBleGFtcGxlIGJlY2F1c2UgdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpcyA0IHNlY29uZHMsIC4xJSBhY2NvdW50cyB0byA0bXNcbi8vIHdoaWNoIGFyZSBlbm91Z2ggdG8gc2VlIHRoZSBmbGlja2VyIGRlc2NyaWJlZCBpblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvODk4NFxuY29uc3QgSU5ERVRFUk1JTkFURV9BTklNQVRJT05fVEVNUExBVEUgPSBgXG4gQGtleWZyYW1lcyBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1zdHJva2Utcm90YXRlLURJQU1FVEVSIHtcbiAgICAwJSAgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMCk7IH1cbiAgICAxMi41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoMCk7IH1cbiAgICAxMi41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoNzIuNWRlZyk7IH1cbiAgICAyNSUgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDcyLjVkZWcpOyB9XG5cbiAgICAyNS4wMDAxJSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoMjcwZGVnKTsgfVxuICAgIDM3LjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSgyNzBkZWcpOyB9XG4gICAgMzcuNTAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDE2MS41ZGVnKTsgfVxuICAgIDUwJSAgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMTYxLjVkZWcpOyB9XG5cbiAgICA1MC4wMDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpOyB9XG4gICAgNjIuNSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7IH1cbiAgICA2Mi41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMjUxLjVkZWcpOyB9XG4gICAgNzUlICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgyNTEuNWRlZyk7IH1cblxuICAgIDc1LjAwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTsgfVxuICAgIDg3LjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7IH1cbiAgICA4Ny41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMzQxLjVkZWcpOyB9XG4gICAgMTAwJSAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgzNDEuNWRlZyk7IH1cbiAgfVxuYDtcblxuLyoqXG4gKiBgPG1hdC1wcm9ncmVzcy1zcGlubmVyPmAgY29tcG9uZW50LlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRQcm9ncmVzc1NwaW5uZXJgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXJgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXByb2dyZXNzLXNwaW5uZXIsIG1hdC1zcGlubmVyJyxcbiAgZXhwb3J0QXM6ICdtYXRQcm9ncmVzc1NwaW5uZXInLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAncHJvZ3Jlc3NiYXInLFxuICAgIC8vIGBtYXQtc3Bpbm5lcmAgaXMgaGVyZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cbiAgICAnY2xhc3MnOiAnbWF0LXByb2dyZXNzLXNwaW5uZXIgbWF0LXNwaW5uZXInLFxuICAgIC8vIHNldCB0YWIgaW5kZXggdG8gLTEgc28gc2NyZWVuIHJlYWRlcnMgd2lsbCByZWFkIHRoZSBhcmlhLWxhYmVsXG4gICAgLy8gTm90ZTogdGhlcmUgaXMgYSBrbm93biBpc3N1ZSB3aXRoIEpBV1MgdGhhdCBkb2VzIG5vdCByZWFkIHByb2dyZXNzYmFyIGFyaWEgbGFiZWxzIG9uIEZpcmVGb3hcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogYF9ub29wQW5pbWF0aW9uc2AsXG4gICAgJ1tzdHlsZS53aWR0aC5weF0nOiAnZGlhbWV0ZXInLFxuICAgICdbc3R5bGUuaGVpZ2h0LnB4XSc6ICdkaWFtZXRlcicsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVtaW5dJzogJ21vZGUgPT09IFwiZGV0ZXJtaW5hdGVcIiA/IDAgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1heF0nOiAnbW9kZSA9PT0gXCJkZXRlcm1pbmF0ZVwiID8gMTAwIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVub3ddJzogJ21vZGUgPT09IFwiZGV0ZXJtaW5hdGVcIiA/IHZhbHVlIDogbnVsbCcsXG4gICAgJ1thdHRyLm1vZGVdJzogJ21vZGUnLFxuICB9LFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy1zcGlubmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsncHJvZ3Jlc3Mtc3Bpbm5lci5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVByb2dyZXNzU3Bpbm5lclxuICBleHRlbmRzIF9NYXRQcm9ncmVzc1NwaW5uZXJCYXNlXG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkNvbG9yXG57XG4gIHByaXZhdGUgX2RpYW1ldGVyID0gQkFTRV9TSVpFO1xuICBwcml2YXRlIF92YWx1ZSA9IDA7XG4gIHByaXZhdGUgX3N0cm9rZVdpZHRoOiBudW1iZXI7XG4gIHByaXZhdGUgX3Jlc2l6ZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogRWxlbWVudCB0byB3aGljaCB3ZSBzaG91bGQgYWRkIHRoZSBnZW5lcmF0ZWQgc3R5bGUgdGFncyBmb3IgdGhlIGluZGV0ZXJtaW5hdGUgYW5pbWF0aW9uLlxuICAgKiBGb3IgbW9zdCBlbGVtZW50cyB0aGlzIGlzIHRoZSBkb2N1bWVudCwgYnV0IGZvciB0aGUgb25lcyBpbiB0aGUgU2hhZG93IERPTSB3ZSBuZWVkIHRvXG4gICAqIHVzZSB0aGUgc2hhZG93IHJvb3QuXG4gICAqL1xuICBwcml2YXRlIF9zdHlsZVJvb3Q6IE5vZGU7XG5cbiAgLyoqXG4gICAqIFRyYWNrcyBkaWFtZXRlcnMgb2YgZXhpc3RpbmcgaW5zdGFuY2VzIHRvIGRlLWR1cGUgZ2VuZXJhdGVkIHN0eWxlcyAoZGVmYXVsdCBkID0gMTAwKS5cbiAgICogV2UgbmVlZCB0byBrZWVwIHRyYWNrIG9mIHdoaWNoIGVsZW1lbnRzIHRoZSBkaWFtZXRlcnMgd2VyZSBhdHRhY2hlZCB0bywgYmVjYXVzZSBmb3JcbiAgICogZWxlbWVudHMgaW4gdGhlIFNoYWRvdyBET00gdGhlIHN0eWxlIHRhZ3MgYXJlIGF0dGFjaGVkIHRvIHRoZSBzaGFkb3cgcm9vdCwgcmF0aGVyXG4gICAqIHRoYW4gdGhlIGRvY3VtZW50IGhlYWQuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBfZGlhbWV0ZXJzID0gbmV3IFdlYWtNYXA8Tm9kZSwgU2V0PG51bWJlcj4+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIF9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlIGNsYXNzIHNob3VsZCBiZSBhcHBsaWVkLCBkaXNhYmxpbmcgYW5pbWF0aW9ucy4gICovXG4gIF9ub29wQW5pbWF0aW9uczogYm9vbGVhbjtcblxuICAvKiogQSBzdHJpbmcgdGhhdCBpcyB1c2VkIGZvciBzZXR0aW5nIHRoZSBzcGlubmVyIGFuaW1hdGlvbi1uYW1lIENTUyBwcm9wZXJ0eSAqL1xuICBfc3Bpbm5lckFuaW1hdGlvbkxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBkaWFtZXRlciBvZiB0aGUgcHJvZ3Jlc3Mgc3Bpbm5lciAod2lsbCBzZXQgd2lkdGggYW5kIGhlaWdodCBvZiBzdmcpLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlhbWV0ZXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGlhbWV0ZXI7XG4gIH1cbiAgc2V0IGRpYW1ldGVyKHNpemU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fZGlhbWV0ZXIgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eShzaXplKTtcbiAgICB0aGlzLl9zcGlubmVyQW5pbWF0aW9uTGFiZWwgPSB0aGlzLl9nZXRTcGlubmVyQW5pbWF0aW9uTGFiZWwoKTtcblxuICAgIC8vIElmIHRoaXMgaXMgc2V0IGJlZm9yZSBgbmdPbkluaXRgLCB0aGUgc3R5bGUgcm9vdCBtYXkgbm90IGhhdmUgYmVlbiByZXNvbHZlZCB5ZXQuXG4gICAgaWYgKHRoaXMuX3N0eWxlUm9vdCkge1xuICAgICAgdGhpcy5fYXR0YWNoU3R5bGVOb2RlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFN0cm9rZSB3aWR0aCBvZiB0aGUgcHJvZ3Jlc3Mgc3Bpbm5lci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0cm9rZVdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cm9rZVdpZHRoIHx8IHRoaXMuZGlhbWV0ZXIgLyAxMDtcbiAgfVxuICBzZXQgc3Ryb2tlV2lkdGgodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fc3Ryb2tlV2lkdGggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogTW9kZSBvZiB0aGUgcHJvZ3Jlc3MgY2lyY2xlICovXG4gIEBJbnB1dCgpIG1vZGU6IFByb2dyZXNzU3Bpbm5lck1vZGUgPSAnZGV0ZXJtaW5hdGUnO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgcHJvZ3Jlc3MgY2lyY2xlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnID8gdGhpcy5fdmFsdWUgOiAwO1xuICB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl92YWx1ZSA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgY29lcmNlTnVtYmVyUHJvcGVydHkobmV3VmFsdWUpKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU6IHN0cmluZyxcbiAgICBASW5qZWN0KE1BVF9QUk9HUkVTU19TUElOTkVSX0RFRkFVTFRfT1BUSU9OUylcbiAgICBkZWZhdWx0cz86IE1hdFByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBjaGFuZ2VEZXRlY3RvclJlZmAsIGB2aWV3cG9ydFJ1bGVyYCBhbmQgYG5nWm9uZWBcbiAgICAgKiBwYXJhbWV0ZXJzIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIGNoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcj86IFZpZXdwb3J0UnVsZXIsXG4gICAgbmdab25lPzogTmdab25lLFxuICAgIEBJbmplY3QoQ1NQX05PTkNFKSBAT3B0aW9uYWwoKSBwcml2YXRlIF9ub25jZT86IHN0cmluZyB8IG51bGwsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgY29uc3QgdHJhY2tlZERpYW1ldGVycyA9IE1hdExlZ2FjeVByb2dyZXNzU3Bpbm5lci5fZGlhbWV0ZXJzO1xuICAgIHRoaXMuX3NwaW5uZXJBbmltYXRpb25MYWJlbCA9IHRoaXMuX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpO1xuXG4gICAgLy8gVGhlIGJhc2Ugc2l6ZSBpcyBhbHJlYWR5IGluc2VydGVkIHZpYSB0aGUgY29tcG9uZW50J3Mgc3RydWN0dXJhbCBzdHlsZXMuIFdlIHN0aWxsXG4gICAgLy8gbmVlZCB0byB0cmFjayBpdCBzbyB3ZSBkb24ndCBlbmQgdXAgYWRkaW5nIHRoZSBzYW1lIHN0eWxlcyBhZ2Fpbi5cbiAgICBpZiAoIXRyYWNrZWREaWFtZXRlcnMuaGFzKF9kb2N1bWVudC5oZWFkKSkge1xuICAgICAgdHJhY2tlZERpYW1ldGVycy5zZXQoX2RvY3VtZW50LmhlYWQsIG5ldyBTZXQ8bnVtYmVyPihbQkFTRV9TSVpFXSkpO1xuICAgIH1cblxuICAgIHRoaXMuX25vb3BBbmltYXRpb25zID1cbiAgICAgIGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycgJiYgISFkZWZhdWx0cyAmJiAhZGVmYXVsdHMuX2ZvcmNlQW5pbWF0aW9ucztcblxuICAgIGlmIChlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ21hdC1zcGlubmVyJykge1xuICAgICAgdGhpcy5tb2RlID0gJ2luZGV0ZXJtaW5hdGUnO1xuICAgIH1cblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmNvbG9yKSB7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmRlZmF1bHRDb2xvciA9IGRlZmF1bHRzLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVmYXVsdHMuZGlhbWV0ZXIpIHtcbiAgICAgICAgdGhpcy5kaWFtZXRlciA9IGRlZmF1bHRzLmRpYW1ldGVyO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVmYXVsdHMuc3Ryb2tlV2lkdGgpIHtcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IGRlZmF1bHRzLnN0cm9rZVdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNhZmFyaSBoYXMgYW4gaXNzdWUgd2hlcmUgdGhlIGNpcmNsZSBpc24ndCBwb3NpdGlvbmVkIGNvcnJlY3RseSB3aGVuIHRoZSBwYWdlIGhhcyBhXG4gICAgLy8gZGlmZmVyZW50IHpvb20gbGV2ZWwgZnJvbSB0aGUgZGVmYXVsdC4gVGhpcyBoYW5kbGVyIHRyaWdnZXJzIGEgcmVjYWxjdWxhdGlvbiBvZiB0aGVcbiAgICAvLyBgdHJhbnNmb3JtLW9yaWdpbmAgd2hlbiB0aGUgcGFnZSB6b29tIGxldmVsIGNoYW5nZXMuXG4gICAgLy8gU2VlIGBfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luYCBmb3IgbW9yZSBpbmZvLlxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBudWxsIGNoZWNrcyBmb3IgYF9jaGFuZ2VEZXRlY3RvclJlZmAsXG4gICAgLy8gYHZpZXdwb3J0UnVsZXJgIGFuZCBgbmdab25lYC5cbiAgICBpZiAoX3BsYXRmb3JtLmlzQnJvd3NlciAmJiBfcGxhdGZvcm0uU0FGQVJJICYmIHZpZXdwb3J0UnVsZXIgJiYgY2hhbmdlRGV0ZWN0b3JSZWYgJiYgbmdab25lKSB7XG4gICAgICB0aGlzLl9yZXNpemVTdWJzY3JpcHRpb24gPSB2aWV3cG9ydFJ1bGVyLmNoYW5nZSgxNTApLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFdoZW4gdGhlIHdpbmRvdyBpcyByZXNpemUgd2hpbGUgdGhlIHNwaW5uZXIgaXMgaW4gYGluZGV0ZXJtaW5hdGVgIG1vZGUsIHdlXG4gICAgICAgIC8vIGhhdmUgdG8gbWFyayBmb3IgY2hlY2sgc28gdGhlIHRyYW5zZm9ybSBvcmlnaW4gb2YgdGhlIGNpcmNsZSBjYW4gYmUgcmVjb21wdXRlZC5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gJ2luZGV0ZXJtaW5hdGUnKSB7XG4gICAgICAgICAgbmdab25lLnJ1bigoKSA9PiBjaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBOb3RlIHRoYXQgd2UgbmVlZCB0byBsb29rIHVwIHRoZSByb290IG5vZGUgaW4gbmdPbkluaXQsIHJhdGhlciB0aGFuIHRoZSBjb25zdHJ1Y3RvciwgYmVjYXVzZVxuICAgIC8vIEFuZ3VsYXIgc2VlbXMgdG8gY3JlYXRlIHRoZSBlbGVtZW50IG91dHNpZGUgdGhlIHNoYWRvdyByb290IGFuZCB0aGVuIG1vdmVzIGl0IGluc2lkZSwgaWYgdGhlXG4gICAgLy8gbm9kZSBpcyBpbnNpZGUgYW4gYG5nSWZgIGFuZCBhIFNoYWRvd0RvbS1lbmNhcHN1bGF0ZWQgY29tcG9uZW50LlxuICAgIHRoaXMuX3N0eWxlUm9vdCA9IF9nZXRTaGFkb3dSb290KGVsZW1lbnQpIHx8IHRoaXMuX2RvY3VtZW50LmhlYWQ7XG4gICAgdGhpcy5fYXR0YWNoU3R5bGVOb2RlKCk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1pbmRldGVybWluYXRlLWFuaW1hdGlvbicpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogVGhlIHJhZGl1cyBvZiB0aGUgc3Bpbm5lciwgYWRqdXN0ZWQgZm9yIHN0cm9rZSB3aWR0aC4gKi9cbiAgX2dldENpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gKHRoaXMuZGlhbWV0ZXIgLSBCQVNFX1NUUk9LRV9XSURUSCkgLyAyO1xuICB9XG5cbiAgLyoqIFRoZSB2aWV3IGJveCBvZiB0aGUgc3Bpbm5lcidzIHN2ZyBlbGVtZW50LiAqL1xuICBfZ2V0Vmlld0JveCgpIHtcbiAgICBjb25zdCB2aWV3Qm94ID0gdGhpcy5fZ2V0Q2lyY2xlUmFkaXVzKCkgKiAyICsgdGhpcy5zdHJva2VXaWR0aDtcbiAgICByZXR1cm4gYDAgMCAke3ZpZXdCb3h9ICR7dmlld0JveH1gO1xuICB9XG5cbiAgLyoqIFRoZSBzdHJva2UgY2lyY3VtZmVyZW5jZSBvZiB0aGUgc3ZnIGNpcmNsZS4gKi9cbiAgX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMiAqIE1hdGguUEkgKiB0aGlzLl9nZXRDaXJjbGVSYWRpdXMoKTtcbiAgfVxuXG4gIC8qKiBUaGUgZGFzaCBvZmZzZXQgb2YgdGhlIHN2ZyBjaXJjbGUuICovXG4gIF9nZXRTdHJva2VEYXNoT2Zmc2V0KCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZScpIHtcbiAgICAgIHJldHVybiAodGhpcy5fZ2V0U3Ryb2tlQ2lyY3VtZmVyZW5jZSgpICogKDEwMCAtIHRoaXMuX3ZhbHVlKSkgLyAxMDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogU3Ryb2tlIHdpZHRoIG9mIHRoZSBjaXJjbGUgaW4gcGVyY2VudC4gKi9cbiAgX2dldENpcmNsZVN0cm9rZVdpZHRoKCkge1xuICAgIHJldHVybiAodGhpcy5zdHJva2VXaWR0aCAvIHRoaXMuZGlhbWV0ZXIpICogMTAwO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGB0cmFuc2Zvcm0tb3JpZ2luYCBmb3IgdGhlIGlubmVyIGNpcmNsZSBlbGVtZW50LiAqL1xuICBfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luKHN2ZzogSFRNTEVsZW1lbnQpOiBzdHJpbmcge1xuICAgIC8vIFNhZmFyaSBoYXMgYW4gaXNzdWUgd2hlcmUgdGhlIGB0cmFuc2Zvcm0tb3JpZ2luYCBkb2Vzbid0IHdvcmsgYXMgZXhwZWN0ZWQgd2hlbiB0aGUgcGFnZVxuICAgIC8vIGhhcyBhIGRpZmZlcmVudCB6b29tIGxldmVsIGZyb20gdGhlIGRlZmF1bHQuIFRoZSBwcm9ibGVtIGFwcGVhcnMgdG8gYmUgdGhhdCBhIHpvb21cbiAgICAvLyBpcyBhcHBsaWVkIG9uIHRoZSBgc3ZnYCBub2RlIGl0c2VsZi4gV2UgY2FuIHdvcmsgYXJvdW5kIGl0IGJ5IGNhbGN1bGF0aW5nIHRoZSBvcmlnaW5cbiAgICAvLyBiYXNlZCBvbiB0aGUgem9vbSBsZXZlbC4gT24gYWxsIG90aGVyIGJyb3dzZXJzIHRoZSBgY3VycmVudFNjYWxlYCBhcHBlYXJzIHRvIGFsd2F5cyBiZSAxLlxuICAgIGNvbnN0IHNjYWxlID0gKChzdmcgYXMgdW5rbm93biBhcyBTVkdTVkdFbGVtZW50KS5jdXJyZW50U2NhbGUgPz8gMSkgKiA1MDtcbiAgICByZXR1cm4gYCR7c2NhbGV9JSAke3NjYWxlfSVgO1xuICB9XG5cbiAgLyoqIER5bmFtaWNhbGx5IGdlbmVyYXRlcyBhIHN0eWxlIHRhZyBjb250YWluaW5nIHRoZSBjb3JyZWN0IGFuaW1hdGlvbiBmb3IgdGhpcyBkaWFtZXRlci4gKi9cbiAgcHJpdmF0ZSBfYXR0YWNoU3R5bGVOb2RlKCk6IHZvaWQge1xuICAgIGNvbnN0IHN0eWxlUm9vdCA9IHRoaXMuX3N0eWxlUm9vdDtcbiAgICBjb25zdCBjdXJyZW50RGlhbWV0ZXIgPSB0aGlzLl9kaWFtZXRlcjtcbiAgICBjb25zdCBkaWFtZXRlcnMgPSBNYXRMZWdhY3lQcm9ncmVzc1NwaW5uZXIuX2RpYW1ldGVycztcbiAgICBsZXQgZGlhbWV0ZXJzRm9yRWxlbWVudCA9IGRpYW1ldGVycy5nZXQoc3R5bGVSb290KTtcblxuICAgIGlmICghZGlhbWV0ZXJzRm9yRWxlbWVudCB8fCAhZGlhbWV0ZXJzRm9yRWxlbWVudC5oYXMoY3VycmVudERpYW1ldGVyKSkge1xuICAgICAgY29uc3Qgc3R5bGVUYWc6IEhUTUxTdHlsZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICBpZiAodGhpcy5fbm9uY2UpIHtcbiAgICAgICAgc3R5bGVUYWcubm9uY2UgPSB0aGlzLl9ub25jZTtcbiAgICAgIH1cblxuICAgICAgc3R5bGVUYWcuc2V0QXR0cmlidXRlKCdtYXQtc3Bpbm5lci1hbmltYXRpb24nLCB0aGlzLl9zcGlubmVyQW5pbWF0aW9uTGFiZWwpO1xuICAgICAgc3R5bGVUYWcudGV4dENvbnRlbnQgPSB0aGlzLl9nZXRBbmltYXRpb25UZXh0KCk7XG4gICAgICBzdHlsZVJvb3QuYXBwZW5kQ2hpbGQoc3R5bGVUYWcpO1xuXG4gICAgICBpZiAoIWRpYW1ldGVyc0ZvckVsZW1lbnQpIHtcbiAgICAgICAgZGlhbWV0ZXJzRm9yRWxlbWVudCA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgICAgICBkaWFtZXRlcnMuc2V0KHN0eWxlUm9vdCwgZGlhbWV0ZXJzRm9yRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGRpYW1ldGVyc0ZvckVsZW1lbnQuYWRkKGN1cnJlbnREaWFtZXRlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdlbmVyYXRlcyBhbmltYXRpb24gc3R5bGVzIGFkanVzdGVkIGZvciB0aGUgc3Bpbm5lcidzIGRpYW1ldGVyLiAqL1xuICBwcml2YXRlIF9nZXRBbmltYXRpb25UZXh0KCk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3Ryb2tlQ2lyY3VtZmVyZW5jZSA9IHRoaXMuX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gKFxuICAgICAgSU5ERVRFUk1JTkFURV9BTklNQVRJT05fVEVNUExBVEVcbiAgICAgICAgLy8gQW5pbWF0aW9uIHNob3VsZCBiZWdpbiBhdCA1JSBhbmQgZW5kIGF0IDgwJVxuICAgICAgICAucmVwbGFjZSgvU1RBUlRfVkFMVUUvZywgYCR7MC45NSAqIHN0cm9rZUNpcmN1bWZlcmVuY2V9YClcbiAgICAgICAgLnJlcGxhY2UoL0VORF9WQUxVRS9nLCBgJHswLjIgKiBzdHJva2VDaXJjdW1mZXJlbmNlfWApXG4gICAgICAgIC5yZXBsYWNlKC9ESUFNRVRFUi9nLCBgJHt0aGlzLl9zcGlubmVyQW5pbWF0aW9uTGFiZWx9YClcbiAgICApO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGNpcmNsZSBkaWFtZXRlciBmb3JtYXR0ZWQgZm9yIHVzZSB3aXRoIHRoZSBhbmltYXRpb24tbmFtZSBDU1MgcHJvcGVydHkuICovXG4gIHByaXZhdGUgX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpOiBzdHJpbmcge1xuICAgIC8vIFRoZSBzdHJpbmcgb2YgYSBmbG9hdCBwb2ludCBudW1iZXIgd2lsbCBpbmNsdWRlIGEgcGVyaW9kIOKAmC7igJkgY2hhcmFjdGVyLFxuICAgIC8vIHdoaWNoIGlzIG5vdCB2YWxpZCBmb3IgYSBDU1MgYW5pbWF0aW9uLW5hbWUuXG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJ18nKTtcbiAgfVxufVxuIiwiPCEtLVxuICBwcmVzZXJ2ZUFzcGVjdFJhdGlvIG9mIHhNaWRZTWlkIG1lZXQgYXMgdGhlIGNlbnRlciBvZiB0aGUgdmlld3BvcnQgaXMgdGhlIGNpcmNsZSdzXG4gIGNlbnRlci4gVGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlIHdpbGwgcmVtYWluIGF0IHRoZSBjZW50ZXIgb2YgdGhlIG1hdC1wcm9ncmVzcy1zcGlubmVyXG4gIGVsZW1lbnQgY29udGFpbmluZyB0aGUgU1ZHLlxuLS0+XG48IS0tXG4gIEFsbCBjaGlsZHJlbiBuZWVkIHRvIGJlIGhpZGRlbiBmb3Igc2NyZWVuIHJlYWRlcnMgaW4gb3JkZXIgdG8gc3VwcG9ydCBDaHJvbWVWb3guXG4gIE1vcmUgY29udGV4dCBpbiB0aGUgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIyMTY1LlxuLS0+XG48c3ZnXG4gIFtzdHlsZS53aWR0aC5weF09XCJkaWFtZXRlclwiXG4gIFtzdHlsZS5oZWlnaHQucHhdPVwiZGlhbWV0ZXJcIlxuICBbYXR0ci52aWV3Qm94XT1cIl9nZXRWaWV3Qm94KClcIlxuICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiXG4gIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgW25nU3dpdGNoXT1cIm1vZGUgPT09ICdpbmRldGVybWluYXRlJ1wiXG4gIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICNzdmc+XG5cbiAgPCEtLVxuICAgIFRlY2huaWNhbGx5IHdlIGNhbiByZXVzZSB0aGUgc2FtZSBgY2lyY2xlYCBlbGVtZW50LCBob3dldmVyIFNhZmFyaSBoYXMgYW4gaXNzdWUgdGhhdCBicmVha3NcbiAgICB0aGUgU1ZHIHJlbmRlcmluZyBpbiBkZXRlcm1pbmF0ZSBtb2RlLCBhZnRlciBzd2l0Y2hpbmcgYmV0d2VlbiBpbmRldGVybWluYXRlIGFuZCBkZXRlcm1pbmF0ZS5cbiAgICBVc2luZyBhIGRpZmZlcmVudCBlbGVtZW50IGF2b2lkcyB0aGUgaXNzdWUuIEFuIGFsdGVybmF0aXZlIHRvIHRoaXMgaXMgYWRkaW5nIGBkaXNwbGF5OiBub25lYFxuICAgIGZvciBhIHNwbGl0IHNlY29uZCBhbmQgdGhlbiByZW1vdmluZyBpdCB3aGVuIHN3aXRjaGluZyBiZXR3ZWVuIG1vZGVzLCBidXQgaXQncyBoYXJkIHRvIGtub3dcbiAgICBmb3IgaG93IGxvbmcgdG8gaGlkZSB0aGUgZWxlbWVudCBhbmQgaXQgY2FuIGNhdXNlIHRoZSBVSSB0byBibGluay5cbiAgLS0+XG4gIDxjaXJjbGVcbiAgICAqbmdTd2l0Y2hDYXNlPVwidHJ1ZVwiXG4gICAgY3g9XCI1MCVcIlxuICAgIGN5PVwiNTAlXCJcbiAgICBbYXR0ci5yXT1cIl9nZXRDaXJjbGVSYWRpdXMoKVwiXG4gICAgW3N0eWxlLmFuaW1hdGlvbi1uYW1lXT1cIidtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1zdHJva2Utcm90YXRlLScgKyBfc3Bpbm5lckFuaW1hdGlvbkxhYmVsXCJcbiAgICBbc3R5bGUuc3Ryb2tlLWRhc2hvZmZzZXQucHhdPVwiX2dldFN0cm9rZURhc2hPZmZzZXQoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNoYXJyYXkucHhdPVwiX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS13aWR0aC4lXT1cIl9nZXRDaXJjbGVTdHJva2VXaWR0aCgpXCJcbiAgICBbc3R5bGUudHJhbnNmb3JtLW9yaWdpbl09XCJfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luKHN2ZylcIj48L2NpcmNsZT5cblxuICA8Y2lyY2xlXG4gICAgKm5nU3dpdGNoQ2FzZT1cImZhbHNlXCJcbiAgICBjeD1cIjUwJVwiXG4gICAgY3k9XCI1MCVcIlxuICAgIFthdHRyLnJdPVwiX2dldENpcmNsZVJhZGl1cygpXCJcbiAgICBbc3R5bGUuc3Ryb2tlLWRhc2hvZmZzZXQucHhdPVwiX2dldFN0cm9rZURhc2hPZmZzZXQoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNoYXJyYXkucHhdPVwiX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS13aWR0aC4lXT1cIl9nZXRDaXJjbGVTdHJva2VXaWR0aCgpXCJcbiAgICBbc3R5bGUudHJhbnNmb3JtLW9yaWdpbl09XCJfZ2V0Q2lyY2xlVHJhbnNmb3JtT3JpZ2luKHN2ZylcIj48L2NpcmNsZT5cbjwvc3ZnPlxuIl19