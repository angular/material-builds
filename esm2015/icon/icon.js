/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { take } from 'rxjs/operators';
import { MatIconRegistry } from './icon-registry';
// Boilerplate for applying mixins to MatIcon.
/**
 * \@docs-private
 */
class MatIconBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatIconBase.prototype._elementRef;
}
/** @type {?} */
const _MatIconMixinBase = mixinColor(MatIconBase);
/**
 * Injection token used to provide the current location to `MatIcon`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * \@docs-private
 * @type {?}
 */
export const MAT_ICON_LOCATION = new InjectionToken('mat-icon-location', {
    providedIn: 'root',
    factory: MAT_ICON_LOCATION_FACTORY
});
/**
 * Stubbed out location for `MatIcon`.
 * \@docs-private
 * @record
 */
export function MatIconLocation() { }
if (false) {
    /** @type {?} */
    MatIconLocation.prototype.getPathname;
}
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_ICON_LOCATION_FACTORY() {
    /** @type {?} */
    const _document = inject(DOCUMENT);
    /** @type {?} */
    const _location = _document ? _document.location : null;
    return {
        // Note that this needs to be a function, rather than a property, because Angular
        // will only resolve it once, but we want the current path on each call.
        getPathname: (/**
         * @return {?}
         */
        () => _location ? (_location.pathname + _location.search) : '')
    };
}
/**
 * SVG attributes that accept a FuncIRI (e.g. `url(<something>)`).
 * @type {?}
 */
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
const ɵ0 = /**
 * @param {?} attr
 * @return {?}
 */
attr => `[${attr}]`;
/**
 * Selector that can be used to find all elements that are using a `FuncIRI`.
 * @type {?}
 */
