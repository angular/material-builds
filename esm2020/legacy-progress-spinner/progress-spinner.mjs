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
// Boilerplate for applying mixins to MatLegacyProgressSpinner.
/** @docs-private */
const _MatProgressSpinnerBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}, 'primary');
/**
 * Injection token to be used to override the default options for `mat-progress-spinner`.
 * @deprecated Use `MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS` from `@angular/material/progress-spinner` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS = new InjectionToken('mat-progress-spinner-default-options', {
    providedIn: 'root',
    factory: MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY,
});
/**
 * @docs-private
 * @deprecated Use `MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY` from `@angular/material/progress-spinner` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export function MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY() {
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
 * @deprecated Use `MatProgressSpinner` from `@angular/material/progress-spinner` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyProgressSpinner extends _MatProgressSpinnerBase {
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
        const diameters = MatLegacyProgressSpinner._diameters;
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
MatLegacyProgressSpinner._diameters = new WeakMap();
MatLegacyProgressSpinner.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyProgressSpinner, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: DOCUMENT, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MatLegacyProgressSpinner.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0", type: MatLegacyProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: { color: "color", diameter: "diameter", strokeWidth: "strokeWidth", mode: "mode", value: "value" }, host: { attributes: { "role": "progressbar", "tabindex": "-1" }, properties: { "class._mat-animation-noopable": "_noopAnimations", "style.width.px": "diameter", "style.height.px": "diameter", "attr.aria-valuemin": "mode === \"determinate\" ? 0 : null", "attr.aria-valuemax": "mode === \"determinate\" ? 100 : null", "attr.aria-valuenow": "mode === \"determinate\" ? value : null", "attr.mode": "mode" }, classAttribute: "mat-progress-spinner mat-spinner" }, exportAs: ["matProgressSpinner"], usesInheritance: true, ngImport: i0, template: "<!--\n  preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's\n  center. The center of the circle will remain at the center of the mat-progress-spinner\n  element containing the SVG.\n-->\n<!--\n  All children need to be hidden for screen readers in order to support ChromeVox.\n  More context in the issue: https://github.com/angular/components/issues/22165.\n-->\n<svg\n  [style.width.px]=\"diameter\"\n  [style.height.px]=\"diameter\"\n  [attr.viewBox]=\"_getViewBox()\"\n  preserveAspectRatio=\"xMidYMid meet\"\n  focusable=\"false\"\n  [ngSwitch]=\"mode === 'indeterminate'\"\n  aria-hidden=\"true\"\n  #svg>\n\n  <!--\n    Technically we can reuse the same `circle` element, however Safari has an issue that breaks\n    the SVG rendering in determinate mode, after switching between indeterminate and determinate.\n    Using a different element avoids the issue. An alternative to this is adding `display: none`\n    for a split second and then removing it when switching between modes, but it's hard to know\n    for how long to hide the element and it can cause the UI to blink.\n  -->\n  <circle\n    *ngSwitchCase=\"true\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + _spinnerAnimationLabel\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n\n  <circle\n    *ngSwitchCase=\"false\"\n    cx=\"50%\"\n    cy=\"50%\"\n    [attr.r]=\"_getCircleRadius()\"\n    [style.stroke-dashoffset.px]=\"_getStrokeDashOffset()\"\n    [style.stroke-dasharray.px]=\"_getStrokeCircumference()\"\n    [style.stroke-width.%]=\"_getCircleStrokeWidth()\"\n    [style.transform-origin]=\"_getCircleTransformOrigin(svg)\"></circle>\n</svg>\n", styles: [".mat-progress-spinner{display:block;position:relative;overflow:hidden}.mat-progress-spinner svg{position:absolute;transform:rotate(-90deg);top:0;left:0;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:rgba(0,0,0,0);transition:stroke-dashoffset 225ms linear}.cdk-high-contrast-active .mat-progress-spinner circle{stroke:CanvasText}.mat-progress-spinner[mode=indeterminate] svg{animation:mat-progress-spinner-linear-rotate 2000ms linear infinite}.mat-progress-spinner[mode=indeterminate] circle{transition-property:stroke;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}.mat-progress-spinner._mat-animation-noopable svg,.mat-progress-spinner._mat-animation-noopable circle{animation:none;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.606171575px;transform:rotate(0)}12.5%{stroke-dashoffset:56.5486677px;transform:rotate(0)}12.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:268.606171575px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.5486677px;transform:rotate(270deg)}37.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:268.606171575px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.5486677px;transform:rotate(180deg)}62.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:268.606171575px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.5486677px;transform:rotate(90deg)}87.5001%{stroke-dashoffset:56.5486677px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.606171575px;transform:rotateX(180deg) rotate(341.5deg)}}"], dependencies: [{ kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyProgressSpinner, decorators: [{
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
                    args: [MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS]
                }] }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i0.NgZone }]; }, propDecorators: { diameter: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], mode: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1wcm9ncmVzcy1zcGlubmVyL3Byb2dyZXNzLXNwaW5uZXIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLFFBQVEsRUFDUixpQkFBaUIsRUFFakIsaUJBQWlCLEVBRWpCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVcsVUFBVSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFTbEM7OztHQUdHO0FBQ0gsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBRXRCOzs7R0FHRztBQUNILE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBRTdCLCtEQUErRDtBQUMvRCxvQkFBb0I7QUFDcEIsTUFBTSx1QkFBdUIsR0FBRyxVQUFVLENBQ3hDO0lBQ0UsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FB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QkFDcEQsa0JBQWtCLEVBQUUsVUFBVTt3QkFDOUIsbUJBQW1CLEVBQUUsVUFBVTt3QkFDL0Isc0JBQXNCLEVBQUUsbUNBQW1DO3dCQUMzRCxzQkFBc0IsRUFBRSxxQ0FBcUM7d0JBQzdELHNCQUFzQixFQUFFLHVDQUF1Qzt3QkFDL0QsYUFBYSxFQUFFLE1BQU07cUJBQ3RCLFVBQ08sQ0FBQyxPQUFPLENBQUMsbUJBR0EsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSTs7MEJBdUVsQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7OzBCQUMzQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs7MEJBQ3hDLE1BQU07MkJBQUMsMkNBQTJDOzZIQXZDakQsUUFBUTtzQkFEWCxLQUFLO2dCQWdCRixXQUFXO3NCQURkLEtBQUs7Z0JBU0csSUFBSTtzQkFBWixLQUFLO2dCQUlGLEtBQUs7c0JBRFIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm0sIF9nZXRTaGFkb3dSb290fSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkluaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBtaXhpbkNvbG9yLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogUG9zc2libGUgbW9kZSBmb3IgYSBwcm9ncmVzcyBzcGlubmVyLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBQcm9ncmVzc1NwaW5uZXJNb2RlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIExlZ2FjeVByb2dyZXNzU3Bpbm5lck1vZGUgPSAnZGV0ZXJtaW5hdGUnIHwgJ2luZGV0ZXJtaW5hdGUnO1xuXG4vKipcbiAqIEJhc2UgcmVmZXJlbmNlIHNpemUgb2YgdGhlIHNwaW5uZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IEJBU0VfU0laRSA9IDEwMDtcblxuLyoqXG4gKiBCYXNlIHJlZmVyZW5jZSBzdHJva2Ugd2lkdGggb2YgdGhlIHNwaW5uZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IEJBU0VfU1RST0tFX1dJRFRIID0gMTA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0TGVnYWN5UHJvZ3Jlc3NTcGlubmVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRQcm9ncmVzc1NwaW5uZXJCYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfSxcbiAgJ3ByaW1hcnknLFxuKTtcblxuLyoqXG4gKiBEZWZhdWx0IGBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lcmAgb3B0aW9ucyB0aGF0IGNhbiBiZSBvdmVycmlkZGVuLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRQcm9ncmVzc1NwaW5uZXJEZWZhdWx0T3B0aW9uc2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcmAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdExlZ2FjeVByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zIHtcbiAgLyoqIERlZmF1bHQgY29sb3Igb2YgdGhlIHNwaW5uZXIuICovXG4gIGNvbG9yPzogVGhlbWVQYWxldHRlO1xuICAvKiogRGlhbWV0ZXIgb2YgdGhlIHNwaW5uZXIuICovXG4gIGRpYW1ldGVyPzogbnVtYmVyO1xuICAvKiogV2lkdGggb2YgdGhlIHNwaW5uZXIncyBzdHJva2UuICovXG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICAvKipcbiAgICogV2hldGhlciB0aGUgYW5pbWF0aW9ucyBzaG91bGQgYmUgZm9yY2UgdG8gYmUgZW5hYmxlZCwgaWdub3JpbmcgaWYgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXNcbiAgICogdXNpbmcgTm9vcEFuaW1hdGlvbnNNb2R1bGUuXG4gICAqL1xuICBfZm9yY2VBbmltYXRpb25zPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LXByb2dyZXNzLXNwaW5uZXJgLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNQVRfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlNgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXJgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9MRUdBQ1lfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlMgPVxuICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TGVnYWN5UHJvZ3Jlc3NTcGlubmVyRGVmYXVsdE9wdGlvbnM+KFxuICAgICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lci1kZWZhdWx0LW9wdGlvbnMnLFxuICAgIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9MRUdBQ1lfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgICB9LFxuICApO1xuXG4vKipcbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgTUFUX1BST0dSRVNTX1NQSU5ORVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUllgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXJgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9MRUdBQ1lfUFJPR1JFU1NfU1BJTk5FUl9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRMZWdhY3lQcm9ncmVzc1NwaW5uZXJEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7ZGlhbWV0ZXI6IEJBU0VfU0laRX07XG59XG5cbi8vIC4wMDAxIHBlcmNlbnRhZ2UgZGlmZmVyZW5jZSBpcyBuZWNlc3NhcnkgaW4gb3JkZXIgdG8gYXZvaWQgdW53YW50ZWQgYW5pbWF0aW9uIGZyYW1lc1xuLy8gZm9yIGV4YW1wbGUgYmVjYXVzZSB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIGlzIDQgc2Vjb25kcywgLjElIGFjY291bnRzIHRvIDRtc1xuLy8gd2hpY2ggYXJlIGVub3VnaCB0byBzZWUgdGhlIGZsaWNrZXIgZGVzY3JpYmVkIGluXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy84OTg0XG5jb25zdCBJTkRFVEVSTUlOQVRFX0FOSU1BVElPTl9URU1QTEFURSA9IGBcbiBAa2V5ZnJhbWVzIG1hdC1wcm9ncmVzcy1zcGlubmVyLXN0cm9rZS1yb3RhdGUtRElBTUVURVIge1xuICAgIDAlICAgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZSgwKTsgfVxuICAgIDEyLjUlICAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwKTsgfVxuICAgIDEyLjUwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSg3Mi41ZGVnKTsgfVxuICAgIDI1JSAgICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoNzIuNWRlZyk7IH1cblxuICAgIDI1LjAwMDElICAgeyBzdHJva2UtZGFzaG9mZnNldDogU1RBUlRfVkFMVUU7ICB0cmFuc2Zvcm06IHJvdGF0ZSgyNzBkZWcpOyB9XG4gICAgMzcuNSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlKDI3MGRlZyk7IH1cbiAgICAzNy41MDAxJSAgeyBzdHJva2UtZGFzaG9mZnNldDogRU5EX1ZBTFVFOyAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKSByb3RhdGUoMTYxLjVkZWcpOyB9XG4gICAgNTAlICAgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgxNjEuNWRlZyk7IH1cblxuICAgIDUwLjAwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBTVEFSVF9WQUxVRTsgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7IH1cbiAgICA2Mi41JSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IEVORF9WQUxVRTsgICAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTsgfVxuICAgIDYyLjUwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgyNTEuNWRlZyk7IH1cbiAgICA3NSUgICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDI1MS41ZGVnKTsgfVxuXG4gICAgNzUuMDAwMSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpOyB9XG4gICAgODcuNSUgICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTsgfVxuICAgIDg3LjUwMDElICB7IHN0cm9rZS1kYXNob2Zmc2V0OiBFTkRfVkFMVUU7ICAgIHRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpIHJvdGF0ZSgzNDEuNWRlZyk7IH1cbiAgICAxMDAlICAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IFNUQVJUX1ZBTFVFOyAgdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZykgcm90YXRlKDM0MS41ZGVnKTsgfVxuICB9XG5gO1xuXG4vKipcbiAqIGA8bWF0LXByb2dyZXNzLXNwaW5uZXI+YCBjb21wb25lbnQuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFByb2dyZXNzU3Bpbm5lcmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcmAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciwgbWF0LXNwaW5uZXInLFxuICBleHBvcnRBczogJ21hdFByb2dyZXNzU3Bpbm5lcicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdwcm9ncmVzc2JhcicsXG4gICAgLy8gYG1hdC1zcGlubmVyYCBpcyBoZXJlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuICAgICdjbGFzcyc6ICdtYXQtcHJvZ3Jlc3Mtc3Bpbm5lciBtYXQtc3Bpbm5lcicsXG4gICAgLy8gc2V0IHRhYiBpbmRleCB0byAtMSBzbyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgdGhlIGFyaWEtbGFiZWxcbiAgICAvLyBOb3RlOiB0aGVyZSBpcyBhIGtub3duIGlzc3VlIHdpdGggSkFXUyB0aGF0IGRvZXMgbm90IHJlYWQgcHJvZ3Jlc3NiYXIgYXJpYSBsYWJlbHMgb24gRmlyZUZveFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX25vb3BBbmltYXRpb25zYCxcbiAgICAnW3N0eWxlLndpZHRoLnB4XSc6ICdkaWFtZXRlcicsXG4gICAgJ1tzdHlsZS5oZWlnaHQucHhdJzogJ2RpYW1ldGVyJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1pbl0nOiAnbW9kZSA9PT0gXCJkZXRlcm1pbmF0ZVwiID8gMCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtb2RlID09PSBcImRldGVybWluYXRlXCIgPyAxMDAgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnbW9kZSA9PT0gXCJkZXRlcm1pbmF0ZVwiID8gdmFsdWUgOiBudWxsJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnbW9kZScsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ3Byb2dyZXNzLXNwaW5uZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwcm9ncmVzcy1zcGlubmVyLmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5UHJvZ3Jlc3NTcGlubmVyXG4gIGV4dGVuZHMgX01hdFByb2dyZXNzU3Bpbm5lckJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3JcbntcbiAgcHJpdmF0ZSBfZGlhbWV0ZXIgPSBCQVNFX1NJWkU7XG4gIHByaXZhdGUgX3ZhbHVlID0gMDtcbiAgcHJpdmF0ZSBfc3Ryb2tlV2lkdGg6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcmVzaXplU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBFbGVtZW50IHRvIHdoaWNoIHdlIHNob3VsZCBhZGQgdGhlIGdlbmVyYXRlZCBzdHlsZSB0YWdzIGZvciB0aGUgaW5kZXRlcm1pbmF0ZSBhbmltYXRpb24uXG4gICAqIEZvciBtb3N0IGVsZW1lbnRzIHRoaXMgaXMgdGhlIGRvY3VtZW50LCBidXQgZm9yIHRoZSBvbmVzIGluIHRoZSBTaGFkb3cgRE9NIHdlIG5lZWQgdG9cbiAgICogdXNlIHRoZSBzaGFkb3cgcm9vdC5cbiAgICovXG4gIHByaXZhdGUgX3N0eWxlUm9vdDogTm9kZTtcblxuICAvKipcbiAgICogVHJhY2tzIGRpYW1ldGVycyBvZiBleGlzdGluZyBpbnN0YW5jZXMgdG8gZGUtZHVwZSBnZW5lcmF0ZWQgc3R5bGVzIChkZWZhdWx0IGQgPSAxMDApLlxuICAgKiBXZSBuZWVkIHRvIGtlZXAgdHJhY2sgb2Ygd2hpY2ggZWxlbWVudHMgdGhlIGRpYW1ldGVycyB3ZXJlIGF0dGFjaGVkIHRvLCBiZWNhdXNlIGZvclxuICAgKiBlbGVtZW50cyBpbiB0aGUgU2hhZG93IERPTSB0aGUgc3R5bGUgdGFncyBhcmUgYXR0YWNoZWQgdG8gdGhlIHNoYWRvdyByb290LCByYXRoZXJcbiAgICogdGhhbiB0aGUgZG9jdW1lbnQgaGVhZC5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9kaWFtZXRlcnMgPSBuZXcgV2Vha01hcDxOb2RlLCBTZXQ8bnVtYmVyPj4oKTtcblxuICAvKiogV2hldGhlciB0aGUgX21hdC1hbmltYXRpb24tbm9vcGFibGUgY2xhc3Mgc2hvdWxkIGJlIGFwcGxpZWQsIGRpc2FibGluZyBhbmltYXRpb25zLiAgKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIC8qKiBBIHN0cmluZyB0aGF0IGlzIHVzZWQgZm9yIHNldHRpbmcgdGhlIHNwaW5uZXIgYW5pbWF0aW9uLW5hbWUgQ1NTIHByb3BlcnR5ICovXG4gIF9zcGlubmVyQW5pbWF0aW9uTGFiZWw6IHN0cmluZztcblxuICAvKiogVGhlIGRpYW1ldGVyIG9mIHRoZSBwcm9ncmVzcyBzcGlubmVyICh3aWxsIHNldCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHN2ZykuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaWFtZXRlcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kaWFtZXRlcjtcbiAgfVxuICBzZXQgZGlhbWV0ZXIoc2l6ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9kaWFtZXRlciA9IGNvZXJjZU51bWJlclByb3BlcnR5KHNpemUpO1xuICAgIHRoaXMuX3NwaW5uZXJBbmltYXRpb25MYWJlbCA9IHRoaXMuX2dldFNwaW5uZXJBbmltYXRpb25MYWJlbCgpO1xuXG4gICAgLy8gSWYgdGhpcyBpcyBzZXQgYmVmb3JlIGBuZ09uSW5pdGAsIHRoZSBzdHlsZSByb290IG1heSBub3QgaGF2ZSBiZWVuIHJlc29sdmVkIHlldC5cbiAgICBpZiAodGhpcy5fc3R5bGVSb290KSB7XG4gICAgICB0aGlzLl9hdHRhY2hTdHlsZU5vZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3Ryb2tlIHdpZHRoIG9mIHRoZSBwcm9ncmVzcyBzcGlubmVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3Ryb2tlV2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3Ryb2tlV2lkdGggfHwgdGhpcy5kaWFtZXRlciAvIDEwO1xuICB9XG4gIHNldCBzdHJva2VXaWR0aCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9zdHJva2VXaWR0aCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBNb2RlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUgKi9cbiAgQElucHV0KCkgbW9kZTogTGVnYWN5UHJvZ3Jlc3NTcGlubmVyTW9kZSA9ICdkZXRlcm1pbmF0ZSc7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZScgPyB0aGlzLl92YWx1ZSA6IDA7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX3ZhbHVlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCBjb2VyY2VOdW1iZXJQcm9wZXJ0eShuZXdWYWx1ZSkpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZTogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX0xFR0FDWV9QUk9HUkVTU19TUElOTkVSX0RFRkFVTFRfT1BUSU9OUylcbiAgICBkZWZhdWx0cz86IE1hdExlZ2FjeVByb2dyZXNzU3Bpbm5lckRlZmF1bHRPcHRpb25zLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBjaGFuZ2VEZXRlY3RvclJlZmAsIGB2aWV3cG9ydFJ1bGVyYCBhbmQgYG5nWm9uZWBcbiAgICAgKiBwYXJhbWV0ZXJzIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIGNoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcj86IFZpZXdwb3J0UnVsZXIsXG4gICAgbmdab25lPzogTmdab25lLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIGNvbnN0IHRyYWNrZWREaWFtZXRlcnMgPSBNYXRMZWdhY3lQcm9ncmVzc1NwaW5uZXIuX2RpYW1ldGVycztcbiAgICB0aGlzLl9zcGlubmVyQW5pbWF0aW9uTGFiZWwgPSB0aGlzLl9nZXRTcGlubmVyQW5pbWF0aW9uTGFiZWwoKTtcblxuICAgIC8vIFRoZSBiYXNlIHNpemUgaXMgYWxyZWFkeSBpbnNlcnRlZCB2aWEgdGhlIGNvbXBvbmVudCdzIHN0cnVjdHVyYWwgc3R5bGVzLiBXZSBzdGlsbFxuICAgIC8vIG5lZWQgdG8gdHJhY2sgaXQgc28gd2UgZG9uJ3QgZW5kIHVwIGFkZGluZyB0aGUgc2FtZSBzdHlsZXMgYWdhaW4uXG4gICAgaWYgKCF0cmFja2VkRGlhbWV0ZXJzLmhhcyhfZG9jdW1lbnQuaGVhZCkpIHtcbiAgICAgIHRyYWNrZWREaWFtZXRlcnMuc2V0KF9kb2N1bWVudC5oZWFkLCBuZXcgU2V0PG51bWJlcj4oW0JBU0VfU0laRV0pKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyA9XG4gICAgICBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnICYmICEhZGVmYXVsdHMgJiYgIWRlZmF1bHRzLl9mb3JjZUFuaW1hdGlvbnM7XG5cbiAgICBpZiAoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdtYXQtc3Bpbm5lcicpIHtcbiAgICAgIHRoaXMubW9kZSA9ICdpbmRldGVybWluYXRlJztcbiAgICB9XG5cbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGlmIChkZWZhdWx0cy5jb2xvcikge1xuICAgICAgICB0aGlzLmNvbG9yID0gdGhpcy5kZWZhdWx0Q29sb3IgPSBkZWZhdWx0cy5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLmRpYW1ldGVyKSB7XG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBkZWZhdWx0cy5kaWFtZXRlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLnN0cm9rZVdpZHRoKSB7XG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSBkZWZhdWx0cy5zdHJva2VXaWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTYWZhcmkgaGFzIGFuIGlzc3VlIHdoZXJlIHRoZSBjaXJjbGUgaXNuJ3QgcG9zaXRpb25lZCBjb3JyZWN0bHkgd2hlbiB0aGUgcGFnZSBoYXMgYVxuICAgIC8vIGRpZmZlcmVudCB6b29tIGxldmVsIGZyb20gdGhlIGRlZmF1bHQuIFRoaXMgaGFuZGxlciB0cmlnZ2VycyBhIHJlY2FsY3VsYXRpb24gb2YgdGhlXG4gICAgLy8gYHRyYW5zZm9ybS1vcmlnaW5gIHdoZW4gdGhlIHBhZ2Ugem9vbSBsZXZlbCBjaGFuZ2VzLlxuICAgIC8vIFNlZSBgX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbmAgZm9yIG1vcmUgaW5mby5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBSZW1vdmUgbnVsbCBjaGVja3MgZm9yIGBfY2hhbmdlRGV0ZWN0b3JSZWZgLFxuICAgIC8vIGB2aWV3cG9ydFJ1bGVyYCBhbmQgYG5nWm9uZWAuXG4gICAgaWYgKF9wbGF0Zm9ybS5pc0Jyb3dzZXIgJiYgX3BsYXRmb3JtLlNBRkFSSSAmJiB2aWV3cG9ydFJ1bGVyICYmIGNoYW5nZURldGVjdG9yUmVmICYmIG5nWm9uZSkge1xuICAgICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uID0gdmlld3BvcnRSdWxlci5jaGFuZ2UoMTUwKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBXaGVuIHRoZSB3aW5kb3cgaXMgcmVzaXplIHdoaWxlIHRoZSBzcGlubmVyIGlzIGluIGBpbmRldGVybWluYXRlYCBtb2RlLCB3ZVxuICAgICAgICAvLyBoYXZlIHRvIG1hcmsgZm9yIGNoZWNrIHNvIHRoZSB0cmFuc2Zvcm0gb3JpZ2luIG9mIHRoZSBjaXJjbGUgY2FuIGJlIHJlY29tcHV0ZWQuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdpbmRldGVybWluYXRlJykge1xuICAgICAgICAgIG5nWm9uZS5ydW4oKCkgPT4gY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gTm90ZSB0aGF0IHdlIG5lZWQgdG8gbG9vayB1cCB0aGUgcm9vdCBub2RlIGluIG5nT25Jbml0LCByYXRoZXIgdGhhbiB0aGUgY29uc3RydWN0b3IsIGJlY2F1c2VcbiAgICAvLyBBbmd1bGFyIHNlZW1zIHRvIGNyZWF0ZSB0aGUgZWxlbWVudCBvdXRzaWRlIHRoZSBzaGFkb3cgcm9vdCBhbmQgdGhlbiBtb3ZlcyBpdCBpbnNpZGUsIGlmIHRoZVxuICAgIC8vIG5vZGUgaXMgaW5zaWRlIGFuIGBuZ0lmYCBhbmQgYSBTaGFkb3dEb20tZW5jYXBzdWxhdGVkIGNvbXBvbmVudC5cbiAgICB0aGlzLl9zdHlsZVJvb3QgPSBfZ2V0U2hhZG93Um9vdChlbGVtZW50KSB8fCB0aGlzLl9kb2N1bWVudC5oZWFkO1xuICAgIHRoaXMuX2F0dGFjaFN0eWxlTm9kZSgpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXByb2dyZXNzLXNwaW5uZXItaW5kZXRlcm1pbmF0ZS1hbmltYXRpb24nKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIHNwaW5uZXIsIGFkanVzdGVkIGZvciBzdHJva2Ugd2lkdGguICovXG4gIF9nZXRDaXJjbGVSYWRpdXMoKSB7XG4gICAgcmV0dXJuICh0aGlzLmRpYW1ldGVyIC0gQkFTRV9TVFJPS0VfV0lEVEgpIC8gMjtcbiAgfVxuXG4gIC8qKiBUaGUgdmlldyBib3ggb2YgdGhlIHNwaW5uZXIncyBzdmcgZWxlbWVudC4gKi9cbiAgX2dldFZpZXdCb3goKSB7XG4gICAgY29uc3Qgdmlld0JveCA9IHRoaXMuX2dldENpcmNsZVJhZGl1cygpICogMiArIHRoaXMuc3Ryb2tlV2lkdGg7XG4gICAgcmV0dXJuIGAwIDAgJHt2aWV3Qm94fSAke3ZpZXdCb3h9YDtcbiAgfVxuXG4gIC8qKiBUaGUgc3Ryb2tlIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIHN2ZyBjaXJjbGUuICovXG4gIF9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDIgKiBNYXRoLlBJICogdGhpcy5fZ2V0Q2lyY2xlUmFkaXVzKCk7XG4gIH1cblxuICAvKiogVGhlIGRhc2ggb2Zmc2V0IG9mIHRoZSBzdmcgY2lyY2xlLiAqL1xuICBfZ2V0U3Ryb2tlRGFzaE9mZnNldCgpIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICByZXR1cm4gKHRoaXMuX2dldFN0cm9rZUNpcmN1bWZlcmVuY2UoKSAqICgxMDAgLSB0aGlzLl92YWx1ZSkpIC8gMTAwO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFN0cm9rZSB3aWR0aCBvZiB0aGUgY2lyY2xlIGluIHBlcmNlbnQuICovXG4gIF9nZXRDaXJjbGVTdHJva2VXaWR0aCgpIHtcbiAgICByZXR1cm4gKHRoaXMuc3Ryb2tlV2lkdGggLyB0aGlzLmRpYW1ldGVyKSAqIDEwMDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBgdHJhbnNmb3JtLW9yaWdpbmAgZm9yIHRoZSBpbm5lciBjaXJjbGUgZWxlbWVudC4gKi9cbiAgX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmc6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICAvLyBTYWZhcmkgaGFzIGFuIGlzc3VlIHdoZXJlIHRoZSBgdHJhbnNmb3JtLW9yaWdpbmAgZG9lc24ndCB3b3JrIGFzIGV4cGVjdGVkIHdoZW4gdGhlIHBhZ2VcbiAgICAvLyBoYXMgYSBkaWZmZXJlbnQgem9vbSBsZXZlbCBmcm9tIHRoZSBkZWZhdWx0LiBUaGUgcHJvYmxlbSBhcHBlYXJzIHRvIGJlIHRoYXQgYSB6b29tXG4gICAgLy8gaXMgYXBwbGllZCBvbiB0aGUgYHN2Z2Agbm9kZSBpdHNlbGYuIFdlIGNhbiB3b3JrIGFyb3VuZCBpdCBieSBjYWxjdWxhdGluZyB0aGUgb3JpZ2luXG4gICAgLy8gYmFzZWQgb24gdGhlIHpvb20gbGV2ZWwuIE9uIGFsbCBvdGhlciBicm93c2VycyB0aGUgYGN1cnJlbnRTY2FsZWAgYXBwZWFycyB0byBhbHdheXMgYmUgMS5cbiAgICBjb25zdCBzY2FsZSA9ICgoc3ZnIGFzIHVua25vd24gYXMgU1ZHU1ZHRWxlbWVudCkuY3VycmVudFNjYWxlID8/IDEpICogNTA7XG4gICAgcmV0dXJuIGAke3NjYWxlfSUgJHtzY2FsZX0lYDtcbiAgfVxuXG4gIC8qKiBEeW5hbWljYWxseSBnZW5lcmF0ZXMgYSBzdHlsZSB0YWcgY29udGFpbmluZyB0aGUgY29ycmVjdCBhbmltYXRpb24gZm9yIHRoaXMgZGlhbWV0ZXIuICovXG4gIHByaXZhdGUgX2F0dGFjaFN0eWxlTm9kZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzdHlsZVJvb3QgPSB0aGlzLl9zdHlsZVJvb3Q7XG4gICAgY29uc3QgY3VycmVudERpYW1ldGVyID0gdGhpcy5fZGlhbWV0ZXI7XG4gICAgY29uc3QgZGlhbWV0ZXJzID0gTWF0TGVnYWN5UHJvZ3Jlc3NTcGlubmVyLl9kaWFtZXRlcnM7XG4gICAgbGV0IGRpYW1ldGVyc0ZvckVsZW1lbnQgPSBkaWFtZXRlcnMuZ2V0KHN0eWxlUm9vdCk7XG5cbiAgICBpZiAoIWRpYW1ldGVyc0ZvckVsZW1lbnQgfHwgIWRpYW1ldGVyc0ZvckVsZW1lbnQuaGFzKGN1cnJlbnREaWFtZXRlcikpIHtcbiAgICAgIGNvbnN0IHN0eWxlVGFnOiBIVE1MU3R5bGVFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlVGFnLnNldEF0dHJpYnV0ZSgnbWF0LXNwaW5uZXItYW5pbWF0aW9uJywgdGhpcy5fc3Bpbm5lckFuaW1hdGlvbkxhYmVsKTtcbiAgICAgIHN0eWxlVGFnLnRleHRDb250ZW50ID0gdGhpcy5fZ2V0QW5pbWF0aW9uVGV4dCgpO1xuICAgICAgc3R5bGVSb290LmFwcGVuZENoaWxkKHN0eWxlVGFnKTtcblxuICAgICAgaWYgKCFkaWFtZXRlcnNGb3JFbGVtZW50KSB7XG4gICAgICAgIGRpYW1ldGVyc0ZvckVsZW1lbnQgPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgICAgICAgZGlhbWV0ZXJzLnNldChzdHlsZVJvb3QsIGRpYW1ldGVyc0ZvckVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBkaWFtZXRlcnNGb3JFbGVtZW50LmFkZChjdXJyZW50RGlhbWV0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZW5lcmF0ZXMgYW5pbWF0aW9uIHN0eWxlcyBhZGp1c3RlZCBmb3IgdGhlIHNwaW5uZXIncyBkaWFtZXRlci4gKi9cbiAgcHJpdmF0ZSBfZ2V0QW5pbWF0aW9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0cm9rZUNpcmN1bWZlcmVuY2UgPSB0aGlzLl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIElOREVURVJNSU5BVEVfQU5JTUFUSU9OX1RFTVBMQVRFXG4gICAgICAgIC8vIEFuaW1hdGlvbiBzaG91bGQgYmVnaW4gYXQgNSUgYW5kIGVuZCBhdCA4MCVcbiAgICAgICAgLnJlcGxhY2UoL1NUQVJUX1ZBTFVFL2csIGAkezAuOTUgKiBzdHJva2VDaXJjdW1mZXJlbmNlfWApXG4gICAgICAgIC5yZXBsYWNlKC9FTkRfVkFMVUUvZywgYCR7MC4yICogc3Ryb2tlQ2lyY3VtZmVyZW5jZX1gKVxuICAgICAgICAucmVwbGFjZSgvRElBTUVURVIvZywgYCR7dGhpcy5fc3Bpbm5lckFuaW1hdGlvbkxhYmVsfWApXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBjaXJjbGUgZGlhbWV0ZXIgZm9ybWF0dGVkIGZvciB1c2Ugd2l0aCB0aGUgYW5pbWF0aW9uLW5hbWUgQ1NTIHByb3BlcnR5LiAqL1xuICBwcml2YXRlIF9nZXRTcGlubmVyQW5pbWF0aW9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAvLyBUaGUgc3RyaW5nIG9mIGEgZmxvYXQgcG9pbnQgbnVtYmVyIHdpbGwgaW5jbHVkZSBhIHBlcmlvZCDigJgu4oCZIGNoYXJhY3RlcixcbiAgICAvLyB3aGljaCBpcyBub3QgdmFsaWQgZm9yIGEgQ1NTIGFuaW1hdGlvbi1uYW1lLlxuICAgIHJldHVybiB0aGlzLmRpYW1ldGVyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICdfJyk7XG4gIH1cbn1cbiIsIjwhLS1cbiAgcHJlc2VydmVBc3BlY3RSYXRpbyBvZiB4TWlkWU1pZCBtZWV0IGFzIHRoZSBjZW50ZXIgb2YgdGhlIHZpZXdwb3J0IGlzIHRoZSBjaXJjbGUnc1xuICBjZW50ZXIuIFRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZSB3aWxsIHJlbWFpbiBhdCB0aGUgY2VudGVyIG9mIHRoZSBtYXQtcHJvZ3Jlc3Mtc3Bpbm5lclxuICBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIFNWRy5cbi0tPlxuPCEtLVxuICBBbGwgY2hpbGRyZW4gbmVlZCB0byBiZSBoaWRkZW4gZm9yIHNjcmVlbiByZWFkZXJzIGluIG9yZGVyIHRvIHN1cHBvcnQgQ2hyb21lVm94LlxuICBNb3JlIGNvbnRleHQgaW4gdGhlIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMjE2NS5cbi0tPlxuPHN2Z1xuICBbc3R5bGUud2lkdGgucHhdPVwiZGlhbWV0ZXJcIlxuICBbc3R5bGUuaGVpZ2h0LnB4XT1cImRpYW1ldGVyXCJcbiAgW2F0dHIudmlld0JveF09XCJfZ2V0Vmlld0JveCgpXCJcbiAgcHJlc2VydmVBc3BlY3RSYXRpbz1cInhNaWRZTWlkIG1lZXRcIlxuICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gIFtuZ1N3aXRjaF09XCJtb2RlID09PSAnaW5kZXRlcm1pbmF0ZSdcIlxuICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAjc3ZnPlxuXG4gIDwhLS1cbiAgICBUZWNobmljYWxseSB3ZSBjYW4gcmV1c2UgdGhlIHNhbWUgYGNpcmNsZWAgZWxlbWVudCwgaG93ZXZlciBTYWZhcmkgaGFzIGFuIGlzc3VlIHRoYXQgYnJlYWtzXG4gICAgdGhlIFNWRyByZW5kZXJpbmcgaW4gZGV0ZXJtaW5hdGUgbW9kZSwgYWZ0ZXIgc3dpdGNoaW5nIGJldHdlZW4gaW5kZXRlcm1pbmF0ZSBhbmQgZGV0ZXJtaW5hdGUuXG4gICAgVXNpbmcgYSBkaWZmZXJlbnQgZWxlbWVudCBhdm9pZHMgdGhlIGlzc3VlLiBBbiBhbHRlcm5hdGl2ZSB0byB0aGlzIGlzIGFkZGluZyBgZGlzcGxheTogbm9uZWBcbiAgICBmb3IgYSBzcGxpdCBzZWNvbmQgYW5kIHRoZW4gcmVtb3ZpbmcgaXQgd2hlbiBzd2l0Y2hpbmcgYmV0d2VlbiBtb2RlcywgYnV0IGl0J3MgaGFyZCB0byBrbm93XG4gICAgZm9yIGhvdyBsb25nIHRvIGhpZGUgdGhlIGVsZW1lbnQgYW5kIGl0IGNhbiBjYXVzZSB0aGUgVUkgdG8gYmxpbmsuXG4gIC0tPlxuICA8Y2lyY2xlXG4gICAgKm5nU3dpdGNoQ2FzZT1cInRydWVcIlxuICAgIGN4PVwiNTAlXCJcbiAgICBjeT1cIjUwJVwiXG4gICAgW2F0dHIucl09XCJfZ2V0Q2lyY2xlUmFkaXVzKClcIlxuICAgIFtzdHlsZS5hbmltYXRpb24tbmFtZV09XCInbWF0LXByb2dyZXNzLXNwaW5uZXItc3Ryb2tlLXJvdGF0ZS0nICsgX3NwaW5uZXJBbmltYXRpb25MYWJlbFwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNob2Zmc2V0LnB4XT1cIl9nZXRTdHJva2VEYXNoT2Zmc2V0KClcIlxuICAgIFtzdHlsZS5zdHJva2UtZGFzaGFycmF5LnB4XT1cIl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKClcIlxuICAgIFtzdHlsZS5zdHJva2Utd2lkdGguJV09XCJfZ2V0Q2lyY2xlU3Ryb2tlV2lkdGgoKVwiXG4gICAgW3N0eWxlLnRyYW5zZm9ybS1vcmlnaW5dPVwiX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmcpXCI+PC9jaXJjbGU+XG5cbiAgPGNpcmNsZVxuICAgICpuZ1N3aXRjaENhc2U9XCJmYWxzZVwiXG4gICAgY3g9XCI1MCVcIlxuICAgIGN5PVwiNTAlXCJcbiAgICBbYXR0ci5yXT1cIl9nZXRDaXJjbGVSYWRpdXMoKVwiXG4gICAgW3N0eWxlLnN0cm9rZS1kYXNob2Zmc2V0LnB4XT1cIl9nZXRTdHJva2VEYXNoT2Zmc2V0KClcIlxuICAgIFtzdHlsZS5zdHJva2UtZGFzaGFycmF5LnB4XT1cIl9nZXRTdHJva2VDaXJjdW1mZXJlbmNlKClcIlxuICAgIFtzdHlsZS5zdHJva2Utd2lkdGguJV09XCJfZ2V0Q2lyY2xlU3Ryb2tlV2lkdGgoKVwiXG4gICAgW3N0eWxlLnRyYW5zZm9ybS1vcmlnaW5dPVwiX2dldENpcmNsZVRyYW5zZm9ybU9yaWdpbihzdmcpXCI+PC9jaXJjbGU+XG48L3N2Zz5cbiJdfQ==