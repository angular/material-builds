/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    /** @type {?} */
    MatIcon.ngAcceptInputType_inline;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUlMLFFBQVEsRUFFUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QixVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQUtoRCxNQUFNLFdBQVc7Ozs7SUFDZixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0M7OztJQURhLGtDQUE4Qjs7O01BRXRDLGlCQUFpQixHQUFzQyxVQUFVLENBQUMsV0FBVyxDQUFDOzs7Ozs7O0FBT3BGLE1BQU0sT0FBTyxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FBa0IsbUJBQW1CLEVBQUU7SUFDeEYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLHlCQUF5QjtDQUNuQyxDQUFDOzs7Ozs7QUFNRixxQ0FFQzs7O0lBREMsc0NBQTBCOzs7Ozs7QUFJNUIsTUFBTSxVQUFVLHlCQUF5Qjs7VUFDakMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7O1VBQzVCLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxR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QUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2lCQUNqRDtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7WUEzU0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxTQUFTO2dCQUVuQixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsS0FBSztvQkFDYixPQUFPLEVBQUUsc0JBQXNCO29CQUMvQix5QkFBeUIsRUFBRSxRQUFRO29CQUNuQywyQkFBMkIsRUFBRSwrREFBK0Q7aUJBQzdGO2dCQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7Ozs7WUF6SEMsVUFBVTtZQWdCSixlQUFlO3lDQXdKaEIsU0FBUyxTQUFDLGFBQWE7NENBS3ZCLFFBQVEsWUFBSSxNQUFNLFNBQUMsaUJBQWlCO1lBNUt6QyxZQUFZLHVCQThLUCxRQUFROzs7cUJBOUNaLEtBQUs7c0JBVUwsS0FBSztzQkFHTCxLQUFLO3VCQVFMLEtBQUs7Ozs7SUFpUU4saUNBQWtEOzs7OztJQS9RbEQsMEJBQWlDOzs7OztJQUdqQywwQkFBeUI7Ozs7O0lBUXpCLDJCQUF5Qjs7Ozs7SUFRekIsNEJBQTBCOzs7OztJQUUxQix3Q0FBc0M7Ozs7O0lBQ3RDLHlDQUF1Qzs7Ozs7O0lBR3ZDLGdDQUErQjs7Ozs7O0lBRy9CLGtEQUF3Rjs7Ozs7SUFHL0MsZ0NBQXNDOzs7Ozs7O0lBTTNFLDRCQUEwRTs7Ozs7SUFFMUUsZ0NBQXlEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXJyb3JIYW5kbGVyLFxuICBpbmplY3QsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLCBtaXhpbkNvbG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01hdEljb25SZWdpc3RyeX0gZnJvbSAnLi9pY29uLXJlZ2lzdHJ5JztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEljb24uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0SWNvbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0SWNvbk1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdEljb25CYXNlID0gbWl4aW5Db2xvcihNYXRJY29uQmFzZSk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gcHJvdmlkZSB0aGUgY3VycmVudCBsb2NhdGlvbiB0byBgTWF0SWNvbmAuXG4gKiBVc2VkIHRvIGhhbmRsZSBzZXJ2ZXItc2lkZSByZW5kZXJpbmcgYW5kIHRvIHN0dWIgb3V0IGR1cmluZyB1bml0IHRlc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0lDT05fTE9DQVRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0SWNvbkxvY2F0aW9uPignbWF0LWljb24tbG9jYXRpb24nLCB7XG4gIHByb3ZpZGVkSW46ICdyb290JyxcbiAgZmFjdG9yeTogTUFUX0lDT05fTE9DQVRJT05fRkFDVE9SWVxufSk7XG5cbi8qKlxuICogU3R1YmJlZCBvdXQgbG9jYXRpb24gZm9yIGBNYXRJY29uYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRJY29uTG9jYXRpb24ge1xuICBnZXRQYXRobmFtZTogKCkgPT4gc3RyaW5nO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9JQ09OX0xPQ0FUSU9OX0ZBQ1RPUlkoKTogTWF0SWNvbkxvY2F0aW9uIHtcbiAgY29uc3QgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgY29uc3QgX2xvY2F0aW9uID0gX2RvY3VtZW50ID8gX2RvY3VtZW50LmxvY2F0aW9uIDogbnVsbDtcblxuICByZXR1cm4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIG5lZWRzIHRvIGJlIGEgZnVuY3Rpb24sIHJhdGhlciB0aGFuIGEgcHJvcGVydHksIGJlY2F1c2UgQW5ndWxhclxuICAgIC8vIHdpbGwgb25seSByZXNvbHZlIGl0IG9uY2UsIGJ1dCB3ZSB3YW50IHRoZSBjdXJyZW50IHBhdGggb24gZWFjaCBjYWxsLlxuICAgIGdldFBhdGhuYW1lOiAoKSA9PiBfbG9jYXRpb24gPyAoX2xvY2F0aW9uLnBhdGhuYW1lICsgX2xvY2F0aW9uLnNlYXJjaCkgOiAnJ1xuICB9O1xufVxuXG5cbi8qKiBTVkcgYXR0cmlidXRlcyB0aGF0IGFjY2VwdCBhIEZ1bmNJUkkgKGUuZy4gYHVybCg8c29tZXRoaW5nPilgKS4gKi9cbmNvbnN0IGZ1bmNJcmlBdHRyaWJ1dGVzID0gW1xuICAnY2xpcC1wYXRoJyxcbiAgJ2NvbG9yLXByb2ZpbGUnLFxuICAnc3JjJyxcbiAgJ2N1cnNvcicsXG4gICdmaWxsJyxcbiAgJ2ZpbHRlcicsXG4gICdtYXJrZXInLFxuICAnbWFya2VyLXN0YXJ0JyxcbiAgJ21hcmtlci1taWQnLFxuICAnbWFya2VyLWVuZCcsXG4gICdtYXNrJyxcbiAgJ3N0cm9rZSdcbl07XG5cbi8qKiBTZWxlY3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbmQgYWxsIGVsZW1lbnRzIHRoYXQgYXJlIHVzaW5nIGEgYEZ1bmNJUklgLiAqL1xuY29uc3QgZnVuY0lyaUF0dHJpYnV0ZVNlbGVjdG9yID0gZnVuY0lyaUF0dHJpYnV0ZXMubWFwKGF0dHIgPT4gYFske2F0dHJ9XWApLmpvaW4oJywgJyk7XG5cbi8qKiBSZWdleCB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4dHJhY3QgdGhlIGlkIG91dCBvZiBhIEZ1bmNJUkkuICovXG5jb25zdCBmdW5jSXJpUGF0dGVybiA9IC9edXJsXFwoWydcIl0/IyguKj8pWydcIl0/XFwpJC87XG5cbi8qKlxuICogQ29tcG9uZW50IHRvIGRpc3BsYXkgYW4gaWNvbi4gSXQgY2FuIGJlIHVzZWQgaW4gdGhlIGZvbGxvd2luZyB3YXlzOlxuICpcbiAqIC0gU3BlY2lmeSB0aGUgc3ZnSWNvbiBpbnB1dCB0byBsb2FkIGFuIFNWRyBpY29uIGZyb20gYSBVUkwgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlXG4gKiAgIGFkZFN2Z0ljb24sIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZSwgYWRkU3ZnSWNvblNldCwgb3IgYWRkU3ZnSWNvblNldEluTmFtZXNwYWNlIG1ldGhvZHMgb2ZcbiAqICAgTWF0SWNvblJlZ2lzdHJ5LiBJZiB0aGUgc3ZnSWNvbiB2YWx1ZSBjb250YWlucyBhIGNvbG9uIGl0IGlzIGFzc3VtZWQgdG8gYmUgaW4gdGhlIGZvcm1hdFxuICogICBcIltuYW1lc3BhY2VdOltuYW1lXVwiLCBpZiBub3QgdGhlIHZhbHVlIHdpbGwgYmUgdGhlIG5hbWUgb2YgYW4gaWNvbiBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24gc3ZnSWNvbj1cImxlZnQtYXJyb3dcIj48L21hdC1pY29uPlxuICogICAgIDxtYXQtaWNvbiBzdmdJY29uPVwiYW5pbWFsczpjYXRcIj48L21hdC1pY29uPmBcbiAqXG4gKiAtIFVzZSBhIGZvbnQgbGlnYXR1cmUgYXMgYW4gaWNvbiBieSBwdXR0aW5nIHRoZSBsaWdhdHVyZSB0ZXh0IGluIHRoZSBjb250ZW50IG9mIHRoZSBgPG1hdC1pY29uPmBcbiAqICAgY29tcG9uZW50LiBCeSBkZWZhdWx0IHRoZSBNYXRlcmlhbCBpY29ucyBmb250IGlzIHVzZWQgYXMgZGVzY3JpYmVkIGF0XG4gKiAgIGh0dHA6Ly9nb29nbGUuZ2l0aHViLmlvL21hdGVyaWFsLWRlc2lnbi1pY29ucy8jaWNvbi1mb250LWZvci10aGUtd2ViLiBZb3UgY2FuIHNwZWNpZnkgYW5cbiAqICAgYWx0ZXJuYXRlIGZvbnQgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBlaXRoZXIgdGhlIENTUyBjbGFzcyB0byBhcHBseSB0byB1c2UgdGhlXG4gKiAgIGRlc2lyZWQgZm9udCwgb3IgdG8gYW4gYWxpYXMgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggTWF0SWNvblJlZ2lzdHJ5LnJlZ2lzdGVyRm9udENsYXNzQWxpYXMuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24+aG9tZTwvbWF0LWljb24+XG4gKiAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJteWZvbnRcIj5zdW48L21hdC1pY29uPmBcbiAqXG4gKiAtIFNwZWNpZnkgYSBmb250IGdseXBoIHRvIGJlIGluY2x1ZGVkIHZpYSBDU1MgcnVsZXMgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBzcGVjaWZ5IHRoZVxuICogICBmb250LCBhbmQgdGhlIGZvbnRJY29uIGlucHV0IHRvIHNwZWNpZnkgdGhlIGljb24uIFR5cGljYWxseSB0aGUgZm9udEljb24gd2lsbCBzcGVjaWZ5IGFcbiAqICAgQ1NTIGNsYXNzIHdoaWNoIGNhdXNlcyB0aGUgZ2x5cGggdG8gYmUgZGlzcGxheWVkIHZpYSBhIDpiZWZvcmUgc2VsZWN0b3IsIGFzIGluXG4gKiAgIGh0dHBzOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9leGFtcGxlcy9cbiAqICAgRXhhbXBsZTpcbiAqICAgICBgPG1hdC1pY29uIGZvbnRTZXQ9XCJmYVwiIGZvbnRJY29uPVwiYWxhcm1cIj48L21hdC1pY29uPmBcbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHNlbGVjdG9yOiAnbWF0LWljb24nLFxuICBleHBvcnRBczogJ21hdEljb24nLFxuICBzdHlsZVVybHM6IFsnaWNvbi5jc3MnXSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdpbWcnLFxuICAgICdjbGFzcyc6ICdtYXQtaWNvbiBub3RyYW5zbGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtaWNvbi1pbmxpbmVdJzogJ2lubGluZScsXG4gICAgJ1tjbGFzcy5tYXQtaWNvbi1uby1jb2xvcl0nOiAnY29sb3IgIT09IFwicHJpbWFyeVwiICYmIGNvbG9yICE9PSBcImFjY2VudFwiICYmIGNvbG9yICE9PSBcIndhcm5cIicsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRJY29uIGV4dGVuZHMgX01hdEljb25NaXhpbkJhc2UgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQ2FuQ29sb3IsIE9uRGVzdHJveSB7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGljb24gc2hvdWxkIGJlIGlubGluZWQsIGF1dG9tYXRpY2FsbHkgc2l6aW5nIHRoZSBpY29uIHRvIG1hdGNoIHRoZSBmb250IHNpemUgb2ZcbiAgICogdGhlIGVsZW1lbnQgdGhlIGljb24gaXMgY29udGFpbmVkIGluLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGlubGluZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5saW5lO1xuICB9XG4gIHNldCBpbmxpbmUoaW5saW5lOiBib29sZWFuKSB7XG4gICAgdGhpcy5faW5saW5lID0gY29lcmNlQm9vbGVhblByb3BlcnR5KGlubGluZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW5saW5lOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE5hbWUgb2YgdGhlIGljb24gaW4gdGhlIFNWRyBpY29uIHNldC4gKi9cbiAgQElucHV0KCkgc3ZnSWNvbjogc3RyaW5nO1xuXG4gIC8qKiBGb250IHNldCB0aGF0IHRoZSBpY29uIGlzIGEgcGFydCBvZi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGZvbnRTZXQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZvbnRTZXQ7IH1cbiAgc2V0IGZvbnRTZXQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2ZvbnRTZXQgPSB0aGlzLl9jbGVhbnVwRm9udFZhbHVlKHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9mb250U2V0OiBzdHJpbmc7XG5cbiAgLyoqIE5hbWUgb2YgYW4gaWNvbiB3aXRoaW4gYSBmb250IHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGZvbnRJY29uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9mb250SWNvbjsgfVxuICBzZXQgZm9udEljb24odmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2ZvbnRJY29uID0gdGhpcy5fY2xlYW51cEZvbnRWYWx1ZSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZm9udEljb246IHN0cmluZztcblxuICBwcml2YXRlIF9wcmV2aW91c0ZvbnRTZXRDbGFzczogc3RyaW5nO1xuICBwcml2YXRlIF9wcmV2aW91c0ZvbnRJY29uQ2xhc3M6IHN0cmluZztcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgcGFnZSBwYXRoLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1BhdGg/OiBzdHJpbmc7XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBlbGVtZW50cyBhbmQgYXR0cmlidXRlcyB0aGF0IHdlJ3ZlIHByZWZpeGVkIHdpdGggdGhlIGN1cnJlbnQgcGF0aC4gKi9cbiAgcHJpdmF0ZSBfZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzPzogTWFwPEVsZW1lbnQsIHtuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmd9W10+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX2ljb25SZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LFxuICAgICAgQEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSBhcmlhSGlkZGVuOiBzdHJpbmcsXG4gICAgICAvKipcbiAgICAgICAqIEBkZXByZWNhdGVkIGBsb2NhdGlvbmAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICAgKi9cbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0lDT05fTE9DQVRJT04pIHByaXZhdGUgX2xvY2F0aW9uPzogTWF0SWNvbkxvY2F0aW9uLFxuICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBfZXJyb3JIYW5kbGVyIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkXG4gICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHJlYWRvbmx5IF9lcnJvckhhbmRsZXI/OiBFcnJvckhhbmRsZXIpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBub3QgZXhwbGljaXRseSBzZXQgYXJpYS1oaWRkZW4sIG1hcmsgdGhlIGljb24gYXMgaGlkZGVuLCBhcyB0aGlzIGlzXG4gICAgLy8gdGhlIHJpZ2h0IHRoaW5nIHRvIGRvIGZvciB0aGUgbWFqb3JpdHkgb2YgaWNvbiB1c2UtY2FzZXMuXG4gICAgaWYgKCFhcmlhSGlkZGVuKSB7XG4gICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0cyBhbiBzdmdJY29uIGJpbmRpbmcgdmFsdWUgaW50byBpdHMgaWNvbiBzZXQgYW5kIGljb24gbmFtZSBjb21wb25lbnRzLlxuICAgKiBSZXR1cm5zIGEgMi1lbGVtZW50IGFycmF5IG9mIFsoaWNvbiBzZXQpLCAoaWNvbiBuYW1lKV0uXG4gICAqIFRoZSBzZXBhcmF0b3IgZm9yIHRoZSB0d28gZmllbGRzIGlzICc6Jy4gSWYgdGhlcmUgaXMgbm8gc2VwYXJhdG9yLCBhbiBlbXB0eVxuICAgKiBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIHRoZSBpY29uIHNldCBhbmQgdGhlIGVudGlyZSB2YWx1ZSBpcyByZXR1cm5lZCBmb3JcbiAgICogdGhlIGljb24gbmFtZS4gSWYgdGhlIGFyZ3VtZW50IGlzIGZhbHN5LCByZXR1cm5zIGFuIGFycmF5IG9mIHR3byBlbXB0eSBzdHJpbmdzLlxuICAgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIG5hbWUgY29udGFpbnMgdHdvIG9yIG1vcmUgJzonIHNlcGFyYXRvcnMuXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIGAnc29jaWFsOmNha2UnIC0+IFsnc29jaWFsJywgJ2Nha2UnXVxuICAgKiAgICdwZW5ndWluJyAtPiBbJycsICdwZW5ndWluJ11cbiAgICogICBudWxsIC0+IFsnJywgJyddXG4gICAqICAgJ2E6YjpjJyAtPiAodGhyb3dzIEVycm9yKWBcbiAgICovXG4gIHByaXZhdGUgX3NwbGl0SWNvbk5hbWUoaWNvbk5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICAgIGlmICghaWNvbk5hbWUpIHtcbiAgICAgIHJldHVybiBbJycsICcnXTtcbiAgICB9XG4gICAgY29uc3QgcGFydHMgPSBpY29uTmFtZS5zcGxpdCgnOicpO1xuICAgIHN3aXRjaCAocGFydHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBbJycsIHBhcnRzWzBdXTsgLy8gVXNlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgICAgY2FzZSAyOiByZXR1cm4gPFtzdHJpbmcsIHN0cmluZ10+cGFydHM7XG4gICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvcihgSW52YWxpZCBpY29uIG5hbWU6IFwiJHtpY29uTmFtZX1cImApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAvLyBPbmx5IHVwZGF0ZSB0aGUgaW5saW5lIFNWRyBpY29uIGlmIHRoZSBpbnB1dHMgY2hhbmdlZCwgdG8gYXZvaWQgdW5uZWNlc3NhcnkgRE9NIG9wZXJhdGlvbnMuXG4gICAgY29uc3Qgc3ZnSWNvbkNoYW5nZXMgPSBjaGFuZ2VzWydzdmdJY29uJ107XG5cbiAgICBpZiAoc3ZnSWNvbkNoYW5nZXMpIHtcbiAgICAgIGlmICh0aGlzLnN2Z0ljb24pIHtcbiAgICAgICAgY29uc3QgW25hbWVzcGFjZSwgaWNvbk5hbWVdID0gdGhpcy5fc3BsaXRJY29uTmFtZSh0aGlzLnN2Z0ljb24pO1xuXG4gICAgICAgIHRoaXMuX2ljb25SZWdpc3RyeS5nZXROYW1lZFN2Z0ljb24oaWNvbk5hbWUsIG5hbWVzcGFjZSlcbiAgICAgICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHN2ZyA9PiB0aGlzLl9zZXRTdmdFbGVtZW50KHN2ZyksIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBFcnJvciByZXRyaWV2aW5nIGljb24gJHtuYW1lc3BhY2V9OiR7aWNvbk5hbWV9ISAke2Vyci5tZXNzYWdlfWA7XG4gICAgICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgX2Vycm9ySGFuZGxlciBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX2Vycm9ySGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlci5oYW5kbGVFcnJvcihuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoc3ZnSWNvbkNoYW5nZXMucHJldmlvdXNWYWx1ZSkge1xuICAgICAgICB0aGlzLl9jbGVhclN2Z0VsZW1lbnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fdXNpbmdGb250SWNvbigpKSB7XG4gICAgICB0aGlzLl91cGRhdGVGb250SWNvbkNsYXNzZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBVcGRhdGUgZm9udCBjbGFzc2VzIGJlY2F1c2UgbmdPbkNoYW5nZXMgd29uJ3QgYmUgY2FsbGVkIGlmIG5vbmUgb2YgdGhlIGlucHV0cyBhcmUgcHJlc2VudCxcbiAgICAvLyBlLmcuIDxtYXQtaWNvbj5hcnJvdzwvbWF0LWljb24+IEluIHRoaXMgY2FzZSB3ZSBuZWVkIHRvIGFkZCBhIENTUyBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgZm9udC5cbiAgICBpZiAodGhpcy5fdXNpbmdGb250SWNvbigpKSB7XG4gICAgICB0aGlzLl91cGRhdGVGb250SWNvbkNsYXNzZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgY29uc3QgY2FjaGVkRWxlbWVudHMgPSB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXM7XG5cbiAgICBpZiAoY2FjaGVkRWxlbWVudHMgJiYgdGhpcy5fbG9jYXRpb24gJiYgY2FjaGVkRWxlbWVudHMuc2l6ZSkge1xuICAgICAgY29uc3QgbmV3UGF0aCA9IHRoaXMuX2xvY2F0aW9uLmdldFBhdGhuYW1lKCk7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciB0aGUgVVJMIGhhcyBjaGFuZ2VkIG9uIGVhY2ggY2hhbmdlIGRldGVjdGlvbiBzaW5jZVxuICAgICAgLy8gdGhlIGJyb3dzZXIgZG9lc24ndCBoYXZlIGFuIEFQSSB0aGF0IHdpbGwgbGV0IHVzIHJlYWN0IG9uIGxpbmsgY2xpY2tzIGFuZFxuICAgICAgLy8gd2UgY2FuJ3QgZGVwZW5kIG9uIHRoZSBBbmd1bGFyIHJvdXRlci4gVGhlIHJlZmVyZW5jZXMgbmVlZCB0byBiZSB1cGRhdGVkLFxuICAgICAgLy8gYmVjYXVzZSB3aGlsZSBtb3N0IGJyb3dzZXJzIGRvbid0IGNhcmUgd2hldGhlciB0aGUgVVJMIGlzIGNvcnJlY3QgYWZ0ZXJcbiAgICAgIC8vIHRoZSBmaXJzdCByZW5kZXIsIFNhZmFyaSB3aWxsIGJyZWFrIGlmIHRoZSB1c2VyIG5hdmlnYXRlcyB0byBhIGRpZmZlcmVudFxuICAgICAgLy8gcGFnZSBhbmQgdGhlIFNWRyBpc24ndCByZS1yZW5kZXJlZC5cbiAgICAgIGlmIChuZXdQYXRoICE9PSB0aGlzLl9wcmV2aW91c1BhdGgpIHtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNQYXRoID0gbmV3UGF0aDtcbiAgICAgICAgdGhpcy5fcHJlcGVuZFBhdGhUb1JlZmVyZW5jZXMobmV3UGF0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcykge1xuICAgICAgdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzLmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXNpbmdGb250SWNvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuc3ZnSWNvbjtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFN2Z0VsZW1lbnQoc3ZnOiBTVkdFbGVtZW50KSB7XG4gICAgdGhpcy5fY2xlYXJTdmdFbGVtZW50KCk7XG5cbiAgICAvLyBXb3JrYXJvdW5kIGZvciBJRTExIGFuZCBFZGdlIGlnbm9yaW5nIGBzdHlsZWAgdGFncyBpbnNpZGUgZHluYW1pY2FsbHktY3JlYXRlZCBTVkdzLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvMTA4OTg0NjkvXG4gICAgLy8gRG8gdGhpcyBiZWZvcmUgaW5zZXJ0aW5nIHRoZSBlbGVtZW50IGludG8gdGhlIERPTSwgaW4gb3JkZXIgdG8gYXZvaWQgYSBzdHlsZSByZWNhbGN1bGF0aW9uLlxuICAgIGNvbnN0IHN0eWxlVGFncyA9IHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpIGFzIE5vZGVMaXN0T2Y8SFRNTFN0eWxlRWxlbWVudD47XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0eWxlVGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgc3R5bGVUYWdzW2ldLnRleHRDb250ZW50ICs9ICcgJztcbiAgICB9XG5cbiAgICAvLyBOb3RlOiB3ZSBkbyB0aGlzIGZpeCBoZXJlLCByYXRoZXIgdGhhbiB0aGUgaWNvbiByZWdpc3RyeSwgYmVjYXVzZSB0aGVcbiAgICAvLyByZWZlcmVuY2VzIGhhdmUgdG8gcG9pbnQgdG8gdGhlIFVSTCBhdCB0aGUgdGltZSB0aGF0IHRoZSBpY29uIHdhcyBjcmVhdGVkLlxuICAgIGlmICh0aGlzLl9sb2NhdGlvbikge1xuICAgICAgY29uc3QgcGF0aCA9IHRoaXMuX2xvY2F0aW9uLmdldFBhdGhuYW1lKCk7XG4gICAgICB0aGlzLl9wcmV2aW91c1BhdGggPSBwYXRoO1xuICAgICAgdGhpcy5fY2FjaGVDaGlsZHJlbldpdGhFeHRlcm5hbFJlZmVyZW5jZXMoc3ZnKTtcbiAgICAgIHRoaXMuX3ByZXBlbmRQYXRoVG9SZWZlcmVuY2VzKHBhdGgpO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChzdmcpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYXJTdmdFbGVtZW50KCkge1xuICAgIGNvbnN0IGxheW91dEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGxldCBjaGlsZENvdW50ID0gbGF5b3V0RWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcy5jbGVhcigpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBleGlzdGluZyBub24tZWxlbWVudCBjaGlsZCBub2RlcyBhbmQgU1ZHcywgYW5kIGFkZCB0aGUgbmV3IFNWRyBlbGVtZW50LiBOb3RlIHRoYXRcbiAgICAvLyB3ZSBjYW4ndCB1c2UgaW5uZXJIVE1MLCBiZWNhdXNlIElFIHdpbGwgdGhyb3cgaWYgdGhlIGVsZW1lbnQgaGFzIGEgZGF0YSBiaW5kaW5nLlxuICAgIHdoaWxlIChjaGlsZENvdW50LS0pIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gbGF5b3V0RWxlbWVudC5jaGlsZE5vZGVzW2NoaWxkQ291bnRdO1xuXG4gICAgICAvLyAxIGNvcnJlc3BvbmRzIHRvIE5vZGUuRUxFTUVOVF9OT0RFLiBXZSByZW1vdmUgYWxsIG5vbi1lbGVtZW50IG5vZGVzIGluIG9yZGVyIHRvIGdldCByaWRcbiAgICAgIC8vIG9mIGFueSBsb29zZSB0ZXh0IG5vZGVzLCBhcyB3ZWxsIGFzIGFueSBTVkcgZWxlbWVudHMgaW4gb3JkZXIgdG8gcmVtb3ZlIGFueSBvbGQgaWNvbnMuXG4gICAgICBpZiAoY2hpbGQubm9kZVR5cGUgIT09IDEgfHwgY2hpbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2ZycpIHtcbiAgICAgICAgbGF5b3V0RWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlRm9udEljb25DbGFzc2VzKCkge1xuICAgIGlmICghdGhpcy5fdXNpbmdGb250SWNvbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbTogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZm9udFNldENsYXNzID0gdGhpcy5mb250U2V0ID9cbiAgICAgICAgdGhpcy5faWNvblJlZ2lzdHJ5LmNsYXNzTmFtZUZvckZvbnRBbGlhcyh0aGlzLmZvbnRTZXQpIDpcbiAgICAgICAgdGhpcy5faWNvblJlZ2lzdHJ5LmdldERlZmF1bHRGb250U2V0Q2xhc3MoKTtcblxuICAgIGlmIChmb250U2V0Q2xhc3MgIT0gdGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MpIHtcbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0ZvbnRTZXRDbGFzcykge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGZvbnRTZXRDbGFzcykge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoZm9udFNldENsYXNzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzID0gZm9udFNldENsYXNzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvbnRJY29uICE9IHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcykge1xuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcykge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fcHJldmlvdXNGb250SWNvbkNsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZvbnRJY29uKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLmZvbnRJY29uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcyA9IHRoaXMuZm9udEljb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFucyB1cCBhIHZhbHVlIHRvIGJlIHVzZWQgYXMgYSBmb250SWNvbiBvciBmb250U2V0LlxuICAgKiBTaW5jZSB0aGUgdmFsdWUgZW5kcyB1cCBiZWluZyBhc3NpZ25lZCBhcyBhIENTUyBjbGFzcywgd2VcbiAgICogaGF2ZSB0byB0cmltIHRoZSB2YWx1ZSBhbmQgb21pdCBzcGFjZS1zZXBhcmF0ZWQgdmFsdWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2xlYW51cEZvbnRWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZS50cmltKCkuc3BsaXQoJyAnKVswXSA6IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBlbmRzIHRoZSBjdXJyZW50IHBhdGggdG8gYWxsIGVsZW1lbnRzIHRoYXQgaGF2ZSBhbiBhdHRyaWJ1dGUgcG9pbnRpbmcgdG8gYSBgRnVuY0lSSWBcbiAgICogcmVmZXJlbmNlLiBUaGlzIGlzIHJlcXVpcmVkIGJlY2F1c2UgV2ViS2l0IGJyb3dzZXJzIHJlcXVpcmUgcmVmZXJlbmNlcyB0byBiZSBwcmVmaXhlZCB3aXRoXG4gICAqIHRoZSBjdXJyZW50IHBhdGgsIGlmIHRoZSBwYWdlIGhhcyBhIGBiYXNlYCB0YWcuXG4gICAqL1xuICBwcml2YXRlIF9wcmVwZW5kUGF0aFRvUmVmZXJlbmNlcyhwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcztcblxuICAgIGlmIChlbGVtZW50cykge1xuICAgICAgZWxlbWVudHMuZm9yRWFjaCgoYXR0cnMsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgYXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGB1cmwoJyR7cGF0aH0jJHthdHRyLnZhbHVlfScpYCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlcyB0aGUgY2hpbGRyZW4gb2YgYW4gU1ZHIGVsZW1lbnQgdGhhdCBoYXZlIGB1cmwoKWBcbiAgICogcmVmZXJlbmNlcyB0aGF0IHdlIG5lZWQgdG8gcHJlZml4IHdpdGggdGhlIGN1cnJlbnQgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX2NhY2hlQ2hpbGRyZW5XaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKGVsZW1lbnQ6IFNWR0VsZW1lbnQpIHtcbiAgICBjb25zdCBlbGVtZW50c1dpdGhGdW5jSXJpID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGZ1bmNJcmlBdHRyaWJ1dGVTZWxlY3Rvcik7XG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMgPVxuICAgICAgICB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMgfHwgbmV3IE1hcCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50c1dpdGhGdW5jSXJpLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmdW5jSXJpQXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50V2l0aFJlZmVyZW5jZSA9IGVsZW1lbnRzV2l0aEZ1bmNJcmlbaV07XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudFdpdGhSZWZlcmVuY2UuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBjb25zdCBtYXRjaCA9IHZhbHVlID8gdmFsdWUubWF0Y2goZnVuY0lyaVBhdHRlcm4pIDogbnVsbDtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGVsZW1lbnRzLmdldChlbGVtZW50V2l0aFJlZmVyZW5jZSk7XG5cbiAgICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIGVsZW1lbnRzLnNldChlbGVtZW50V2l0aFJlZmVyZW5jZSwgYXR0cmlidXRlcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXR0cmlidXRlcyEucHVzaCh7bmFtZTogYXR0ciwgdmFsdWU6IG1hdGNoWzFdfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pbmxpbmU6IGJvb2xlYW4gfCBzdHJpbmc7XG59XG4iXX0=