const funcIriAttributeSelector = funcIriAttributes.map((ɵ0)).join(', ');
/**
 * Regex that can be used to extract the id out of a FuncIRI.
 * @type {?}
 */
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
export class MatIcon extends _MatIconMixinBase {
    /**
     * @param {?} elementRef
     * @param {?} _iconRegistry
     * @param {?} ariaHidden
     * @param {?=} _location
     * @param {?=} _errorHandler
     */
    constructor(elementRef, _iconRegistry, ariaHidden, _location, _errorHandler) {
        super(elementRef);
        this._iconRegistry = _iconRegistry;
        this._location = _location;
        this._errorHandler = _errorHandler;
        this._inline = false;
        // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
        // the right thing to do for the majority of icon use-cases.
        if (!ariaHidden) {
            elementRef.nativeElement.setAttribute('aria-hidden', 'true');
        }
    }
    /**
     * Whether the icon should be inlined, automatically sizing the icon to match the font size of
     * the element the icon is contained in.
     * @return {?}
     */
    get inline() {
        return this._inline;
    }
    /**
     * @param {?} inline
     * @return {?}
     */
    set inline(inline) {
        this._inline = coerceBooleanProperty(inline);
    }
    /**
     * Font set that the icon is a part of.
     * @return {?}
     */
    get fontSet() { return this._fontSet; }
    /**
     * @param {?} value
     * @return {?}
     */
    set fontSet(value) {
        this._fontSet = this._cleanupFontValue(value);
    }
    /**
     * Name of an icon within a font set.
     * @return {?}
     */
    get fontIcon() { return this._fontIcon; }
    /**
     * @param {?} value
     * @return {?}
     */
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
     * @private
     * @param {?} iconName
     * @return {?}
     */
    _splitIconName(iconName) {
        if (!iconName) {
            return ['', ''];
        }
        /** @type {?} */
        const parts = iconName.split(':');
        switch (parts.length) {
            case 1: return ['', parts[0]]; // Use default namespace.
            case 2: return (/** @type {?} */ (parts));
            default: throw Error(`Invalid icon name: "${iconName}"`);
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        /** @type {?} */
        const svgIconChanges = changes['svgIcon'];
        if (svgIconChanges) {
            if (this.svgIcon) {
                const [namespace, iconName] = this._splitIconName(this.svgIcon);
                this._iconRegistry.getNamedSvgIcon(iconName, namespace)
                    .pipe(take(1))
                    .subscribe((/**
                 * @param {?} svg
                 * @return {?}
                 */
                svg => this._setSvgElement(svg)), (/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    /** @type {?} */
                    const errorMessage = `Error retrieving icon ${namespace}:${iconName}! ${err.message}`;
                    // @breaking-change 9.0.0 _errorHandler parameter to be made required.
                    if (this._errorHandler) {
                        this._errorHandler.handleError(new Error(errorMessage));
                    }
                    else {
                        console.error(errorMessage);
                    }
                }));
            }
            else if (svgIconChanges.previousValue) {
                this._clearSvgElement();
            }
        }
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <mat-icon>arrow</mat-icon> In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewChecked() {
        /** @type {?} */
        const cachedElements = this._elementsWithExternalReferences;
        if (cachedElements && this._location && cachedElements.size) {
            /** @type {?} */
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
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._elementsWithExternalReferences) {
            this._elementsWithExternalReferences.clear();
        }
    }
    /**
     * @private
     * @return {?}
     */
    _usingFontIcon() {
        return !this.svgIcon;
    }
    /**
     * @private
     * @param {?} svg
     * @return {?}
     */
    _setSvgElement(svg) {
        this._clearSvgElement();
        // Workaround for IE11 and Edge ignoring `style` tags inside dynamically-created SVGs.
        // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10898469/
        // Do this before inserting the element into the DOM, in order to avoid a style recalculation.
        /** @type {?} */
        const styleTags = (/** @type {?} */ (svg.querySelectorAll('style')));
        for (let i = 0; i < styleTags.length; i++) {
            styleTags[i].textContent += ' ';
        }
        // Note: we do this fix here, rather than the icon registry, because the
        // references have to point to the URL at the time that the icon was created.
        if (this._location) {
            /** @type {?} */
            const path = this._location.getPathname();
            this._previousPath = path;
            this._cacheChildrenWithExternalReferences(svg);
            this._prependPathToReferences(path);
        }
        this._elementRef.nativeElement.appendChild(svg);
    }
    /**
     * @private
     * @return {?}
     */
    _clearSvgElement() {
        /** @type {?} */
        const layoutElement = this._elementRef.nativeElement;
        /** @type {?} */
        let childCount = layoutElement.childNodes.length;
        if (this._elementsWithExternalReferences) {
            this._elementsWithExternalReferences.clear();
        }
        // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
        // we can't use innerHTML, because IE will throw if the element has a data binding.
        while (childCount--) {
            /** @type {?} */
            const child = layoutElement.childNodes[childCount];
            // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes in order to get rid
            // of any loose text nodes, as well as any SVG elements in order to remove any old icons.
            if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
                layoutElement.removeChild(child);
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    _updateFontIconClasses() {
        if (!this._usingFontIcon()) {
            return;
        }
        /** @type {?} */
        const elem = this._elementRef.nativeElement;
        /** @type {?} */
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
     * @private
     * @param {?} value
     * @return {?}
     */
    _cleanupFontValue(value) {
        return typeof value === 'string' ? value.trim().split(' ')[0] : value;
    }
    /**
     * Prepends the current path to all elements that have an attribute pointing to a `FuncIRI`
     * reference. This is required because WebKit browsers require references to be prefixed with
     * the current path, if the page has a `base` tag.
     * @private
     * @param {?} path
     * @return {?}
     */
    _prependPathToReferences(path) {
        /** @type {?} */
        const elements = this._elementsWithExternalReferences;
        if (elements) {
            elements.forEach((/**
             * @param {?} attrs
             * @param {?} element
             * @return {?}
             */
            (attrs, element) => {
                attrs.forEach((/**
                 * @param {?} attr
                 * @return {?}
                 */
                attr => {
                    element.setAttribute(attr.name, `url('${path}#${attr.value}')`);
                }));
            }));
        }
    }
    /**
     * Caches the children of an SVG element that have `url()`
     * references that we need to prefix with the current path.
     * @private
     * @param {?} element
     * @return {?}
     */
    _cacheChildrenWithExternalReferences(element) {
        /** @type {?} */
        const elementsWithFuncIri = element.querySelectorAll(funcIriAttributeSelector);
        /** @type {?} */
        const elements = this._elementsWithExternalReferences =
            this._elementsWithExternalReferences || new Map();
        for (let i = 0; i < elementsWithFuncIri.length; i++) {
            funcIriAttributes.forEach((/**
             * @param {?} attr
             * @return {?}
             */
            attr => {
                /** @type {?} */
                const elementWithReference = elementsWithFuncIri[i];
                /** @type {?} */
                const value = elementWithReference.getAttribute(attr);
                /** @type {?} */
                const match = value ? value.match(funcIriPattern) : null;
                if (match) {
                    /** @type {?} */
                    let attributes = elements.get(elementWithReference);
                    if (!attributes) {
                        attributes = [];
                        elements.set(elementWithReference, attributes);
                    }
                    (/** @type {?} */ (attributes)).push({ name: attr, value: match[1] });
                }
            }));
        }
    }
}
MatIcon.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
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
            }] }
];
/** @nocollapse */
MatIcon.ctorParameters = () => [
    { type: ElementRef },
    { type: MatIconRegistry },
    { type: String, decorators: [{ type: Attribute, args: ['aria-hidden',] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_ICON_LOCATION,] }] },
    { type: ErrorHandler, decorators: [{ type: Optional }] }
];
MatIcon.propDecorators = {
    inline: [{ type: Input }],
    svgIcon: [{ type: Input }],
    fontSet: [{ type: Input }],
    fontIcon: [{ type: Input }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatIcon.prototype._inline;
    /**
     * Name of the icon in the SVG icon set.
     * @type {?}
     */
    MatIcon.prototype.svgIcon;
    /**
     * @type {?}
     * @private
     */
    MatIcon.prototype._fontSet;
    /**
     * @type {?}
     * @private
     */
    MatIcon.prototype._fontIcon;
    /**
     * @type {?}
     * @private
     */
    MatIcon.prototype._previousFontSetClass;
    /**
     * @type {?}
     * @private
     */
    MatIcon.prototype._previousFontIconClass;
    /**
     * Keeps track of the current page path.
     * @type {?}
     * @private
     */
    MatIcon.prototype._previousPath;
    /**
     * Keeps track of the elements and attributes that we've prefixed with the current path.
     * @type {?}
     * @private
     */
    MatIcon.prototype._elementsWithExternalReferences;
    /**
     * @type {?}
     * @private
     */
    MatIcon.prototype._iconRegistry;
    /**
     * @deprecated `location` parameter to be made required.
     * \@breaking-change 8.0.0
     * @type {?}
     * @private
     */
    MatIcon.prototype._location;
    /**
     * @type {?}
     * @private
     */
    MatIcon.prototype._errorHandler;
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUlMLFFBQVEsRUFFUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QixVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQUtoRCxNQUFNLFdBQVc7Ozs7SUFDZixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0M7OztJQURhLGtDQUE4Qjs7O01BRXRDLGlCQUFpQixHQUFzQyxVQUFVLENBQUMsV0FBVyxDQUFDOzs7Ozs7O0FBT3BGLE1BQU0sT0FBTyxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FBa0IsbUJBQW1CLEVBQUU7SUFDeEYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLHlCQUF5QjtDQUNuQyxDQUFDOzs7Ozs7QUFNRixxQ0FFQzs7O0lBREMsc0NBQTBCOzs7Ozs7QUFJNUIsTUFBTSxVQUFVLHlCQUF5Qjs7VUFDakMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7O1VBQzVCLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxR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QUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2lCQUNqRDtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7WUEzU0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxTQUFTO2dCQUVuQixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsS0FBSztvQkFDYixPQUFPLEVBQUUsc0JBQXNCO29CQUMvQix5QkFBeUIsRUFBRSxRQUFRO29CQUNuQywyQkFBMkIsRUFBRSwrREFBK0Q7aUJBQzdGO2dCQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7Ozs7WUF6SEMsVUFBVTtZQWdCSixlQUFlO3lDQXdKaEIsU0FBUyxTQUFDLGFBQWE7NENBS3ZCLFFBQVEsWUFBSSxNQUFNLFNBQUMsaUJBQWlCO1lBNUt6QyxZQUFZLHVCQThLUCxRQUFROzs7cUJBOUNaLEtBQUs7c0JBVUwsS0FBSztzQkFHTCxLQUFLO3VCQVFMLEtBQUs7Ozs7Ozs7SUFkTiwwQkFBaUM7Ozs7O0lBR2pDLDBCQUF5Qjs7Ozs7SUFRekIsMkJBQXlCOzs7OztJQVF6Qiw0QkFBMEI7Ozs7O0lBRTFCLHdDQUFzQzs7Ozs7SUFDdEMseUNBQXVDOzs7Ozs7SUFHdkMsZ0NBQStCOzs7Ozs7SUFHL0Isa0RBQXdGOzs7OztJQUcvQyxnQ0FBc0M7Ozs7Ozs7SUFNM0UsNEJBQTBFOzs7OztJQUUxRSxnQ0FBeUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFcnJvckhhbmRsZXIsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBDYW5Db2xvckN0b3IsIG1peGluQ29sb3J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TWF0SWNvblJlZ2lzdHJ5fSBmcm9tICcuL2ljb24tcmVnaXN0cnknO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0SWNvbi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRJY29uQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbmNvbnN0IF9NYXRJY29uTWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiB0eXBlb2YgTWF0SWNvbkJhc2UgPSBtaXhpbkNvbG9yKE1hdEljb25CYXNlKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdXNlZCB0byBwcm92aWRlIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIGBNYXRJY29uYC5cbiAqIFVzZWQgdG8gaGFuZGxlIHNlcnZlci1zaWRlIHJlbmRlcmluZyBhbmQgdG8gc3R1YiBvdXQgZHVyaW5nIHVuaXQgdGVzdHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfSUNPTl9MT0NBVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRJY29uTG9jYXRpb24+KCdtYXQtaWNvbi1sb2NhdGlvbicsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiBNQVRfSUNPTl9MT0NBVElPTl9GQUNUT1JZXG59KTtcblxuLyoqXG4gKiBTdHViYmVkIG91dCBsb2NhdGlvbiBmb3IgYE1hdEljb25gLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEljb25Mb2NhdGlvbiB7XG4gIGdldFBhdGhuYW1lOiAoKSA9PiBzdHJpbmc7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0lDT05fTE9DQVRJT05fRkFDVE9SWSgpOiBNYXRJY29uTG9jYXRpb24ge1xuICBjb25zdCBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuICBjb25zdCBfbG9jYXRpb24gPSBfZG9jdW1lbnQgPyBfZG9jdW1lbnQubG9jYXRpb24gOiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgbmVlZHMgdG8gYmUgYSBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gYSBwcm9wZXJ0eSwgYmVjYXVzZSBBbmd1bGFyXG4gICAgLy8gd2lsbCBvbmx5IHJlc29sdmUgaXQgb25jZSwgYnV0IHdlIHdhbnQgdGhlIGN1cnJlbnQgcGF0aCBvbiBlYWNoIGNhbGwuXG4gICAgZ2V0UGF0aG5hbWU6ICgpID0+IF9sb2NhdGlvbiA/IChfbG9jYXRpb24ucGF0aG5hbWUgKyBfbG9jYXRpb24uc2VhcmNoKSA6ICcnXG4gIH07XG59XG5cblxuLyoqIFNWRyBhdHRyaWJ1dGVzIHRoYXQgYWNjZXB0IGEgRnVuY0lSSSAoZS5nLiBgdXJsKDxzb21ldGhpbmc+KWApLiAqL1xuY29uc3QgZnVuY0lyaUF0dHJpYnV0ZXMgPSBbXG4gICdjbGlwLXBhdGgnLFxuICAnY29sb3ItcHJvZmlsZScsXG4gICdzcmMnLFxuICAnY3Vyc29yJyxcbiAgJ2ZpbGwnLFxuICAnZmlsdGVyJyxcbiAgJ21hcmtlcicsXG4gICdtYXJrZXItc3RhcnQnLFxuICAnbWFya2VyLW1pZCcsXG4gICdtYXJrZXItZW5kJyxcbiAgJ21hc2snLFxuICAnc3Ryb2tlJ1xuXTtcblxuLyoqIFNlbGVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmluZCBhbGwgZWxlbWVudHMgdGhhdCBhcmUgdXNpbmcgYSBgRnVuY0lSSWAuICovXG5jb25zdCBmdW5jSXJpQXR0cmlidXRlU2VsZWN0b3IgPSBmdW5jSXJpQXR0cmlidXRlcy5tYXAoYXR0ciA9PiBgWyR7YXR0cn1dYCkuam9pbignLCAnKTtcblxuLyoqIFJlZ2V4IHRoYXQgY2FuIGJlIHVzZWQgdG8gZXh0cmFjdCB0aGUgaWQgb3V0IG9mIGEgRnVuY0lSSS4gKi9cbmNvbnN0IGZ1bmNJcmlQYXR0ZXJuID0gL151cmxcXChbJ1wiXT8jKC4qPylbJ1wiXT9cXCkkLztcblxuLyoqXG4gKiBDb21wb25lbnQgdG8gZGlzcGxheSBhbiBpY29uLiBJdCBjYW4gYmUgdXNlZCBpbiB0aGUgZm9sbG93aW5nIHdheXM6XG4gKlxuICogLSBTcGVjaWZ5IHRoZSBzdmdJY29uIGlucHV0IHRvIGxvYWQgYW4gU1ZHIGljb24gZnJvbSBhIFVSTCBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCB0aGVcbiAqICAgYWRkU3ZnSWNvbiwgYWRkU3ZnSWNvbkluTmFtZXNwYWNlLCBhZGRTdmdJY29uU2V0LCBvciBhZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UgbWV0aG9kcyBvZlxuICogICBNYXRJY29uUmVnaXN0cnkuIElmIHRoZSBzdmdJY29uIHZhbHVlIGNvbnRhaW5zIGEgY29sb24gaXQgaXMgYXNzdW1lZCB0byBiZSBpbiB0aGUgZm9ybWF0XG4gKiAgIFwiW25hbWVzcGFjZV06W25hbWVdXCIsIGlmIG5vdCB0aGUgdmFsdWUgd2lsbCBiZSB0aGUgbmFtZSBvZiBhbiBpY29uIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAqICAgRXhhbXBsZXM6XG4gKiAgICAgYDxtYXQtaWNvbiBzdmdJY29uPVwibGVmdC1hcnJvd1wiPjwvbWF0LWljb24+XG4gKiAgICAgPG1hdC1pY29uIHN2Z0ljb249XCJhbmltYWxzOmNhdFwiPjwvbWF0LWljb24+YFxuICpcbiAqIC0gVXNlIGEgZm9udCBsaWdhdHVyZSBhcyBhbiBpY29uIGJ5IHB1dHRpbmcgdGhlIGxpZ2F0dXJlIHRleHQgaW4gdGhlIGNvbnRlbnQgb2YgdGhlIGA8bWF0LWljb24+YFxuICogICBjb21wb25lbnQuIEJ5IGRlZmF1bHQgdGhlIE1hdGVyaWFsIGljb25zIGZvbnQgaXMgdXNlZCBhcyBkZXNjcmliZWQgYXRcbiAqICAgaHR0cDovL2dvb2dsZS5naXRodWIuaW8vbWF0ZXJpYWwtZGVzaWduLWljb25zLyNpY29uLWZvbnQtZm9yLXRoZS13ZWIuIFlvdSBjYW4gc3BlY2lmeSBhblxuICogICBhbHRlcm5hdGUgZm9udCBieSBzZXR0aW5nIHRoZSBmb250U2V0IGlucHV0IHRvIGVpdGhlciB0aGUgQ1NTIGNsYXNzIHRvIGFwcGx5IHRvIHVzZSB0aGVcbiAqICAgZGVzaXJlZCBmb250LCBvciB0byBhbiBhbGlhcyBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCBNYXRJY29uUmVnaXN0cnkucmVnaXN0ZXJGb250Q2xhc3NBbGlhcy5cbiAqICAgRXhhbXBsZXM6XG4gKiAgICAgYDxtYXQtaWNvbj5ob21lPC9tYXQtaWNvbj5cbiAqICAgICA8bWF0LWljb24gZm9udFNldD1cIm15Zm9udFwiPnN1bjwvbWF0LWljb24+YFxuICpcbiAqIC0gU3BlY2lmeSBhIGZvbnQgZ2x5cGggdG8gYmUgaW5jbHVkZWQgdmlhIENTUyBydWxlcyBieSBzZXR0aW5nIHRoZSBmb250U2V0IGlucHV0IHRvIHNwZWNpZnkgdGhlXG4gKiAgIGZvbnQsIGFuZCB0aGUgZm9udEljb24gaW5wdXQgdG8gc3BlY2lmeSB0aGUgaWNvbi4gVHlwaWNhbGx5IHRoZSBmb250SWNvbiB3aWxsIHNwZWNpZnkgYVxuICogICBDU1MgY2xhc3Mgd2hpY2ggY2F1c2VzIHRoZSBnbHlwaCB0byBiZSBkaXNwbGF5ZWQgdmlhIGEgOmJlZm9yZSBzZWxlY3RvciwgYXMgaW5cbiAqICAgaHR0cHM6Ly9mb3J0YXdlc29tZS5naXRodWIuaW8vRm9udC1Bd2Vzb21lL2V4YW1wbGVzL1xuICogICBFeGFtcGxlOlxuICogICAgIGA8bWF0LWljb24gZm9udFNldD1cImZhXCIgZm9udEljb249XCJhbGFybVwiPjwvbWF0LWljb24+YFxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgc2VsZWN0b3I6ICdtYXQtaWNvbicsXG4gIGV4cG9ydEFzOiAnbWF0SWNvbicsXG4gIHN0eWxlVXJsczogWydpY29uLmNzcyddLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2ltZycsXG4gICAgJ2NsYXNzJzogJ21hdC1pY29uIG5vdHJhbnNsYXRlJyxcbiAgICAnW2NsYXNzLm1hdC1pY29uLWlubGluZV0nOiAnaW5saW5lJyxcbiAgICAnW2NsYXNzLm1hdC1pY29uLW5vLWNvbG9yXSc6ICdjb2xvciAhPT0gXCJwcmltYXJ5XCIgJiYgY29sb3IgIT09IFwiYWNjZW50XCIgJiYgY29sb3IgIT09IFwid2FyblwiJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEljb24gZXh0ZW5kcyBfTWF0SWNvbk1peGluQmFzZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdDaGVja2VkLFxuICBDYW5Db2xvciwgT25EZXN0cm95IHtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaWNvbiBzaG91bGQgYmUgaW5saW5lZCwgYXV0b21hdGljYWxseSBzaXppbmcgdGhlIGljb24gdG8gbWF0Y2ggdGhlIGZvbnQgc2l6ZSBvZlxuICAgKiB0aGUgZWxlbWVudCB0aGUgaWNvbiBpcyBjb250YWluZWQgaW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaW5saW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pbmxpbmU7XG4gIH1cbiAgc2V0IGlubGluZShpbmxpbmU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbmxpbmUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkoaW5saW5lKTtcbiAgfVxuICBwcml2YXRlIF9pbmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogTmFtZSBvZiB0aGUgaWNvbiBpbiB0aGUgU1ZHIGljb24gc2V0LiAqL1xuICBASW5wdXQoKSBzdmdJY29uOiBzdHJpbmc7XG5cbiAgLyoqIEZvbnQgc2V0IHRoYXQgdGhlIGljb24gaXMgYSBwYXJ0IG9mLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9udFNldCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZm9udFNldDsgfVxuICBzZXQgZm9udFNldCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fZm9udFNldCA9IHRoaXMuX2NsZWFudXBGb250VmFsdWUodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ZvbnRTZXQ6IHN0cmluZztcblxuICAvKiogTmFtZSBvZiBhbiBpY29uIHdpdGhpbiBhIGZvbnQgc2V0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9udEljb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZvbnRJY29uOyB9XG4gIHNldCBmb250SWNvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fZm9udEljb24gPSB0aGlzLl9jbGVhbnVwRm9udFZhbHVlKHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9mb250SWNvbjogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3ByZXZpb3VzRm9udFNldENsYXNzOiBzdHJpbmc7XG4gIHByaXZhdGUgX3ByZXZpb3VzRm9udEljb25DbGFzczogc3RyaW5nO1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBwYWdlIHBhdGguICovXG4gIHByaXZhdGUgX3ByZXZpb3VzUGF0aD86IHN0cmluZztcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGVsZW1lbnRzIGFuZCBhdHRyaWJ1dGVzIHRoYXQgd2UndmUgcHJlZml4ZWQgd2l0aCB0aGUgY3VycmVudCBwYXRoLiAqL1xuICBwcml2YXRlIF9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXM/OiBNYXA8RWxlbWVudCwge25hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZ31bXT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfaWNvblJlZ2lzdHJ5OiBNYXRJY29uUmVnaXN0cnksXG4gICAgICBAQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpIGFyaWFIaWRkZW46IHN0cmluZyxcbiAgICAgIC8qKlxuICAgICAgICogQGRlcHJlY2F0ZWQgYGxvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICAgICAqL1xuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfSUNPTl9MT0NBVElPTikgcHJpdmF0ZSBfbG9jYXRpb24/OiBNYXRJY29uTG9jYXRpb24sXG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIF9lcnJvckhhbmRsZXIgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWRcbiAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgcmVhZG9ubHkgX2Vycm9ySGFuZGxlcj86IEVycm9ySGFuZGxlcikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGFzIG5vdCBleHBsaWNpdGx5IHNldCBhcmlhLWhpZGRlbiwgbWFyayB0aGUgaWNvbiBhcyBoaWRkZW4sIGFzIHRoaXMgaXNcbiAgICAvLyB0aGUgcmlnaHQgdGhpbmcgdG8gZG8gZm9yIHRoZSBtYWpvcml0eSBvZiBpY29uIHVzZS1jYXNlcy5cbiAgICBpZiAoIWFyaWFIaWRkZW4pIHtcbiAgICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3BsaXRzIGFuIHN2Z0ljb24gYmluZGluZyB2YWx1ZSBpbnRvIGl0cyBpY29uIHNldCBhbmQgaWNvbiBuYW1lIGNvbXBvbmVudHMuXG4gICAqIFJldHVybnMgYSAyLWVsZW1lbnQgYXJyYXkgb2YgWyhpY29uIHNldCksIChpY29uIG5hbWUpXS5cbiAgICogVGhlIHNlcGFyYXRvciBmb3IgdGhlIHR3byBmaWVsZHMgaXMgJzonLiBJZiB0aGVyZSBpcyBubyBzZXBhcmF0b3IsIGFuIGVtcHR5XG4gICAqIHN0cmluZyBpcyByZXR1cm5lZCBmb3IgdGhlIGljb24gc2V0IGFuZCB0aGUgZW50aXJlIHZhbHVlIGlzIHJldHVybmVkIGZvclxuICAgKiB0aGUgaWNvbiBuYW1lLiBJZiB0aGUgYXJndW1lbnQgaXMgZmFsc3ksIHJldHVybnMgYW4gYXJyYXkgb2YgdHdvIGVtcHR5IHN0cmluZ3MuXG4gICAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgbmFtZSBjb250YWlucyB0d28gb3IgbW9yZSAnOicgc2VwYXJhdG9ycy5cbiAgICogRXhhbXBsZXM6XG4gICAqICAgYCdzb2NpYWw6Y2FrZScgLT4gWydzb2NpYWwnLCAnY2FrZSddXG4gICAqICAgJ3Blbmd1aW4nIC0+IFsnJywgJ3Blbmd1aW4nXVxuICAgKiAgIG51bGwgLT4gWycnLCAnJ11cbiAgICogICAnYTpiOmMnIC0+ICh0aHJvd3MgRXJyb3IpYFxuICAgKi9cbiAgcHJpdmF0ZSBfc3BsaXRJY29uTmFtZShpY29uTmFtZTogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nXSB7XG4gICAgaWYgKCFpY29uTmFtZSkge1xuICAgICAgcmV0dXJuIFsnJywgJyddO1xuICAgIH1cbiAgICBjb25zdCBwYXJ0cyA9IGljb25OYW1lLnNwbGl0KCc6Jyk7XG4gICAgc3dpdGNoIChwYXJ0cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIFsnJywgcGFydHNbMF1dOyAvLyBVc2UgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAgICBjYXNlIDI6IHJldHVybiA8W3N0cmluZywgc3RyaW5nXT5wYXJ0cztcbiAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yKGBJbnZhbGlkIGljb24gbmFtZTogXCIke2ljb25OYW1lfVwiYCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBpbmxpbmUgU1ZHIGljb24gaWYgdGhlIGlucHV0cyBjaGFuZ2VkLCB0byBhdm9pZCB1bm5lY2Vzc2FyeSBET00gb3BlcmF0aW9ucy5cbiAgICBjb25zdCBzdmdJY29uQ2hhbmdlcyA9IGNoYW5nZXNbJ3N2Z0ljb24nXTtcblxuICAgIGlmIChzdmdJY29uQ2hhbmdlcykge1xuICAgICAgaWYgKHRoaXMuc3ZnSWNvbikge1xuICAgICAgICBjb25zdCBbbmFtZXNwYWNlLCBpY29uTmFtZV0gPSB0aGlzLl9zcGxpdEljb25OYW1lKHRoaXMuc3ZnSWNvbik7XG5cbiAgICAgICAgdGhpcy5faWNvblJlZ2lzdHJ5LmdldE5hbWVkU3ZnSWNvbihpY29uTmFtZSwgbmFtZXNwYWNlKVxuICAgICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoc3ZnID0+IHRoaXMuX3NldFN2Z0VsZW1lbnQoc3ZnKSwgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYEVycm9yIHJldHJpZXZpbmcgaWNvbiAke25hbWVzcGFjZX06JHtpY29uTmFtZX0hICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBfZXJyb3JIYW5kbGVyIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICBpZiAodGhpcy5fZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChzdmdJY29uQ2hhbmdlcy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyU3ZnRWxlbWVudCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl91c2luZ0ZvbnRJY29uKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUZvbnRJY29uQ2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFVwZGF0ZSBmb250IGNsYXNzZXMgYmVjYXVzZSBuZ09uQ2hhbmdlcyB3b24ndCBiZSBjYWxsZWQgaWYgbm9uZSBvZiB0aGUgaW5wdXRzIGFyZSBwcmVzZW50LFxuICAgIC8vIGUuZy4gPG1hdC1pY29uPmFycm93PC9tYXQtaWNvbj4gSW4gdGhpcyBjYXNlIHdlIG5lZWQgdG8gYWRkIGEgQ1NTIGNsYXNzIGZvciB0aGUgZGVmYXVsdCBmb250LlxuICAgIGlmICh0aGlzLl91c2luZ0ZvbnRJY29uKCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUZvbnRJY29uQ2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICBjb25zdCBjYWNoZWRFbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcztcblxuICAgIGlmIChjYWNoZWRFbGVtZW50cyAmJiB0aGlzLl9sb2NhdGlvbiAmJiBjYWNoZWRFbGVtZW50cy5zaXplKSB7XG4gICAgICBjb25zdCBuZXdQYXRoID0gdGhpcy5fbG9jYXRpb24uZ2V0UGF0aG5hbWUoKTtcblxuICAgICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIHRoZSBVUkwgaGFzIGNoYW5nZWQgb24gZWFjaCBjaGFuZ2UgZGV0ZWN0aW9uIHNpbmNlXG4gICAgICAvLyB0aGUgYnJvd3NlciBkb2Vzbid0IGhhdmUgYW4gQVBJIHRoYXQgd2lsbCBsZXQgdXMgcmVhY3Qgb24gbGluayBjbGlja3MgYW5kXG4gICAgICAvLyB3ZSBjYW4ndCBkZXBlbmQgb24gdGhlIEFuZ3VsYXIgcm91dGVyLiBUaGUgcmVmZXJlbmNlcyBuZWVkIHRvIGJlIHVwZGF0ZWQsXG4gICAgICAvLyBiZWNhdXNlIHdoaWxlIG1vc3QgYnJvd3NlcnMgZG9uJ3QgY2FyZSB3aGV0aGVyIHRoZSBVUkwgaXMgY29ycmVjdCBhZnRlclxuICAgICAgLy8gdGhlIGZpcnN0IHJlbmRlciwgU2FmYXJpIHdpbGwgYnJlYWsgaWYgdGhlIHVzZXIgbmF2aWdhdGVzIHRvIGEgZGlmZmVyZW50XG4gICAgICAvLyBwYWdlIGFuZCB0aGUgU1ZHIGlzbid0IHJlLXJlbmRlcmVkLlxuICAgICAgaWYgKG5ld1BhdGggIT09IHRoaXMuX3ByZXZpb3VzUGF0aCkge1xuICAgICAgICB0aGlzLl9wcmV2aW91c1BhdGggPSBuZXdQYXRoO1xuICAgICAgICB0aGlzLl9wcmVwZW5kUGF0aFRvUmVmZXJlbmNlcyhuZXdQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKSB7XG4gICAgICB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMuY2xlYXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91c2luZ0ZvbnRJY29uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5zdmdJY29uO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0U3ZnRWxlbWVudChzdmc6IFNWR0VsZW1lbnQpIHtcbiAgICB0aGlzLl9jbGVhclN2Z0VsZW1lbnQoKTtcblxuICAgIC8vIFdvcmthcm91bmQgZm9yIElFMTEgYW5kIEVkZ2UgaWdub3JpbmcgYHN0eWxlYCB0YWdzIGluc2lkZSBkeW5hbWljYWxseS1jcmVhdGVkIFNWR3MuXG4gICAgLy8gU2VlOiBodHRwczovL2RldmVsb3Blci5taWNyb3NvZnQuY29tL2VuLXVzL21pY3Jvc29mdC1lZGdlL3BsYXRmb3JtL2lzc3Vlcy8xMDg5ODQ2OS9cbiAgICAvLyBEbyB0aGlzIGJlZm9yZSBpbnNlcnRpbmcgdGhlIGVsZW1lbnQgaW50byB0aGUgRE9NLCBpbiBvcmRlciB0byBhdm9pZCBhIHN0eWxlIHJlY2FsY3VsYXRpb24uXG4gICAgY29uc3Qgc3R5bGVUYWdzID0gc3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJykgYXMgTm9kZUxpc3RPZjxIVE1MU3R5bGVFbGVtZW50PjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R5bGVUYWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdHlsZVRhZ3NbaV0udGV4dENvbnRlbnQgKz0gJyAnO1xuICAgIH1cblxuICAgIC8vIE5vdGU6IHdlIGRvIHRoaXMgZml4IGhlcmUsIHJhdGhlciB0aGFuIHRoZSBpY29uIHJlZ2lzdHJ5LCBiZWNhdXNlIHRoZVxuICAgIC8vIHJlZmVyZW5jZXMgaGF2ZSB0byBwb2ludCB0byB0aGUgVVJMIGF0IHRoZSB0aW1lIHRoYXQgdGhlIGljb24gd2FzIGNyZWF0ZWQuXG4gICAgaWYgKHRoaXMuX2xvY2F0aW9uKSB7XG4gICAgICBjb25zdCBwYXRoID0gdGhpcy5fbG9jYXRpb24uZ2V0UGF0aG5hbWUoKTtcbiAgICAgIHRoaXMuX3ByZXZpb3VzUGF0aCA9IHBhdGg7XG4gICAgICB0aGlzLl9jYWNoZUNoaWxkcmVuV2l0aEV4dGVybmFsUmVmZXJlbmNlcyhzdmcpO1xuICAgICAgdGhpcy5fcHJlcGVuZFBhdGhUb1JlZmVyZW5jZXMocGF0aCk7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHN2Zyk7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhclN2Z0VsZW1lbnQoKSB7XG4gICAgY29uc3QgbGF5b3V0RWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgbGV0IGNoaWxkQ291bnQgPSBsYXlvdXRFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcykge1xuICAgICAgdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV4aXN0aW5nIG5vbi1lbGVtZW50IGNoaWxkIG5vZGVzIGFuZCBTVkdzLCBhbmQgYWRkIHRoZSBuZXcgU1ZHIGVsZW1lbnQuIE5vdGUgdGhhdFxuICAgIC8vIHdlIGNhbid0IHVzZSBpbm5lckhUTUwsIGJlY2F1c2UgSUUgd2lsbCB0aHJvdyBpZiB0aGUgZWxlbWVudCBoYXMgYSBkYXRhIGJpbmRpbmcuXG4gICAgd2hpbGUgKGNoaWxkQ291bnQtLSkge1xuICAgICAgY29uc3QgY2hpbGQgPSBsYXlvdXRFbGVtZW50LmNoaWxkTm9kZXNbY2hpbGRDb3VudF07XG5cbiAgICAgIC8vIDEgY29ycmVzcG9uZHMgdG8gTm9kZS5FTEVNRU5UX05PREUuIFdlIHJlbW92ZSBhbGwgbm9uLWVsZW1lbnQgbm9kZXMgaW4gb3JkZXIgdG8gZ2V0IHJpZFxuICAgICAgLy8gb2YgYW55IGxvb3NlIHRleHQgbm9kZXMsIGFzIHdlbGwgYXMgYW55IFNWRyBlbGVtZW50cyBpbiBvcmRlciB0byByZW1vdmUgYW55IG9sZCBpY29ucy5cbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPT0gMSB8fCBjaGlsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJykge1xuICAgICAgICBsYXlvdXRFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVGb250SWNvbkNsYXNzZXMoKSB7XG4gICAgaWYgKCF0aGlzLl91c2luZ0ZvbnRJY29uKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtOiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBmb250U2V0Q2xhc3MgPSB0aGlzLmZvbnRTZXQgP1xuICAgICAgICB0aGlzLl9pY29uUmVnaXN0cnkuY2xhc3NOYW1lRm9yRm9udEFsaWFzKHRoaXMuZm9udFNldCkgOlxuICAgICAgICB0aGlzLl9pY29uUmVnaXN0cnkuZ2V0RGVmYXVsdEZvbnRTZXRDbGFzcygpO1xuXG4gICAgaWYgKGZvbnRTZXRDbGFzcyAhPSB0aGlzLl9wcmV2aW91c0ZvbnRTZXRDbGFzcykge1xuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9wcmV2aW91c0ZvbnRTZXRDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoZm9udFNldENsYXNzKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChmb250U2V0Q2xhc3MpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MgPSBmb250U2V0Q2xhc3M7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZm9udEljb24gIT0gdGhpcy5fcHJldmlvdXNGb250SWNvbkNsYXNzKSB7XG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNGb250SWNvbkNsYXNzKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZm9udEljb24pIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKHRoaXMuZm9udEljb24pO1xuICAgICAgfVxuICAgICAgdGhpcy5fcHJldmlvdXNGb250SWNvbkNsYXNzID0gdGhpcy5mb250SWNvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5zIHVwIGEgdmFsdWUgdG8gYmUgdXNlZCBhcyBhIGZvbnRJY29uIG9yIGZvbnRTZXQuXG4gICAqIFNpbmNlIHRoZSB2YWx1ZSBlbmRzIHVwIGJlaW5nIGFzc2lnbmVkIGFzIGEgQ1NTIGNsYXNzLCB3ZVxuICAgKiBoYXZlIHRvIHRyaW0gdGhlIHZhbHVlIGFuZCBvbWl0IHNwYWNlLXNlcGFyYXRlZCB2YWx1ZXMuXG4gICAqL1xuICBwcml2YXRlIF9jbGVhbnVwRm9udFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlLnRyaW0oKS5zcGxpdCgnICcpWzBdIDogdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGVuZHMgdGhlIGN1cnJlbnQgcGF0aCB0byBhbGwgZWxlbWVudHMgdGhhdCBoYXZlIGFuIGF0dHJpYnV0ZSBwb2ludGluZyB0byBhIGBGdW5jSVJJYFxuICAgKiByZWZlcmVuY2UuIFRoaXMgaXMgcmVxdWlyZWQgYmVjYXVzZSBXZWJLaXQgYnJvd3NlcnMgcmVxdWlyZSByZWZlcmVuY2VzIHRvIGJlIHByZWZpeGVkIHdpdGhcbiAgICogdGhlIGN1cnJlbnQgcGF0aCwgaWYgdGhlIHBhZ2UgaGFzIGEgYGJhc2VgIHRhZy5cbiAgICovXG4gIHByaXZhdGUgX3ByZXBlbmRQYXRoVG9SZWZlcmVuY2VzKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzO1xuXG4gICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICBlbGVtZW50cy5mb3JFYWNoKChhdHRycywgZWxlbWVudCkgPT4ge1xuICAgICAgICBhdHRycy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYHVybCgnJHtwYXRofSMke2F0dHIudmFsdWV9JylgKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGVzIHRoZSBjaGlsZHJlbiBvZiBhbiBTVkcgZWxlbWVudCB0aGF0IGhhdmUgYHVybCgpYFxuICAgKiByZWZlcmVuY2VzIHRoYXQgd2UgbmVlZCB0byBwcmVmaXggd2l0aCB0aGUgY3VycmVudCBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FjaGVDaGlsZHJlbldpdGhFeHRlcm5hbFJlZmVyZW5jZXMoZWxlbWVudDogU1ZHRWxlbWVudCkge1xuICAgIGNvbnN0IGVsZW1lbnRzV2l0aEZ1bmNJcmkgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZnVuY0lyaUF0dHJpYnV0ZVNlbGVjdG9yKTtcbiAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcyA9XG4gICAgICAgIHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcyB8fCBuZXcgTWFwKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzV2l0aEZ1bmNJcmkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZ1bmNJcmlBdHRyaWJ1dGVzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRXaXRoUmVmZXJlbmNlID0gZWxlbWVudHNXaXRoRnVuY0lyaVtpXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlbGVtZW50V2l0aFJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdmFsdWUgPyB2YWx1ZS5tYXRjaChmdW5jSXJpUGF0dGVybikgOiBudWxsO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gZWxlbWVudHMuZ2V0KGVsZW1lbnRXaXRoUmVmZXJlbmNlKTtcblxuICAgICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgZWxlbWVudHMuc2V0KGVsZW1lbnRXaXRoUmVmZXJlbmNlLCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhdHRyaWJ1dGVzIS5wdXNoKHtuYW1lOiBhdHRyLCB2YWx1ZTogbWF0Y2hbMV19KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=