/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { Attribute, ChangeDetectionStrategy, Component, ElementRef, ErrorHandler, inject, Inject, InjectionToken, Input, Optional, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatIconRegistry } from './icon-registry';
// Boilerplate for applying mixins to MatIcon.
/** @docs-private */
class MatIconBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatIconMixinBase = mixinColor(MatIconBase);
/**
 * Injection token used to provide the current location to `MatIcon`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
export const MAT_ICON_LOCATION = new InjectionToken('mat-icon-location', {
    providedIn: 'root',
    factory: MAT_ICON_LOCATION_FACTORY
});
/** @docs-private */
export function MAT_ICON_LOCATION_FACTORY() {
    const _document = inject(DOCUMENT);
    const _location = _document ? _document.location : null;
    return {
        // Note that this needs to be a function, rather than a property, because Angular
        // will only resolve it once, but we want the current path on each call.
        getPathname: () => _location ? (_location.pathname + _location.search) : ''
    };
}
/** SVG attributes that accept a FuncIRI (e.g. `url(<something>)`). */
const funcIriAttributes = [
    'clip-path',
    'color-profile',
    'src',
    'cursor',
    'fill',
    'filter',
    'marker',
    'marker-start',
    'marker-mid',
    'marker-end',
    'mask',
    'stroke'
];
const ɵ0 = attr => `[${attr}]`;
/** Selector that can be used to find all elements that are using a `FuncIRI`. */
const funcIriAttributeSelector = funcIriAttributes.map(ɵ0).join(', ');
/** Regex that can be used to extract the id out of a FuncIRI. */
const funcIriPattern = /^url\(['"]?#(.*?)['"]?\)$/;
/**
 * Component to display an icon. It can be used in the following ways:
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MatIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     `<mat-icon svgIcon="left-arrow"></mat-icon>
 *     <mat-icon svgIcon="animals:cat"></mat-icon>`
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the `<mat-icon>`
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MatIconRegistry.registerFontClassAlias.
 *   Examples:
 *     `<mat-icon>home</mat-icon>
 *     <mat-icon fontSet="myfont">sun</mat-icon>`
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     `<mat-icon fontSet="fa" fontIcon="alarm"></mat-icon>`
 */
let MatIcon = /** @class */ (() => {
    let MatIcon = class MatIcon extends _MatIconMixinBase {
        constructor(elementRef, _iconRegistry, ariaHidden, 
        /**
         * @deprecated `location` parameter to be made required.
         * @breaking-change 8.0.0
         */
        _location, 
        // @breaking-change 9.0.0 _errorHandler parameter to be made required
        _errorHandler) {
            super(elementRef);
            this._iconRegistry = _iconRegistry;
            this._location = _location;
            this._errorHandler = _errorHandler;
            this._inline = false;
            /** Subscription to the current in-progress SVG icon request. */
            this._currentIconFetch = Subscription.EMPTY;
            // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
            // the right thing to do for the majority of icon use-cases.
            if (!ariaHidden) {
                elementRef.nativeElement.setAttribute('aria-hidden', 'true');
            }
        }
        /**
         * Whether the icon should be inlined, automatically sizing the icon to match the font size of
         * the element the icon is contained in.
         */
        get inline() {
            return this._inline;
        }
        set inline(inline) {
            this._inline = coerceBooleanProperty(inline);
        }
        /** Font set that the icon is a part of. */
        get fontSet() { return this._fontSet; }
        set fontSet(value) {
            this._fontSet = this._cleanupFontValue(value);
        }
        /** Name of an icon within a font set. */
        get fontIcon() { return this._fontIcon; }
        set fontIcon(value) {
            this._fontIcon = this._cleanupFontValue(value);
        }
        /**
         * Splits an svgIcon binding value into its icon set and icon name components.
         * Returns a 2-element array of [(icon set), (icon name)].
         * The separator for the two fields is ':'. If there is no separator, an empty
         * string is returned for the icon set and the entire value is returned for
         * the icon name. If the argument is falsy, returns an array of two empty strings.
         * Throws an error if the name contains two or more ':' separators.
         * Examples:
         *   `'social:cake' -> ['social', 'cake']
         *   'penguin' -> ['', 'penguin']
         *   null -> ['', '']
         *   'a:b:c' -> (throws Error)`
         */
        _splitIconName(iconName) {
            if (!iconName) {
                return ['', ''];
            }
            const parts = iconName.split(':');
            switch (parts.length) {
                case 1: return ['', parts[0]]; // Use default namespace.
                case 2: return parts;
                default: throw Error(`Invalid icon name: "${iconName}"`);
            }
        }
        ngOnChanges(changes) {
            // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
            const svgIconChanges = changes['svgIcon'];
            if (svgIconChanges) {
                this._currentIconFetch.unsubscribe();
                if (this.svgIcon) {
                    const [namespace, iconName] = this._splitIconName(this.svgIcon);
                    this._currentIconFetch = this._iconRegistry.getNamedSvgIcon(iconName, namespace)
                        .pipe(take(1))
                        .subscribe(svg => this._setSvgElement(svg), (err) => {
                        const errorMessage = `Error retrieving icon ${namespace}:${iconName}! ${err.message}`;
                        // @breaking-change 9.0.0 _errorHandler parameter to be made required.
                        if (this._errorHandler) {
                            this._errorHandler.handleError(new Error(errorMessage));
                        }
                        else {
                            console.error(errorMessage);
                        }
                    });
                }
                else if (svgIconChanges.previousValue) {
                    this._clearSvgElement();
                }
            }
            if (this._usingFontIcon()) {
                this._updateFontIconClasses();
            }
        }
        ngOnInit() {
            // Update font classes because ngOnChanges won't be called if none of the inputs are present,
            // e.g. <mat-icon>arrow</mat-icon> In this case we need to add a CSS class for the default font.
            if (this._usingFontIcon()) {
                this._updateFontIconClasses();
            }
        }
        ngAfterViewChecked() {
            const cachedElements = this._elementsWithExternalReferences;
            if (cachedElements && this._location && cachedElements.size) {
                const newPath = this._location.getPathname();
                // We need to check whether the URL has changed on each change detection since
                // the browser doesn't have an API that will let us react on link clicks and
                // we can't depend on the Angular router. The references need to be updated,
                // because while most browsers don't care whether the URL is correct after
                // the first render, Safari will break if the user navigates to a different
                // page and the SVG isn't re-rendered.
                if (newPath !== this._previousPath) {
                    this._previousPath = newPath;
                    this._prependPathToReferences(newPath);
                }
            }
        }
        ngOnDestroy() {
            this._currentIconFetch.unsubscribe();
            if (this._elementsWithExternalReferences) {
                this._elementsWithExternalReferences.clear();
            }
        }
        _usingFontIcon() {
            return !this.svgIcon;
        }
        _setSvgElement(svg) {
            this._clearSvgElement();
            // Workaround for IE11 and Edge ignoring `style` tags inside dynamically-created SVGs.
            // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10898469/
            // Do this before inserting the element into the DOM, in order to avoid a style recalculation.
            const styleTags = svg.querySelectorAll('style');
            for (let i = 0; i < styleTags.length; i++) {
                styleTags[i].textContent += ' ';
            }
            // Note: we do this fix here, rather than the icon registry, because the
            // references have to point to the URL at the time that the icon was created.
            if (this._location) {
                const path = this._location.getPathname();
                this._previousPath = path;
                this._cacheChildrenWithExternalReferences(svg);
                this._prependPathToReferences(path);
            }
            this._elementRef.nativeElement.appendChild(svg);
        }
        _clearSvgElement() {
            const layoutElement = this._elementRef.nativeElement;
            let childCount = layoutElement.childNodes.length;
            if (this._elementsWithExternalReferences) {
                this._elementsWithExternalReferences.clear();
            }
            // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
            // we can't use innerHTML, because IE will throw if the element has a data binding.
            while (childCount--) {
                const child = layoutElement.childNodes[childCount];
                // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes in order to get rid
                // of any loose text nodes, as well as any SVG elements in order to remove any old icons.
                if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
                    layoutElement.removeChild(child);
                }
            }
        }
        _updateFontIconClasses() {
            if (!this._usingFontIcon()) {
                return;
            }
            const elem = this._elementRef.nativeElement;
            const fontSetClass = this.fontSet ?
                this._iconRegistry.classNameForFontAlias(this.fontSet) :
                this._iconRegistry.getDefaultFontSetClass();
            if (fontSetClass != this._previousFontSetClass) {
                if (this._previousFontSetClass) {
                    elem.classList.remove(this._previousFontSetClass);
                }
                if (fontSetClass) {
                    elem.classList.add(fontSetClass);
                }
                this._previousFontSetClass = fontSetClass;
            }
            if (this.fontIcon != this._previousFontIconClass) {
                if (this._previousFontIconClass) {
                    elem.classList.remove(this._previousFontIconClass);
                }
                if (this.fontIcon) {
                    elem.classList.add(this.fontIcon);
                }
                this._previousFontIconClass = this.fontIcon;
            }
        }
        /**
         * Cleans up a value to be used as a fontIcon or fontSet.
         * Since the value ends up being assigned as a CSS class, we
         * have to trim the value and omit space-separated values.
         */
        _cleanupFontValue(value) {
            return typeof value === 'string' ? value.trim().split(' ')[0] : value;
        }
        /**
         * Prepends the current path to all elements that have an attribute pointing to a `FuncIRI`
         * reference. This is required because WebKit browsers require references to be prefixed with
         * the current path, if the page has a `base` tag.
         */
        _prependPathToReferences(path) {
            const elements = this._elementsWithExternalReferences;
            if (elements) {
                elements.forEach((attrs, element) => {
                    attrs.forEach(attr => {
                        element.setAttribute(attr.name, `url('${path}#${attr.value}')`);
                    });
                });
            }
        }
        /**
         * Caches the children of an SVG element that have `url()`
         * references that we need to prefix with the current path.
         */
        _cacheChildrenWithExternalReferences(element) {
            const elementsWithFuncIri = element.querySelectorAll(funcIriAttributeSelector);
            const elements = this._elementsWithExternalReferences =
                this._elementsWithExternalReferences || new Map();
            for (let i = 0; i < elementsWithFuncIri.length; i++) {
                funcIriAttributes.forEach(attr => {
                    const elementWithReference = elementsWithFuncIri[i];
                    const value = elementWithReference.getAttribute(attr);
                    const match = value ? value.match(funcIriPattern) : null;
                    if (match) {
                        let attributes = elements.get(elementWithReference);
                        if (!attributes) {
                            attributes = [];
                            elements.set(elementWithReference, attributes);
                        }
                        attributes.push({ name: attr, value: match[1] });
                    }
                });
            }
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatIcon.prototype, "inline", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatIcon.prototype, "svgIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatIcon.prototype, "fontSet", null);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatIcon.prototype, "fontIcon", null);
    MatIcon = __decorate([
        Component({
            template: '<ng-content></ng-content>',
            selector: 'mat-icon',
            exportAs: 'matIcon',
            inputs: ['color'],
            host: {
                'role': 'img',
                'class': 'mat-icon notranslate',
                '[class.mat-icon-inline]': 'inline',
                '[class.mat-icon-no-color]': 'color !== "primary" && color !== "accent" && color !== "warn"',
            },
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-icon{background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}\n"]
        }),
        __param(2, Attribute('aria-hidden')),
        __param(3, Optional()), __param(3, Inject(MAT_ICON_LOCATION)),
        __param(4, Optional()),
        __metadata("design:paramtypes", [ElementRef, MatIconRegistry, String, Object, ErrorHandler])
    ], MatIcon);
    return MatIcon;
})();
export { MatIcon };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUVSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXlCLFVBQVUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUdoRCw4Q0FBOEM7QUFDOUMsb0JBQW9CO0FBQ3BCLE1BQU0sV0FBVztJQUNmLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUcsQ0FBQztDQUMvQztBQUNELE1BQU0saUJBQWlCLEdBQXNDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVyRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQWtCLG1CQUFtQixFQUFFO0lBQ3hGLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSx5QkFBeUI7Q0FDbkMsQ0FBQyxDQUFDO0FBVUgsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSx5QkFBeUI7SUFDdkMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFFB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UUFBUSxFQUFFLFNBQVM7WUFFbkIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ2pCLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsS0FBSztnQkFDYixPQUFPLEVBQUUsc0JBQXNCO2dCQUMvQix5QkFBeUIsRUFBRSxRQUFRO2dCQUNuQywyQkFBMkIsRUFBRSwrREFBK0Q7YUFDN0Y7WUFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7U0FDaEQsQ0FBQztRQWtESyxXQUFBLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUt4QixXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUVyQyxXQUFBLFFBQVEsRUFBRSxDQUFBO3lDQVJDLFVBQVUsRUFBc0MsZUFBZSxrQkFROUIsWUFBWTtPQXhEbEQsT0FBTyxDQXFTbkI7SUFBRCxjQUFDO0tBQUE7U0FyU1ksT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXJyb3JIYW5kbGVyLFxuICBpbmplY3QsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLCBtaXhpbkNvbG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01hdEljb25SZWdpc3RyeX0gZnJvbSAnLi9pY29uLXJlZ2lzdHJ5JztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEljb24uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0SWNvbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0SWNvbk1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdEljb25CYXNlID0gbWl4aW5Db2xvcihNYXRJY29uQmFzZSk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gcHJvdmlkZSB0aGUgY3VycmVudCBsb2NhdGlvbiB0byBgTWF0SWNvbmAuXG4gKiBVc2VkIHRvIGhhbmRsZSBzZXJ2ZXItc2lkZSByZW5kZXJpbmcgYW5kIHRvIHN0dWIgb3V0IGR1cmluZyB1bml0IHRlc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0lDT05fTE9DQVRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0SWNvbkxvY2F0aW9uPignbWF0LWljb24tbG9jYXRpb24nLCB7XG4gIHByb3ZpZGVkSW46ICdyb290JyxcbiAgZmFjdG9yeTogTUFUX0lDT05fTE9DQVRJT05fRkFDVE9SWVxufSk7XG5cbi8qKlxuICogU3R1YmJlZCBvdXQgbG9jYXRpb24gZm9yIGBNYXRJY29uYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRJY29uTG9jYXRpb24ge1xuICBnZXRQYXRobmFtZTogKCkgPT4gc3RyaW5nO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9JQ09OX0xPQ0FUSU9OX0ZBQ1RPUlkoKTogTWF0SWNvbkxvY2F0aW9uIHtcbiAgY29uc3QgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgY29uc3QgX2xvY2F0aW9uID0gX2RvY3VtZW50ID8gX2RvY3VtZW50LmxvY2F0aW9uIDogbnVsbDtcblxuICByZXR1cm4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIG5lZWRzIHRvIGJlIGEgZnVuY3Rpb24sIHJhdGhlciB0aGFuIGEgcHJvcGVydHksIGJlY2F1c2UgQW5ndWxhclxuICAgIC8vIHdpbGwgb25seSByZXNvbHZlIGl0IG9uY2UsIGJ1dCB3ZSB3YW50IHRoZSBjdXJyZW50IHBhdGggb24gZWFjaCBjYWxsLlxuICAgIGdldFBhdGhuYW1lOiAoKSA9PiBfbG9jYXRpb24gPyAoX2xvY2F0aW9uLnBhdGhuYW1lICsgX2xvY2F0aW9uLnNlYXJjaCkgOiAnJ1xuICB9O1xufVxuXG5cbi8qKiBTVkcgYXR0cmlidXRlcyB0aGF0IGFjY2VwdCBhIEZ1bmNJUkkgKGUuZy4gYHVybCg8c29tZXRoaW5nPilgKS4gKi9cbmNvbnN0IGZ1bmNJcmlBdHRyaWJ1dGVzID0gW1xuICAnY2xpcC1wYXRoJyxcbiAgJ2NvbG9yLXByb2ZpbGUnLFxuICAnc3JjJyxcbiAgJ2N1cnNvcicsXG4gICdmaWxsJyxcbiAgJ2ZpbHRlcicsXG4gICdtYXJrZXInLFxuICAnbWFya2VyLXN0YXJ0JyxcbiAgJ21hcmtlci1taWQnLFxuICAnbWFya2VyLWVuZCcsXG4gICdtYXNrJyxcbiAgJ3N0cm9rZSdcbl07XG5cbi8qKiBTZWxlY3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbmQgYWxsIGVsZW1lbnRzIHRoYXQgYXJlIHVzaW5nIGEgYEZ1bmNJUklgLiAqL1xuY29uc3QgZnVuY0lyaUF0dHJpYnV0ZVNlbGVjdG9yID0gZnVuY0lyaUF0dHJpYnV0ZXMubWFwKGF0dHIgPT4gYFske2F0dHJ9XWApLmpvaW4oJywgJyk7XG5cbi8qKiBSZWdleCB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4dHJhY3QgdGhlIGlkIG91dCBvZiBhIEZ1bmNJUkkuICovXG5jb25zdCBmdW5jSXJpUGF0dGVybiA9IC9edXJsXFwoWydcIl0/IyguKj8pWydcIl0/XFwpJC87XG5cbi8qKlxuICogQ29tcG9uZW50IHRvIGRpc3BsYXkgYW4gaWNvbi4gSXQgY2FuIGJlIHVzZWQgaW4gdGhlIGZvbGxvd2luZyB3YXlzOlxuICpcbiAqIC0gU3BlY2lmeSB0aGUgc3ZnSWNvbiBpbnB1dCB0byBsb2FkIGFuIFNWRyBpY29uIGZyb20gYSBVUkwgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlXG4gKiAgIGFkZFN2Z0ljb24sIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZSwgYWRkU3ZnSWNvblNldCwgb3IgYWRkU3ZnSWNvblNldEluTmFtZXNwYWNlIG1ldGhvZHMgb2ZcbiAqICAgTWF0SWNvblJlZ2lzdHJ5LiBJZiB0aGUgc3ZnSWNvbiB2YWx1ZSBjb250YWlucyBhIGNvbG9uIGl0IGlzIGFzc3VtZWQgdG8gYmUgaW4gdGhlIGZvcm1hdFxuICogICBcIltuYW1lc3BhY2VdOltuYW1lXVwiLCBpZiBub3QgdGhlIHZhbHVlIHdpbGwgYmUgdGhlIG5hbWUgb2YgYW4gaWNvbiBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24gc3ZnSWNvbj1cImxlZnQtYXJyb3dcIj48L21hdC1pY29uPlxuICogICAgIDxtYXQtaWNvbiBzdmdJY29uPVwiYW5pbWFsczpjYXRcIj48L21hdC1pY29uPmBcbiAqXG4gKiAtIFVzZSBhIGZvbnQgbGlnYXR1cmUgYXMgYW4gaWNvbiBieSBwdXR0aW5nIHRoZSBsaWdhdHVyZSB0ZXh0IGluIHRoZSBjb250ZW50IG9mIHRoZSBgPG1hdC1pY29uPmBcbiAqICAgY29tcG9uZW50LiBCeSBkZWZhdWx0IHRoZSBNYXRlcmlhbCBpY29ucyBmb250IGlzIHVzZWQgYXMgZGVzY3JpYmVkIGF0XG4gKiAgIGh0dHA6Ly9nb29nbGUuZ2l0aHViLmlvL21hdGVyaWFsLWRlc2lnbi1pY29ucy8jaWNvbi1mb250LWZvci10aGUtd2ViLiBZb3UgY2FuIHNwZWNpZnkgYW5cbiAqICAgYWx0ZXJuYXRlIGZvbnQgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBlaXRoZXIgdGhlIENTUyBjbGFzcyB0byBhcHBseSB0byB1c2UgdGhlXG4gKiAgIGRlc2lyZWQgZm9udCwgb3IgdG8gYW4gYWxpYXMgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggTWF0SWNvblJlZ2lzdHJ5LnJlZ2lzdGVyRm9udENsYXNzQWxpYXMuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24+aG9tZTwvbWF0LWljb24+XG4gKiAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJteWZvbnRcIj5zdW48L21hdC1pY29uPmBcbiAqXG4gKiAtIFNwZWNpZnkgYSBmb250IGdseXBoIHRvIGJlIGluY2x1ZGVkIHZpYSBDU1MgcnVsZXMgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBzcGVjaWZ5IHRoZVxuICogICBmb250LCBhbmQgdGhlIGZvbnRJY29uIGlucHV0IHRvIHNwZWNpZnkgdGhlIGljb24uIFR5cGljYWxseSB0aGUgZm9udEljb24gd2lsbCBzcGVjaWZ5IGFcbiAqICAgQ1NTIGNsYXNzIHdoaWNoIGNhdXNlcyB0aGUgZ2x5cGggdG8gYmUgZGlzcGxheWVkIHZpYSBhIDpiZWZvcmUgc2VsZWN0b3IsIGFzIGluXG4gKiAgIGh0dHBzOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9leGFtcGxlcy9cbiAqICAgRXhhbXBsZTpcbiAqICAgICBgPG1hdC1pY29uIGZvbnRTZXQ9XCJmYVwiIGZvbnRJY29uPVwiYWxhcm1cIj48L21hdC1pY29uPmBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHNlbGVjdG9yOiAnbWF0LWljb24nLFxuICBleHBvcnRBczogJ21hdEljb24nLFxuICBzdHlsZVVybHM6IFsnaWNvbi5jc3MnXSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdpbWcnLFxuICAgICdjbGFzcyc6ICdtYXQtaWNvbiBub3RyYW5zbGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtaWNvbi1pbmxpbmVdJzogJ2lubGluZScsXG4gICAgJ1tjbGFzcy5tYXQtaWNvbi1uby1jb2xvcl0nOiAnY29sb3IgIT09IFwicHJpbWFyeVwiICYmIGNvbG9yICE9PSBcImFjY2VudFwiICYmIGNvbG9yICE9PSBcIndhcm5cIicsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRJY29uIGV4dGVuZHMgX01hdEljb25NaXhpbkJhc2UgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQ2FuQ29sb3IsIE9uRGVzdHJveSB7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGljb24gc2hvdWxkIGJlIGlubGluZWQsIGF1dG9tYXRpY2FsbHkgc2l6aW5nIHRoZSBpY29uIHRvIG1hdGNoIHRoZSBmb250IHNpemUgb2ZcbiAgICogdGhlIGVsZW1lbnQgdGhlIGljb24gaXMgY29udGFpbmVkIGluLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGlubGluZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5saW5lO1xuICB9XG4gIHNldCBpbmxpbmUoaW5saW5lOiBib29sZWFuKSB7XG4gICAgdGhpcy5faW5saW5lID0gY29lcmNlQm9vbGVhblByb3BlcnR5KGlubGluZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW5saW5lOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE5hbWUgb2YgdGhlIGljb24gaW4gdGhlIFNWRyBpY29uIHNldC4gKi9cbiAgQElucHV0KCkgc3ZnSWNvbjogc3RyaW5nO1xuXG4gIC8qKiBGb250IHNldCB0aGF0IHRoZSBpY29uIGlzIGEgcGFydCBvZi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGZvbnRTZXQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZvbnRTZXQ7IH1cbiAgc2V0IGZvbnRTZXQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2ZvbnRTZXQgPSB0aGlzLl9jbGVhbnVwRm9udFZhbHVlKHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9mb250U2V0OiBzdHJpbmc7XG5cbiAgLyoqIE5hbWUgb2YgYW4gaWNvbiB3aXRoaW4gYSBmb250IHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGZvbnRJY29uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9mb250SWNvbjsgfVxuICBzZXQgZm9udEljb24odmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2ZvbnRJY29uID0gdGhpcy5fY2xlYW51cEZvbnRWYWx1ZSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZm9udEljb246IHN0cmluZztcblxuICBwcml2YXRlIF9wcmV2aW91c0ZvbnRTZXRDbGFzczogc3RyaW5nO1xuICBwcml2YXRlIF9wcmV2aW91c0ZvbnRJY29uQ2xhc3M6IHN0cmluZztcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgcGFnZSBwYXRoLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1BhdGg/OiBzdHJpbmc7XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBlbGVtZW50cyBhbmQgYXR0cmlidXRlcyB0aGF0IHdlJ3ZlIHByZWZpeGVkIHdpdGggdGhlIGN1cnJlbnQgcGF0aC4gKi9cbiAgcHJpdmF0ZSBfZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzPzogTWFwPEVsZW1lbnQsIHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmd9W10+O1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIGN1cnJlbnQgaW4tcHJvZ3Jlc3MgU1ZHIGljb24gcmVxdWVzdC4gKi9cbiAgcHJpdmF0ZSBfY3VycmVudEljb25GZXRjaCA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9pY29uUmVnaXN0cnk6IE1hdEljb25SZWdpc3RyeSxcbiAgICAgIEBBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgYXJpYUhpZGRlbjogc3RyaW5nLFxuICAgICAgLyoqXG4gICAgICAgKiBAZGVwcmVjYXRlZCBgbG9jYXRpb25gIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgICAgICovXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9JQ09OX0xPQ0FUSU9OKSBwcml2YXRlIF9sb2NhdGlvbj86IE1hdEljb25Mb2NhdGlvbixcbiAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgX2Vycm9ySGFuZGxlciBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByZWFkb25seSBfZXJyb3JIYW5kbGVyPzogRXJyb3JIYW5kbGVyKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoYXMgbm90IGV4cGxpY2l0bHkgc2V0IGFyaWEtaGlkZGVuLCBtYXJrIHRoZSBpY29uIGFzIGhpZGRlbiwgYXMgdGhpcyBpc1xuICAgIC8vIHRoZSByaWdodCB0aGluZyB0byBkbyBmb3IgdGhlIG1ham9yaXR5IG9mIGljb24gdXNlLWNhc2VzLlxuICAgIGlmICghYXJpYUhpZGRlbikge1xuICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTcGxpdHMgYW4gc3ZnSWNvbiBiaW5kaW5nIHZhbHVlIGludG8gaXRzIGljb24gc2V0IGFuZCBpY29uIG5hbWUgY29tcG9uZW50cy5cbiAgICogUmV0dXJucyBhIDItZWxlbWVudCBhcnJheSBvZiBbKGljb24gc2V0KSwgKGljb24gbmFtZSldLlxuICAgKiBUaGUgc2VwYXJhdG9yIGZvciB0aGUgdHdvIGZpZWxkcyBpcyAnOicuIElmIHRoZXJlIGlzIG5vIHNlcGFyYXRvciwgYW4gZW1wdHlcbiAgICogc3RyaW5nIGlzIHJldHVybmVkIGZvciB0aGUgaWNvbiBzZXQgYW5kIHRoZSBlbnRpcmUgdmFsdWUgaXMgcmV0dXJuZWQgZm9yXG4gICAqIHRoZSBpY29uIG5hbWUuIElmIHRoZSBhcmd1bWVudCBpcyBmYWxzeSwgcmV0dXJucyBhbiBhcnJheSBvZiB0d28gZW1wdHkgc3RyaW5ncy5cbiAgICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBuYW1lIGNvbnRhaW5zIHR3byBvciBtb3JlICc6JyBzZXBhcmF0b3JzLlxuICAgKiBFeGFtcGxlczpcbiAgICogICBgJ3NvY2lhbDpjYWtlJyAtPiBbJ3NvY2lhbCcsICdjYWtlJ11cbiAgICogICAncGVuZ3VpbicgLT4gWycnLCAncGVuZ3VpbiddXG4gICAqICAgbnVsbCAtPiBbJycsICcnXVxuICAgKiAgICdhOmI6YycgLT4gKHRocm93cyBFcnJvcilgXG4gICAqL1xuICBwcml2YXRlIF9zcGxpdEljb25OYW1lKGljb25OYW1lOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICBpZiAoIWljb25OYW1lKSB7XG4gICAgICByZXR1cm4gWycnLCAnJ107XG4gICAgfVxuICAgIGNvbnN0IHBhcnRzID0gaWNvbk5hbWUuc3BsaXQoJzonKTtcbiAgICBzd2l0Y2ggKHBhcnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gWycnLCBwYXJ0c1swXV07IC8vIFVzZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICAgIGNhc2UgMjogcmV0dXJuIDxbc3RyaW5nLCBzdHJpbmddPnBhcnRzO1xuICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IoYEludmFsaWQgaWNvbiBuYW1lOiBcIiR7aWNvbk5hbWV9XCJgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgLy8gT25seSB1cGRhdGUgdGhlIGlubGluZSBTVkcgaWNvbiBpZiB0aGUgaW5wdXRzIGNoYW5nZWQsIHRvIGF2b2lkIHVubmVjZXNzYXJ5IERPTSBvcGVyYXRpb25zLlxuICAgIGNvbnN0IHN2Z0ljb25DaGFuZ2VzID0gY2hhbmdlc1snc3ZnSWNvbiddO1xuXG4gICAgaWYgKHN2Z0ljb25DaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jdXJyZW50SWNvbkZldGNoLnVuc3Vic2NyaWJlKCk7XG5cbiAgICAgIGlmICh0aGlzLnN2Z0ljb24pIHtcbiAgICAgICAgY29uc3QgW25hbWVzcGFjZSwgaWNvbk5hbWVdID0gdGhpcy5fc3BsaXRJY29uTmFtZSh0aGlzLnN2Z0ljb24pO1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJY29uRmV0Y2ggPSB0aGlzLl9pY29uUmVnaXN0cnkuZ2V0TmFtZWRTdmdJY29uKGljb25OYW1lLCBuYW1lc3BhY2UpXG4gICAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgICAgLnN1YnNjcmliZShzdmcgPT4gdGhpcy5fc2V0U3ZnRWxlbWVudChzdmcpLCAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgRXJyb3IgcmV0cmlldmluZyBpY29uICR7bmFtZXNwYWNlfToke2ljb25OYW1lfSEgJHtlcnIubWVzc2FnZX1gO1xuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIF9lcnJvckhhbmRsZXIgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl9lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IobmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHN2Z0ljb25DaGFuZ2VzLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5fY2xlYXJTdmdFbGVtZW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVXBkYXRlIGZvbnQgY2xhc3NlcyBiZWNhdXNlIG5nT25DaGFuZ2VzIHdvbid0IGJlIGNhbGxlZCBpZiBub25lIG9mIHRoZSBpbnB1dHMgYXJlIHByZXNlbnQsXG4gICAgLy8gZS5nLiA8bWF0LWljb24+YXJyb3c8L21hdC1pY29uPiBJbiB0aGlzIGNhc2Ugd2UgbmVlZCB0byBhZGQgYSBDU1MgY2xhc3MgZm9yIHRoZSBkZWZhdWx0IGZvbnQuXG4gICAgaWYgKHRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGNvbnN0IGNhY2hlZEVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzO1xuXG4gICAgaWYgKGNhY2hlZEVsZW1lbnRzICYmIHRoaXMuX2xvY2F0aW9uICYmIGNhY2hlZEVsZW1lbnRzLnNpemUpIHtcbiAgICAgIGNvbnN0IG5ld1BhdGggPSB0aGlzLl9sb2NhdGlvbi5nZXRQYXRobmFtZSgpO1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGhlIFVSTCBoYXMgY2hhbmdlZCBvbiBlYWNoIGNoYW5nZSBkZXRlY3Rpb24gc2luY2VcbiAgICAgIC8vIHRoZSBicm93c2VyIGRvZXNuJ3QgaGF2ZSBhbiBBUEkgdGhhdCB3aWxsIGxldCB1cyByZWFjdCBvbiBsaW5rIGNsaWNrcyBhbmRcbiAgICAgIC8vIHdlIGNhbid0IGRlcGVuZCBvbiB0aGUgQW5ndWxhciByb3V0ZXIuIFRoZSByZWZlcmVuY2VzIG5lZWQgdG8gYmUgdXBkYXRlZCxcbiAgICAgIC8vIGJlY2F1c2Ugd2hpbGUgbW9zdCBicm93c2VycyBkb24ndCBjYXJlIHdoZXRoZXIgdGhlIFVSTCBpcyBjb3JyZWN0IGFmdGVyXG4gICAgICAvLyB0aGUgZmlyc3QgcmVuZGVyLCBTYWZhcmkgd2lsbCBicmVhayBpZiB0aGUgdXNlciBuYXZpZ2F0ZXMgdG8gYSBkaWZmZXJlbnRcbiAgICAgIC8vIHBhZ2UgYW5kIHRoZSBTVkcgaXNuJ3QgcmUtcmVuZGVyZWQuXG4gICAgICBpZiAobmV3UGF0aCAhPT0gdGhpcy5fcHJldmlvdXNQYXRoKSB7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUGF0aCA9IG5ld1BhdGg7XG4gICAgICAgIHRoaXMuX3ByZXBlbmRQYXRoVG9SZWZlcmVuY2VzKG5ld1BhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2N1cnJlbnRJY29uRmV0Y2gudW5zdWJzY3JpYmUoKTtcblxuICAgIGlmICh0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcy5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VzaW5nRm9udEljb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnN2Z0ljb247XG4gIH1cblxuICBwcml2YXRlIF9zZXRTdmdFbGVtZW50KHN2ZzogU1ZHRWxlbWVudCkge1xuICAgIHRoaXMuX2NsZWFyU3ZnRWxlbWVudCgpO1xuXG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgSUUxMSBhbmQgRWRnZSBpZ25vcmluZyBgc3R5bGVgIHRhZ3MgaW5zaWRlIGR5bmFtaWNhbGx5LWNyZWF0ZWQgU1ZHcy5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEwODk4NDY5L1xuICAgIC8vIERvIHRoaXMgYmVmb3JlIGluc2VydGluZyB0aGUgZWxlbWVudCBpbnRvIHRoZSBET00sIGluIG9yZGVyIHRvIGF2b2lkIGEgc3R5bGUgcmVjYWxjdWxhdGlvbi5cbiAgICBjb25zdCBzdHlsZVRhZ3MgPSBzdmcucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSBhcyBOb2RlTGlzdE9mPEhUTUxTdHlsZUVsZW1lbnQ+O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHlsZVRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0eWxlVGFnc1tpXS50ZXh0Q29udGVudCArPSAnICc7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgZG8gdGhpcyBmaXggaGVyZSwgcmF0aGVyIHRoYW4gdGhlIGljb24gcmVnaXN0cnksIGJlY2F1c2UgdGhlXG4gICAgLy8gcmVmZXJlbmNlcyBoYXZlIHRvIHBvaW50IHRvIHRoZSBVUkwgYXQgdGhlIHRpbWUgdGhhdCB0aGUgaWNvbiB3YXMgY3JlYXRlZC5cbiAgICBpZiAodGhpcy5fbG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9sb2NhdGlvbi5nZXRQYXRobmFtZSgpO1xuICAgICAgdGhpcy5fcHJldmlvdXNQYXRoID0gcGF0aDtcbiAgICAgIHRoaXMuX2NhY2hlQ2hpbGRyZW5XaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKHN2Zyk7XG4gICAgICB0aGlzLl9wcmVwZW5kUGF0aFRvUmVmZXJlbmNlcyhwYXRoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFyU3ZnRWxlbWVudCgpIHtcbiAgICBjb25zdCBsYXlvdXRFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgY2hpbGRDb3VudCA9IGxheW91dEVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKSB7XG4gICAgICB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXhpc3Rpbmcgbm9uLWVsZW1lbnQgY2hpbGQgbm9kZXMgYW5kIFNWR3MsIGFuZCBhZGQgdGhlIG5ldyBTVkcgZWxlbWVudC4gTm90ZSB0aGF0XG4gICAgLy8gd2UgY2FuJ3QgdXNlIGlubmVySFRNTCwgYmVjYXVzZSBJRSB3aWxsIHRocm93IGlmIHRoZSBlbGVtZW50IGhhcyBhIGRhdGEgYmluZGluZy5cbiAgICB3aGlsZSAoY2hpbGRDb3VudC0tKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IGxheW91dEVsZW1lbnQuY2hpbGROb2Rlc1tjaGlsZENvdW50XTtcblxuICAgICAgLy8gMSBjb3JyZXNwb25kcyB0byBOb2RlLkVMRU1FTlRfTk9ERS4gV2UgcmVtb3ZlIGFsbCBub24tZWxlbWVudCBub2RlcyBpbiBvcmRlciB0byBnZXQgcmlkXG4gICAgICAvLyBvZiBhbnkgbG9vc2UgdGV4dCBub2RlcywgYXMgd2VsbCBhcyBhbnkgU1ZHIGVsZW1lbnRzIGluIG9yZGVyIHRvIHJlbW92ZSBhbnkgb2xkIGljb25zLlxuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9PSAxIHx8IGNoaWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdmcnKSB7XG4gICAgICAgIGxheW91dEVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUZvbnRJY29uQ2xhc3NlcygpIHtcbiAgICBpZiAoIXRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW06IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGZvbnRTZXRDbGFzcyA9IHRoaXMuZm9udFNldCA/XG4gICAgICAgIHRoaXMuX2ljb25SZWdpc3RyeS5jbGFzc05hbWVGb3JGb250QWxpYXModGhpcy5mb250U2V0KSA6XG4gICAgICAgIHRoaXMuX2ljb25SZWdpc3RyeS5nZXREZWZhdWx0Rm9udFNldENsYXNzKCk7XG5cbiAgICBpZiAoZm9udFNldENsYXNzICE9IHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzKSB7XG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChmb250U2V0Q2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGZvbnRTZXRDbGFzcyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcmV2aW91c0ZvbnRTZXRDbGFzcyA9IGZvbnRTZXRDbGFzcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb250SWNvbiAhPSB0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MpIHtcbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mb250SWNvbikge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQodGhpcy5mb250SWNvbik7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MgPSB0aGlzLmZvbnRJY29uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnMgdXAgYSB2YWx1ZSB0byBiZSB1c2VkIGFzIGEgZm9udEljb24gb3IgZm9udFNldC5cbiAgICogU2luY2UgdGhlIHZhbHVlIGVuZHMgdXAgYmVpbmcgYXNzaWduZWQgYXMgYSBDU1MgY2xhc3MsIHdlXG4gICAqIGhhdmUgdG8gdHJpbSB0aGUgdmFsdWUgYW5kIG9taXQgc3BhY2Utc2VwYXJhdGVkIHZhbHVlcy5cbiAgICovXG4gIHByaXZhdGUgX2NsZWFudXBGb250VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUudHJpbSgpLnNwbGl0KCcgJylbMF0gOiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVwZW5kcyB0aGUgY3VycmVudCBwYXRoIHRvIGFsbCBlbGVtZW50cyB0aGF0IGhhdmUgYW4gYXR0cmlidXRlIHBvaW50aW5nIHRvIGEgYEZ1bmNJUklgXG4gICAqIHJlZmVyZW5jZS4gVGhpcyBpcyByZXF1aXJlZCBiZWNhdXNlIFdlYktpdCBicm93c2VycyByZXF1aXJlIHJlZmVyZW5jZXMgdG8gYmUgcHJlZml4ZWQgd2l0aFxuICAgKiB0aGUgY3VycmVudCBwYXRoLCBpZiB0aGUgcGFnZSBoYXMgYSBgYmFzZWAgdGFnLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJlcGVuZFBhdGhUb1JlZmVyZW5jZXMocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXM7XG5cbiAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnRzLmZvckVhY2goKGF0dHJzLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGF0dHJzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBgdXJsKCcke3BhdGh9IyR7YXR0ci52YWx1ZX0nKWApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZXMgdGhlIGNoaWxkcmVuIG9mIGFuIFNWRyBlbGVtZW50IHRoYXQgaGF2ZSBgdXJsKClgXG4gICAqIHJlZmVyZW5jZXMgdGhhdCB3ZSBuZWVkIHRvIHByZWZpeCB3aXRoIHRoZSBjdXJyZW50IHBhdGguXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZUNoaWxkcmVuV2l0aEV4dGVybmFsUmVmZXJlbmNlcyhlbGVtZW50OiBTVkdFbGVtZW50KSB7XG4gICAgY29uc3QgZWxlbWVudHNXaXRoRnVuY0lyaSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChmdW5jSXJpQXR0cmlidXRlU2VsZWN0b3IpO1xuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzID1cbiAgICAgICAgdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzIHx8IG5ldyBNYXAoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHNXaXRoRnVuY0lyaS5sZW5ndGg7IGkrKykge1xuICAgICAgZnVuY0lyaUF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudFdpdGhSZWZlcmVuY2UgPSBlbGVtZW50c1dpdGhGdW5jSXJpW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnRXaXRoUmVmZXJlbmNlLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB2YWx1ZSA/IHZhbHVlLm1hdGNoKGZ1bmNJcmlQYXR0ZXJuKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBlbGVtZW50cy5nZXQoZWxlbWVudFdpdGhSZWZlcmVuY2UpO1xuXG4gICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICBlbGVtZW50cy5zZXQoZWxlbWVudFdpdGhSZWZlcmVuY2UsIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF0dHJpYnV0ZXMhLnB1c2goe25hbWU6IGF0dHIsIHZhbHVlOiBtYXRjaFsxXX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW5saW5lOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=