/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { Attribute, ChangeDetectionStrategy, Component, ElementRef, ErrorHandler, inject, Inject, InjectionToken, Input, Optional, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatIconRegistry } from './icon-registry';
import * as i0 from "@angular/core";
import * as i1 from "./icon-registry";
// Boilerplate for applying mixins to MatIcon.
/** @docs-private */
const _MatIconBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
/** Injection token to be used to override the default options for `mat-icon`. */
export const MAT_ICON_DEFAULT_OPTIONS = new InjectionToken('MAT_ICON_DEFAULT_OPTIONS');
/**
 * Injection token used to provide the current location to `MatIcon`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
export const MAT_ICON_LOCATION = new InjectionToken('mat-icon-location', {
    providedIn: 'root',
    factory: MAT_ICON_LOCATION_FACTORY,
});
/** @docs-private */
export function MAT_ICON_LOCATION_FACTORY() {
    const _document = inject(DOCUMENT);
    const _location = _document ? _document.location : null;
    return {
        // Note that this needs to be a function, rather than a property, because Angular
        // will only resolve it once, but we want the current path on each call.
        getPathname: () => (_location ? _location.pathname + _location.search : ''),
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
    'stroke',
];
/** Selector that can be used to find all elements that are using a `FuncIRI`. */
const funcIriAttributeSelector = funcIriAttributes.map(attr => `[${attr}]`).join(', ');
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
export class MatIcon extends _MatIconBase {
    constructor(elementRef, _iconRegistry, ariaHidden, _location, _errorHandler, defaults) {
        super(elementRef);
        this._iconRegistry = _iconRegistry;
        this._location = _location;
        this._errorHandler = _errorHandler;
        this._inline = false;
        /** Subscription to the current in-progress SVG icon request. */
        this._currentIconFetch = Subscription.EMPTY;
        if (defaults) {
            if (defaults.color) {
                this.color = this.defaultColor = defaults.color;
            }
            if (defaults.fontSet) {
                this.fontSet = defaults.fontSet;
            }
        }
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
    /** Name of the icon in the SVG icon set. */
    get svgIcon() {
        return this._svgIcon;
    }
    set svgIcon(value) {
        if (value !== this._svgIcon) {
            if (value) {
                this._updateSvgIcon(value);
            }
            else if (this._svgIcon) {
                this._clearSvgElement();
            }
            this._svgIcon = value;
        }
    }
    /** Font set that the icon is a part of. */
    get fontSet() {
        return this._fontSet;
    }
    set fontSet(value) {
        const newValue = this._cleanupFontValue(value);
        if (newValue !== this._fontSet) {
            this._fontSet = newValue;
            this._updateFontIconClasses();
        }
    }
    /** Name of an icon within a font set. */
    get fontIcon() {
        return this._fontIcon;
    }
    set fontIcon(value) {
        const newValue = this._cleanupFontValue(value);
        if (newValue !== this._fontIcon) {
            this._fontIcon = newValue;
            this._updateFontIconClasses();
        }
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
            case 1:
                return ['', parts[0]]; // Use default namespace.
            case 2:
                return parts;
            default:
                throw Error(`Invalid icon name: "${iconName}"`); // TODO: add an ngDevMode check
        }
    }
    ngOnInit() {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <mat-icon>arrow</mat-icon> In this case we need to add a CSS class for the default font.
        this._updateFontIconClasses();
    }
    ngAfterViewChecked() {
        const cachedElements = this._elementsWithExternalReferences;
        if (cachedElements && cachedElements.size) {
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
        const path = this._location.getPathname();
        this._previousPath = path;
        this._cacheChildrenWithExternalReferences(svg);
        this._prependPathToReferences(path);
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
                child.remove();
            }
        }
    }
    _updateFontIconClasses() {
        if (!this._usingFontIcon()) {
            return;
        }
        const elem = this._elementRef.nativeElement;
        const fontSetClass = this.fontSet
            ? this._iconRegistry.classNameForFontAlias(this.fontSet)
            : this._iconRegistry.getDefaultFontSetClass();
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
        const elements = (this._elementsWithExternalReferences =
            this._elementsWithExternalReferences || new Map());
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
    /** Sets a new SVG icon with a particular name. */
    _updateSvgIcon(rawName) {
        this._svgNamespace = null;
        this._svgName = null;
        this._currentIconFetch.unsubscribe();
        if (rawName) {
            const [namespace, iconName] = this._splitIconName(rawName);
            if (namespace) {
                this._svgNamespace = namespace;
            }
            if (iconName) {
                this._svgName = iconName;
            }
            this._currentIconFetch = this._iconRegistry
                .getNamedSvgIcon(iconName, namespace)
                .pipe(take(1))
                .subscribe(svg => this._setSvgElement(svg), (err) => {
                const errorMessage = `Error retrieving icon ${namespace}:${iconName}! ${err.message}`;
                this._errorHandler.handleError(new Error(errorMessage));
            });
        }
    }
}
MatIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatIcon, deps: [{ token: i0.ElementRef }, { token: i1.MatIconRegistry }, { token: 'aria-hidden', attribute: true }, { token: MAT_ICON_LOCATION }, { token: i0.ErrorHandler }, { token: MAT_ICON_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatIcon.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.0", type: MatIcon, selector: "mat-icon", inputs: { color: "color", inline: "inline", svgIcon: "svgIcon", fontSet: "fontSet", fontIcon: "fontIcon" }, host: { attributes: { "role": "img" }, properties: { "attr.data-mat-icon-type": "_usingFontIcon() ? \"font\" : \"svg\"", "attr.data-mat-icon-name": "_svgName || fontIcon", "attr.data-mat-icon-namespace": "_svgNamespace || fontSet", "class.mat-icon-inline": "inline", "class.mat-icon-no-color": "color !== \"primary\" && color !== \"accent\" && color !== \"warn\"" }, classAttribute: "mat-icon notranslate" }, exportAs: ["matIcon"], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, styles: [".mat-icon{-webkit-user-select:none;-moz-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: MatIcon, decorators: [{
            type: Component,
            args: [{ template: '<ng-content></ng-content>', selector: 'mat-icon', exportAs: 'matIcon', inputs: ['color'], host: {
                        'role': 'img',
                        'class': 'mat-icon notranslate',
                        '[attr.data-mat-icon-type]': '_usingFontIcon() ? "font" : "svg"',
                        '[attr.data-mat-icon-name]': '_svgName || fontIcon',
                        '[attr.data-mat-icon-namespace]': '_svgNamespace || fontSet',
                        '[class.mat-icon-inline]': 'inline',
                        '[class.mat-icon-no-color]': 'color !== "primary" && color !== "accent" && color !== "warn"',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".mat-icon{-webkit-user-select:none;-moz-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.MatIconRegistry }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['aria-hidden']
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_ICON_LOCATION]
                }] }, { type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_ICON_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { inline: [{
                type: Input
            }], svgIcon: [{
                type: Input
            }], fontSet: [{
                type: Input
            }], fontIcon: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFHTCxRQUFRLEVBQ1IsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBeUIsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7QUFFaEQsOENBQThDO0FBQzlDLG9CQUFvQjtBQUNwQixNQUFNLFlBQVksR0FBRyxVQUFVLENBQzdCO0lBQ0UsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0NBQy9DLENBQ0YsQ0FBQztBQVVGLGlGQUFpRjtBQUNqRixNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FDeEQsMEJBQTBCLENBQzNCLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQWtCLG1CQUFtQixFQUFFO0lBQ3hGLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSx5QkFBeUI7Q0FDbkMsQ0FBQyxDQUFDO0FBVUgsb0JBQW9C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IExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdDaGVja2VkLFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEVycm9ySGFuZGxlcixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBUaGVtZVBhbGV0dGUsIG1peGluQ29sb3J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TWF0SWNvblJlZ2lzdHJ5fSBmcm9tICcuL2ljb24tcmVnaXN0cnknO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEljb24uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdEljb25CYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfSxcbik7XG5cbi8qKiBEZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtaWNvbmAuICAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRJY29uRGVmYXVsdE9wdGlvbnMge1xuICAvKiogRGVmYXVsdCBjb2xvciBvZiB0aGUgaWNvbi4gKi9cbiAgY29sb3I/OiBUaGVtZVBhbGV0dGU7XG4gIC8qKiBGb250IHNldCB0aGF0IHRoZSBpY29uIGlzIGEgcGFydCBvZi4gKi9cbiAgZm9udFNldD86IHN0cmluZztcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtaWNvbmAuICovXG5leHBvcnQgY29uc3QgTUFUX0lDT05fREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdEljb25EZWZhdWx0T3B0aW9ucz4oXG4gICdNQVRfSUNPTl9ERUZBVUxUX09QVElPTlMnLFxuKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdXNlZCB0byBwcm92aWRlIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIGBNYXRJY29uYC5cbiAqIFVzZWQgdG8gaGFuZGxlIHNlcnZlci1zaWRlIHJlbmRlcmluZyBhbmQgdG8gc3R1YiBvdXQgZHVyaW5nIHVuaXQgdGVzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfSUNPTl9MT0NBVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRJY29uTG9jYXRpb24+KCdtYXQtaWNvbi1sb2NhdGlvbicsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiBNQVRfSUNPTl9MT0NBVElPTl9GQUNUT1JZLFxufSk7XG5cbi8qKlxuICogU3R1YmJlZCBvdXQgbG9jYXRpb24gZm9yIGBNYXRJY29uYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRJY29uTG9jYXRpb24ge1xuICBnZXRQYXRobmFtZTogKCkgPT4gc3RyaW5nO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9JQ09OX0xPQ0FUSU9OX0ZBQ1RPUlkoKTogTWF0SWNvbkxvY2F0aW9uIHtcbiAgY29uc3QgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgY29uc3QgX2xvY2F0aW9uID0gX2RvY3VtZW50ID8gX2RvY3VtZW50LmxvY2F0aW9uIDogbnVsbDtcblxuICByZXR1cm4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIG5lZWRzIHRvIGJlIGEgZnVuY3Rpb24sIHJhdGhlciB0aGFuIGEgcHJvcGVydHksIGJlY2F1c2UgQW5ndWxhclxuICAgIC8vIHdpbGwgb25seSByZXNvbHZlIGl0IG9uY2UsIGJ1dCB3ZSB3YW50IHRoZSBjdXJyZW50IHBhdGggb24gZWFjaCBjYWxsLlxuICAgIGdldFBhdGhuYW1lOiAoKSA9PiAoX2xvY2F0aW9uID8gX2xvY2F0aW9uLnBhdGhuYW1lICsgX2xvY2F0aW9uLnNlYXJjaCA6ICcnKSxcbiAgfTtcbn1cblxuLyoqIFNWRyBhdHRyaWJ1dGVzIHRoYXQgYWNjZXB0IGEgRnVuY0lSSSAoZS5nLiBgdXJsKDxzb21ldGhpbmc+KWApLiAqL1xuY29uc3QgZnVuY0lyaUF0dHJpYnV0ZXMgPSBbXG4gICdjbGlwLXBhdGgnLFxuICAnY29sb3ItcHJvZmlsZScsXG4gICdzcmMnLFxuICAnY3Vyc29yJyxcbiAgJ2ZpbGwnLFxuICAnZmlsdGVyJyxcbiAgJ21hcmtlcicsXG4gICdtYXJrZXItc3RhcnQnLFxuICAnbWFya2VyLW1pZCcsXG4gICdtYXJrZXItZW5kJyxcbiAgJ21hc2snLFxuICAnc3Ryb2tlJyxcbl07XG5cbi8qKiBTZWxlY3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbmQgYWxsIGVsZW1lbnRzIHRoYXQgYXJlIHVzaW5nIGEgYEZ1bmNJUklgLiAqL1xuY29uc3QgZnVuY0lyaUF0dHJpYnV0ZVNlbGVjdG9yID0gZnVuY0lyaUF0dHJpYnV0ZXMubWFwKGF0dHIgPT4gYFske2F0dHJ9XWApLmpvaW4oJywgJyk7XG5cbi8qKiBSZWdleCB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4dHJhY3QgdGhlIGlkIG91dCBvZiBhIEZ1bmNJUkkuICovXG5jb25zdCBmdW5jSXJpUGF0dGVybiA9IC9edXJsXFwoWydcIl0/IyguKj8pWydcIl0/XFwpJC87XG5cbi8qKlxuICogQ29tcG9uZW50IHRvIGRpc3BsYXkgYW4gaWNvbi4gSXQgY2FuIGJlIHVzZWQgaW4gdGhlIGZvbGxvd2luZyB3YXlzOlxuICpcbiAqIC0gU3BlY2lmeSB0aGUgc3ZnSWNvbiBpbnB1dCB0byBsb2FkIGFuIFNWRyBpY29uIGZyb20gYSBVUkwgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlXG4gKiAgIGFkZFN2Z0ljb24sIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZSwgYWRkU3ZnSWNvblNldCwgb3IgYWRkU3ZnSWNvblNldEluTmFtZXNwYWNlIG1ldGhvZHMgb2ZcbiAqICAgTWF0SWNvblJlZ2lzdHJ5LiBJZiB0aGUgc3ZnSWNvbiB2YWx1ZSBjb250YWlucyBhIGNvbG9uIGl0IGlzIGFzc3VtZWQgdG8gYmUgaW4gdGhlIGZvcm1hdFxuICogICBcIltuYW1lc3BhY2VdOltuYW1lXVwiLCBpZiBub3QgdGhlIHZhbHVlIHdpbGwgYmUgdGhlIG5hbWUgb2YgYW4gaWNvbiBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24gc3ZnSWNvbj1cImxlZnQtYXJyb3dcIj48L21hdC1pY29uPlxuICogICAgIDxtYXQtaWNvbiBzdmdJY29uPVwiYW5pbWFsczpjYXRcIj48L21hdC1pY29uPmBcbiAqXG4gKiAtIFVzZSBhIGZvbnQgbGlnYXR1cmUgYXMgYW4gaWNvbiBieSBwdXR0aW5nIHRoZSBsaWdhdHVyZSB0ZXh0IGluIHRoZSBjb250ZW50IG9mIHRoZSBgPG1hdC1pY29uPmBcbiAqICAgY29tcG9uZW50LiBCeSBkZWZhdWx0IHRoZSBNYXRlcmlhbCBpY29ucyBmb250IGlzIHVzZWQgYXMgZGVzY3JpYmVkIGF0XG4gKiAgIGh0dHA6Ly9nb29nbGUuZ2l0aHViLmlvL21hdGVyaWFsLWRlc2lnbi1pY29ucy8jaWNvbi1mb250LWZvci10aGUtd2ViLiBZb3UgY2FuIHNwZWNpZnkgYW5cbiAqICAgYWx0ZXJuYXRlIGZvbnQgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBlaXRoZXIgdGhlIENTUyBjbGFzcyB0byBhcHBseSB0byB1c2UgdGhlXG4gKiAgIGRlc2lyZWQgZm9udCwgb3IgdG8gYW4gYWxpYXMgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggTWF0SWNvblJlZ2lzdHJ5LnJlZ2lzdGVyRm9udENsYXNzQWxpYXMuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24+aG9tZTwvbWF0LWljb24+XG4gKiAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJteWZvbnRcIj5zdW48L21hdC1pY29uPmBcbiAqXG4gKiAtIFNwZWNpZnkgYSBmb250IGdseXBoIHRvIGJlIGluY2x1ZGVkIHZpYSBDU1MgcnVsZXMgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBzcGVjaWZ5IHRoZVxuICogICBmb250LCBhbmQgdGhlIGZvbnRJY29uIGlucHV0IHRvIHNwZWNpZnkgdGhlIGljb24uIFR5cGljYWxseSB0aGUgZm9udEljb24gd2lsbCBzcGVjaWZ5IGFcbiAqICAgQ1NTIGNsYXNzIHdoaWNoIGNhdXNlcyB0aGUgZ2x5cGggdG8gYmUgZGlzcGxheWVkIHZpYSBhIDpiZWZvcmUgc2VsZWN0b3IsIGFzIGluXG4gKiAgIGh0dHBzOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9leGFtcGxlcy9cbiAqICAgRXhhbXBsZTpcbiAqICAgICBgPG1hdC1pY29uIGZvbnRTZXQ9XCJmYVwiIGZvbnRJY29uPVwiYWxhcm1cIj48L21hdC1pY29uPmBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHNlbGVjdG9yOiAnbWF0LWljb24nLFxuICBleHBvcnRBczogJ21hdEljb24nLFxuICBzdHlsZVVybHM6IFsnaWNvbi5jc3MnXSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdpbWcnLFxuICAgICdjbGFzcyc6ICdtYXQtaWNvbiBub3RyYW5zbGF0ZScsXG4gICAgJ1thdHRyLmRhdGEtbWF0LWljb24tdHlwZV0nOiAnX3VzaW5nRm9udEljb24oKSA/IFwiZm9udFwiIDogXCJzdmdcIicsXG4gICAgJ1thdHRyLmRhdGEtbWF0LWljb24tbmFtZV0nOiAnX3N2Z05hbWUgfHwgZm9udEljb24nLFxuICAgICdbYXR0ci5kYXRhLW1hdC1pY29uLW5hbWVzcGFjZV0nOiAnX3N2Z05hbWVzcGFjZSB8fCBmb250U2V0JyxcbiAgICAnW2NsYXNzLm1hdC1pY29uLWlubGluZV0nOiAnaW5saW5lJyxcbiAgICAnW2NsYXNzLm1hdC1pY29uLW5vLWNvbG9yXSc6ICdjb2xvciAhPT0gXCJwcmltYXJ5XCIgJiYgY29sb3IgIT09IFwiYWNjZW50XCIgJiYgY29sb3IgIT09IFwid2FyblwiJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEljb24gZXh0ZW5kcyBfTWF0SWNvbkJhc2UgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0NoZWNrZWQsIENhbkNvbG9yLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgaWNvbiBzaG91bGQgYmUgaW5saW5lZCwgYXV0b21hdGljYWxseSBzaXppbmcgdGhlIGljb24gdG8gbWF0Y2ggdGhlIGZvbnQgc2l6ZSBvZlxuICAgKiB0aGUgZWxlbWVudCB0aGUgaWNvbiBpcyBjb250YWluZWQgaW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaW5saW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pbmxpbmU7XG4gIH1cbiAgc2V0IGlubGluZShpbmxpbmU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2lubGluZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShpbmxpbmUpO1xuICB9XG4gIHByaXZhdGUgX2lubGluZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBOYW1lIG9mIHRoZSBpY29uIGluIHRoZSBTVkcgaWNvbiBzZXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdmdJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3N2Z0ljb247XG4gIH1cbiAgc2V0IHN2Z0ljb24odmFsdWU6IHN0cmluZykge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fc3ZnSWNvbikge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN2Z0ljb24odmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdmdJY29uKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyU3ZnRWxlbWVudCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc3ZnSWNvbiA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9zdmdJY29uOiBzdHJpbmc7XG5cbiAgLyoqIEZvbnQgc2V0IHRoYXQgdGhlIGljb24gaXMgYSBwYXJ0IG9mLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9udFNldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9mb250U2V0O1xuICB9XG4gIHNldCBmb250U2V0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuX2NsZWFudXBGb250VmFsdWUodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9mb250U2V0KSB7XG4gICAgICB0aGlzLl9mb250U2V0ID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl91cGRhdGVGb250SWNvbkNsYXNzZXMoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZm9udFNldDogc3RyaW5nO1xuXG4gIC8qKiBOYW1lIG9mIGFuIGljb24gd2l0aGluIGEgZm9udCBzZXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBmb250SWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9mb250SWNvbjtcbiAgfVxuICBzZXQgZm9udEljb24odmFsdWU6IHN0cmluZykge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5fY2xlYW51cEZvbnRWYWx1ZSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2ZvbnRJY29uKSB7XG4gICAgICB0aGlzLl9mb250SWNvbiA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2ZvbnRJY29uOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfcHJldmlvdXNGb250U2V0Q2xhc3M6IHN0cmluZztcbiAgcHJpdmF0ZSBfcHJldmlvdXNGb250SWNvbkNsYXNzOiBzdHJpbmc7XG5cbiAgX3N2Z05hbWU6IHN0cmluZyB8IG51bGw7XG4gIF9zdmdOYW1lc3BhY2U6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IHBhZ2UgcGF0aC4gKi9cbiAgcHJpdmF0ZSBfcHJldmlvdXNQYXRoPzogc3RyaW5nO1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgZWxlbWVudHMgYW5kIGF0dHJpYnV0ZXMgdGhhdCB3ZSd2ZSBwcmVmaXhlZCB3aXRoIHRoZSBjdXJyZW50IHBhdGguICovXG4gIHByaXZhdGUgX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcz86IE1hcDxFbGVtZW50LCB7bmFtZTogc3RyaW5nOyB2YWx1ZTogc3RyaW5nfVtdPjtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRoZSBjdXJyZW50IGluLXByb2dyZXNzIFNWRyBpY29uIHJlcXVlc3QuICovXG4gIHByaXZhdGUgX2N1cnJlbnRJY29uRmV0Y2ggPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfaWNvblJlZ2lzdHJ5OiBNYXRJY29uUmVnaXN0cnksXG4gICAgQEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSBhcmlhSGlkZGVuOiBzdHJpbmcsXG4gICAgQEluamVjdChNQVRfSUNPTl9MT0NBVElPTikgcHJpdmF0ZSBfbG9jYXRpb246IE1hdEljb25Mb2NhdGlvbixcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9lcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX0lDT05fREVGQVVMVF9PUFRJT05TKVxuICAgIGRlZmF1bHRzPzogTWF0SWNvbkRlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmNvbG9yKSB7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmRlZmF1bHRDb2xvciA9IGRlZmF1bHRzLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVmYXVsdHMuZm9udFNldCkge1xuICAgICAgICB0aGlzLmZvbnRTZXQgPSBkZWZhdWx0cy5mb250U2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBub3QgZXhwbGljaXRseSBzZXQgYXJpYS1oaWRkZW4sIG1hcmsgdGhlIGljb24gYXMgaGlkZGVuLCBhcyB0aGlzIGlzXG4gICAgLy8gdGhlIHJpZ2h0IHRoaW5nIHRvIGRvIGZvciB0aGUgbWFqb3JpdHkgb2YgaWNvbiB1c2UtY2FzZXMuXG4gICAgaWYgKCFhcmlhSGlkZGVuKSB7XG4gICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0cyBhbiBzdmdJY29uIGJpbmRpbmcgdmFsdWUgaW50byBpdHMgaWNvbiBzZXQgYW5kIGljb24gbmFtZSBjb21wb25lbnRzLlxuICAgKiBSZXR1cm5zIGEgMi1lbGVtZW50IGFycmF5IG9mIFsoaWNvbiBzZXQpLCAoaWNvbiBuYW1lKV0uXG4gICAqIFRoZSBzZXBhcmF0b3IgZm9yIHRoZSB0d28gZmllbGRzIGlzICc6Jy4gSWYgdGhlcmUgaXMgbm8gc2VwYXJhdG9yLCBhbiBlbXB0eVxuICAgKiBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIHRoZSBpY29uIHNldCBhbmQgdGhlIGVudGlyZSB2YWx1ZSBpcyByZXR1cm5lZCBmb3JcbiAgICogdGhlIGljb24gbmFtZS4gSWYgdGhlIGFyZ3VtZW50IGlzIGZhbHN5LCByZXR1cm5zIGFuIGFycmF5IG9mIHR3byBlbXB0eSBzdHJpbmdzLlxuICAgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIG5hbWUgY29udGFpbnMgdHdvIG9yIG1vcmUgJzonIHNlcGFyYXRvcnMuXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIGAnc29jaWFsOmNha2UnIC0+IFsnc29jaWFsJywgJ2Nha2UnXVxuICAgKiAgICdwZW5ndWluJyAtPiBbJycsICdwZW5ndWluJ11cbiAgICogICBudWxsIC0+IFsnJywgJyddXG4gICAqICAgJ2E6YjpjJyAtPiAodGhyb3dzIEVycm9yKWBcbiAgICovXG4gIHByaXZhdGUgX3NwbGl0SWNvbk5hbWUoaWNvbk5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICAgIGlmICghaWNvbk5hbWUpIHtcbiAgICAgIHJldHVybiBbJycsICcnXTtcbiAgICB9XG4gICAgY29uc3QgcGFydHMgPSBpY29uTmFtZS5zcGxpdCgnOicpO1xuICAgIHN3aXRjaCAocGFydHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBbJycsIHBhcnRzWzBdXTsgLy8gVXNlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gPFtzdHJpbmcsIHN0cmluZ10+cGFydHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBFcnJvcihgSW52YWxpZCBpY29uIG5hbWU6IFwiJHtpY29uTmFtZX1cImApOyAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVXBkYXRlIGZvbnQgY2xhc3NlcyBiZWNhdXNlIG5nT25DaGFuZ2VzIHdvbid0IGJlIGNhbGxlZCBpZiBub25lIG9mIHRoZSBpbnB1dHMgYXJlIHByZXNlbnQsXG4gICAgLy8gZS5nLiA8bWF0LWljb24+YXJyb3c8L21hdC1pY29uPiBJbiB0aGlzIGNhc2Ugd2UgbmVlZCB0byBhZGQgYSBDU1MgY2xhc3MgZm9yIHRoZSBkZWZhdWx0IGZvbnQuXG4gICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgY29uc3QgY2FjaGVkRWxlbWVudHMgPSB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXM7XG5cbiAgICBpZiAoY2FjaGVkRWxlbWVudHMgJiYgY2FjaGVkRWxlbWVudHMuc2l6ZSkge1xuICAgICAgY29uc3QgbmV3UGF0aCA9IHRoaXMuX2xvY2F0aW9uLmdldFBhdGhuYW1lKCk7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciB0aGUgVVJMIGhhcyBjaGFuZ2VkIG9uIGVhY2ggY2hhbmdlIGRldGVjdGlvbiBzaW5jZVxuICAgICAgLy8gdGhlIGJyb3dzZXIgZG9lc24ndCBoYXZlIGFuIEFQSSB0aGF0IHdpbGwgbGV0IHVzIHJlYWN0IG9uIGxpbmsgY2xpY2tzIGFuZFxuICAgICAgLy8gd2UgY2FuJ3QgZGVwZW5kIG9uIHRoZSBBbmd1bGFyIHJvdXRlci4gVGhlIHJlZmVyZW5jZXMgbmVlZCB0byBiZSB1cGRhdGVkLFxuICAgICAgLy8gYmVjYXVzZSB3aGlsZSBtb3N0IGJyb3dzZXJzIGRvbid0IGNhcmUgd2hldGhlciB0aGUgVVJMIGlzIGNvcnJlY3QgYWZ0ZXJcbiAgICAgIC8vIHRoZSBmaXJzdCByZW5kZXIsIFNhZmFyaSB3aWxsIGJyZWFrIGlmIHRoZSB1c2VyIG5hdmlnYXRlcyB0byBhIGRpZmZlcmVudFxuICAgICAgLy8gcGFnZSBhbmQgdGhlIFNWRyBpc24ndCByZS1yZW5kZXJlZC5cbiAgICAgIGlmIChuZXdQYXRoICE9PSB0aGlzLl9wcmV2aW91c1BhdGgpIHtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNQYXRoID0gbmV3UGF0aDtcbiAgICAgICAgdGhpcy5fcHJlcGVuZFBhdGhUb1JlZmVyZW5jZXMobmV3UGF0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY3VycmVudEljb25GZXRjaC51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcykge1xuICAgICAgdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzLmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgX3VzaW5nRm9udEljb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnN2Z0ljb247XG4gIH1cblxuICBwcml2YXRlIF9zZXRTdmdFbGVtZW50KHN2ZzogU1ZHRWxlbWVudCkge1xuICAgIHRoaXMuX2NsZWFyU3ZnRWxlbWVudCgpO1xuXG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgSUUxMSBhbmQgRWRnZSBpZ25vcmluZyBgc3R5bGVgIHRhZ3MgaW5zaWRlIGR5bmFtaWNhbGx5LWNyZWF0ZWQgU1ZHcy5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEwODk4NDY5L1xuICAgIC8vIERvIHRoaXMgYmVmb3JlIGluc2VydGluZyB0aGUgZWxlbWVudCBpbnRvIHRoZSBET00sIGluIG9yZGVyIHRvIGF2b2lkIGEgc3R5bGUgcmVjYWxjdWxhdGlvbi5cbiAgICBjb25zdCBzdHlsZVRhZ3MgPSBzdmcucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSBhcyBOb2RlTGlzdE9mPEhUTUxTdHlsZUVsZW1lbnQ+O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHlsZVRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0eWxlVGFnc1tpXS50ZXh0Q29udGVudCArPSAnICc7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgZG8gdGhpcyBmaXggaGVyZSwgcmF0aGVyIHRoYW4gdGhlIGljb24gcmVnaXN0cnksIGJlY2F1c2UgdGhlXG4gICAgLy8gcmVmZXJlbmNlcyBoYXZlIHRvIHBvaW50IHRvIHRoZSBVUkwgYXQgdGhlIHRpbWUgdGhhdCB0aGUgaWNvbiB3YXMgY3JlYXRlZC5cbiAgICBjb25zdCBwYXRoID0gdGhpcy5fbG9jYXRpb24uZ2V0UGF0aG5hbWUoKTtcbiAgICB0aGlzLl9wcmV2aW91c1BhdGggPSBwYXRoO1xuICAgIHRoaXMuX2NhY2hlQ2hpbGRyZW5XaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKHN2Zyk7XG4gICAgdGhpcy5fcHJlcGVuZFBhdGhUb1JlZmVyZW5jZXMocGF0aCk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHN2Zyk7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhclN2Z0VsZW1lbnQoKSB7XG4gICAgY29uc3QgbGF5b3V0RWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgbGV0IGNoaWxkQ291bnQgPSBsYXlvdXRFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcykge1xuICAgICAgdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV4aXN0aW5nIG5vbi1lbGVtZW50IGNoaWxkIG5vZGVzIGFuZCBTVkdzLCBhbmQgYWRkIHRoZSBuZXcgU1ZHIGVsZW1lbnQuIE5vdGUgdGhhdFxuICAgIC8vIHdlIGNhbid0IHVzZSBpbm5lckhUTUwsIGJlY2F1c2UgSUUgd2lsbCB0aHJvdyBpZiB0aGUgZWxlbWVudCBoYXMgYSBkYXRhIGJpbmRpbmcuXG4gICAgd2hpbGUgKGNoaWxkQ291bnQtLSkge1xuICAgICAgY29uc3QgY2hpbGQgPSBsYXlvdXRFbGVtZW50LmNoaWxkTm9kZXNbY2hpbGRDb3VudF07XG5cbiAgICAgIC8vIDEgY29ycmVzcG9uZHMgdG8gTm9kZS5FTEVNRU5UX05PREUuIFdlIHJlbW92ZSBhbGwgbm9uLWVsZW1lbnQgbm9kZXMgaW4gb3JkZXIgdG8gZ2V0IHJpZFxuICAgICAgLy8gb2YgYW55IGxvb3NlIHRleHQgbm9kZXMsIGFzIHdlbGwgYXMgYW55IFNWRyBlbGVtZW50cyBpbiBvcmRlciB0byByZW1vdmUgYW55IG9sZCBpY29ucy5cbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPT0gMSB8fCBjaGlsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJykge1xuICAgICAgICBjaGlsZC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVGb250SWNvbkNsYXNzZXMoKSB7XG4gICAgaWYgKCF0aGlzLl91c2luZ0ZvbnRJY29uKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtOiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBmb250U2V0Q2xhc3MgPSB0aGlzLmZvbnRTZXRcbiAgICAgID8gdGhpcy5faWNvblJlZ2lzdHJ5LmNsYXNzTmFtZUZvckZvbnRBbGlhcyh0aGlzLmZvbnRTZXQpXG4gICAgICA6IHRoaXMuX2ljb25SZWdpc3RyeS5nZXREZWZhdWx0Rm9udFNldENsYXNzKCk7XG5cbiAgICBpZiAoZm9udFNldENsYXNzICE9IHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzKSB7XG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChmb250U2V0Q2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGZvbnRTZXRDbGFzcyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcmV2aW91c0ZvbnRTZXRDbGFzcyA9IGZvbnRTZXRDbGFzcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb250SWNvbiAhPSB0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MpIHtcbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mb250SWNvbikge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQodGhpcy5mb250SWNvbik7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MgPSB0aGlzLmZvbnRJY29uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnMgdXAgYSB2YWx1ZSB0byBiZSB1c2VkIGFzIGEgZm9udEljb24gb3IgZm9udFNldC5cbiAgICogU2luY2UgdGhlIHZhbHVlIGVuZHMgdXAgYmVpbmcgYXNzaWduZWQgYXMgYSBDU1MgY2xhc3MsIHdlXG4gICAqIGhhdmUgdG8gdHJpbSB0aGUgdmFsdWUgYW5kIG9taXQgc3BhY2Utc2VwYXJhdGVkIHZhbHVlcy5cbiAgICovXG4gIHByaXZhdGUgX2NsZWFudXBGb250VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUudHJpbSgpLnNwbGl0KCcgJylbMF0gOiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVwZW5kcyB0aGUgY3VycmVudCBwYXRoIHRvIGFsbCBlbGVtZW50cyB0aGF0IGhhdmUgYW4gYXR0cmlidXRlIHBvaW50aW5nIHRvIGEgYEZ1bmNJUklgXG4gICAqIHJlZmVyZW5jZS4gVGhpcyBpcyByZXF1aXJlZCBiZWNhdXNlIFdlYktpdCBicm93c2VycyByZXF1aXJlIHJlZmVyZW5jZXMgdG8gYmUgcHJlZml4ZWQgd2l0aFxuICAgKiB0aGUgY3VycmVudCBwYXRoLCBpZiB0aGUgcGFnZSBoYXMgYSBgYmFzZWAgdGFnLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJlcGVuZFBhdGhUb1JlZmVyZW5jZXMocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXM7XG5cbiAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnRzLmZvckVhY2goKGF0dHJzLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGF0dHJzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBgdXJsKCcke3BhdGh9IyR7YXR0ci52YWx1ZX0nKWApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZXMgdGhlIGNoaWxkcmVuIG9mIGFuIFNWRyBlbGVtZW50IHRoYXQgaGF2ZSBgdXJsKClgXG4gICAqIHJlZmVyZW5jZXMgdGhhdCB3ZSBuZWVkIHRvIHByZWZpeCB3aXRoIHRoZSBjdXJyZW50IHBhdGguXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZUNoaWxkcmVuV2l0aEV4dGVybmFsUmVmZXJlbmNlcyhlbGVtZW50OiBTVkdFbGVtZW50KSB7XG4gICAgY29uc3QgZWxlbWVudHNXaXRoRnVuY0lyaSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChmdW5jSXJpQXR0cmlidXRlU2VsZWN0b3IpO1xuICAgIGNvbnN0IGVsZW1lbnRzID0gKHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcyA9XG4gICAgICB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMgfHwgbmV3IE1hcCgpKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHNXaXRoRnVuY0lyaS5sZW5ndGg7IGkrKykge1xuICAgICAgZnVuY0lyaUF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudFdpdGhSZWZlcmVuY2UgPSBlbGVtZW50c1dpdGhGdW5jSXJpW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnRXaXRoUmVmZXJlbmNlLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB2YWx1ZSA/IHZhbHVlLm1hdGNoKGZ1bmNJcmlQYXR0ZXJuKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBlbGVtZW50cy5nZXQoZWxlbWVudFdpdGhSZWZlcmVuY2UpO1xuXG4gICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICBlbGVtZW50cy5zZXQoZWxlbWVudFdpdGhSZWZlcmVuY2UsIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF0dHJpYnV0ZXMhLnB1c2goe25hbWU6IGF0dHIsIHZhbHVlOiBtYXRjaFsxXX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyBhIG5ldyBTVkcgaWNvbiB3aXRoIGEgcGFydGljdWxhciBuYW1lLiAqL1xuICBwcml2YXRlIF91cGRhdGVTdmdJY29uKHJhd05hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX3N2Z05hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fc3ZnTmFtZSA9IG51bGw7XG4gICAgdGhpcy5fY3VycmVudEljb25GZXRjaC51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKHJhd05hbWUpIHtcbiAgICAgIGNvbnN0IFtuYW1lc3BhY2UsIGljb25OYW1lXSA9IHRoaXMuX3NwbGl0SWNvbk5hbWUocmF3TmFtZSk7XG5cbiAgICAgIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgICAgdGhpcy5fc3ZnTmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWNvbk5hbWUpIHtcbiAgICAgICAgdGhpcy5fc3ZnTmFtZSA9IGljb25OYW1lO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jdXJyZW50SWNvbkZldGNoID0gdGhpcy5faWNvblJlZ2lzdHJ5XG4gICAgICAgIC5nZXROYW1lZFN2Z0ljb24oaWNvbk5hbWUsIG5hbWVzcGFjZSlcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICBzdmcgPT4gdGhpcy5fc2V0U3ZnRWxlbWVudChzdmcpLFxuICAgICAgICAgIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgRXJyb3IgcmV0cmlldmluZyBpY29uICR7bmFtZXNwYWNlfToke2ljb25OYW1lfSEgJHtlcnIubWVzc2FnZX1gO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKTtcbiAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19