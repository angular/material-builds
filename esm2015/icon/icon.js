/**
 * @fileoverview added by tsickle
 * Generated from: src/material/icon/icon.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFJTCxRQUFRLEVBRVIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBeUIsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7QUFLaEQsTUFBTSxXQUFXOzs7O0lBQ2YsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0NBQy9DOzs7SUFEYSxrQ0FBOEI7OztNQUV0QyxpQkFBaUIsR0FBc0MsVUFBVSxDQUFDLFdBQVcsQ0FBQzs7Ozs7OztBQU9wRixNQUFNLE9BQU8saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQWtCLG1CQUFtQixFQUFFO0lBQ3hGLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSx5QkFBeUI7Q0FDbkMsQ0FBQzs7Ozs7O0FBTUYscUNBRUM7OztJQURDLHNDQUEwQjs7Ozs7O0FBSTVCLE1BQU0sVUFBVSx5QkFBeUI7O1VBQ2pDLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDOztVQUM1QixTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMs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SUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztpQkFDakQ7WUFDSCxDQUFDLEVBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7O1lBMVNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFLFNBQVM7Z0JBRW5CLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDakIsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRSxLQUFLO29CQUNiLE9BQU8sRUFBRSxzQkFBc0I7b0JBQy9CLHlCQUF5QixFQUFFLFFBQVE7b0JBQ25DLDJCQUEyQixFQUFFLCtEQUErRDtpQkFDN0Y7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OztZQXhIQyxVQUFVO1lBZ0JKLGVBQWU7eUNBdUpoQixTQUFTLFNBQUMsYUFBYTs0Q0FLdkIsUUFBUSxZQUFJLE1BQU0sU0FBQyxpQkFBaUI7WUEzS3pDLFlBQVksdUJBNktQLFFBQVE7OztxQkE5Q1osS0FBSztzQkFVTCxLQUFLO3NCQUdMLEtBQUs7dUJBUUwsS0FBSzs7OztJQWlRTixpQ0FBOEM7Ozs7O0lBL1E5QywwQkFBaUM7Ozs7O0lBR2pDLDBCQUF5Qjs7Ozs7SUFRekIsMkJBQXlCOzs7OztJQVF6Qiw0QkFBMEI7Ozs7O0lBRTFCLHdDQUFzQzs7Ozs7SUFDdEMseUNBQXVDOzs7Ozs7SUFHdkMsZ0NBQStCOzs7Ozs7SUFHL0Isa0RBQXdGOzs7OztJQUcvQyxnQ0FBc0M7Ozs7Ozs7SUFNM0UsNEJBQTBFOzs7OztJQUUxRSxnQ0FBeUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdDaGVja2VkLFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEVycm9ySGFuZGxlcixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuQ29sb3IsIENhbkNvbG9yQ3RvciwgbWl4aW5Db2xvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNYXRJY29uUmVnaXN0cnl9IGZyb20gJy4vaWNvbi1yZWdpc3RyeSc7XG5cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRJY29uLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdEljb25CYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuY29uc3QgX01hdEljb25NaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIHR5cGVvZiBNYXRJY29uQmFzZSA9IG1peGluQ29sb3IoTWF0SWNvbkJhc2UpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB1c2VkIHRvIHByb3ZpZGUgdGhlIGN1cnJlbnQgbG9jYXRpb24gdG8gYE1hdEljb25gLlxuICogVXNlZCB0byBoYW5kbGUgc2VydmVyLXNpZGUgcmVuZGVyaW5nIGFuZCB0byBzdHViIG91dCBkdXJpbmcgdW5pdCB0ZXN0cy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9JQ09OX0xPQ0FUSU9OID0gbmV3IEluamVjdGlvblRva2VuPE1hdEljb25Mb2NhdGlvbj4oJ21hdC1pY29uLWxvY2F0aW9uJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6IE1BVF9JQ09OX0xPQ0FUSU9OX0ZBQ1RPUllcbn0pO1xuXG4vKipcbiAqIFN0dWJiZWQgb3V0IGxvY2F0aW9uIGZvciBgTWF0SWNvbmAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0SWNvbkxvY2F0aW9uIHtcbiAgZ2V0UGF0aG5hbWU6ICgpID0+IHN0cmluZztcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfSUNPTl9MT0NBVElPTl9GQUNUT1JZKCk6IE1hdEljb25Mb2NhdGlvbiB7XG4gIGNvbnN0IF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG4gIGNvbnN0IF9sb2NhdGlvbiA9IF9kb2N1bWVudCA/IF9kb2N1bWVudC5sb2NhdGlvbiA6IG51bGw7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBuZWVkcyB0byBiZSBhIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiBhIHByb3BlcnR5LCBiZWNhdXNlIEFuZ3VsYXJcbiAgICAvLyB3aWxsIG9ubHkgcmVzb2x2ZSBpdCBvbmNlLCBidXQgd2Ugd2FudCB0aGUgY3VycmVudCBwYXRoIG9uIGVhY2ggY2FsbC5cbiAgICBnZXRQYXRobmFtZTogKCkgPT4gX2xvY2F0aW9uID8gKF9sb2NhdGlvbi5wYXRobmFtZSArIF9sb2NhdGlvbi5zZWFyY2gpIDogJydcbiAgfTtcbn1cblxuXG4vKiogU1ZHIGF0dHJpYnV0ZXMgdGhhdCBhY2NlcHQgYSBGdW5jSVJJIChlLmcuIGB1cmwoPHNvbWV0aGluZz4pYCkuICovXG5jb25zdCBmdW5jSXJpQXR0cmlidXRlcyA9IFtcbiAgJ2NsaXAtcGF0aCcsXG4gICdjb2xvci1wcm9maWxlJyxcbiAgJ3NyYycsXG4gICdjdXJzb3InLFxuICAnZmlsbCcsXG4gICdmaWx0ZXInLFxuICAnbWFya2VyJyxcbiAgJ21hcmtlci1zdGFydCcsXG4gICdtYXJrZXItbWlkJyxcbiAgJ21hcmtlci1lbmQnLFxuICAnbWFzaycsXG4gICdzdHJva2UnXG5dO1xuXG4vKiogU2VsZWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byBmaW5kIGFsbCBlbGVtZW50cyB0aGF0IGFyZSB1c2luZyBhIGBGdW5jSVJJYC4gKi9cbmNvbnN0IGZ1bmNJcmlBdHRyaWJ1dGVTZWxlY3RvciA9IGZ1bmNJcmlBdHRyaWJ1dGVzLm1hcChhdHRyID0+IGBbJHthdHRyfV1gKS5qb2luKCcsICcpO1xuXG4vKiogUmVnZXggdGhhdCBjYW4gYmUgdXNlZCB0byBleHRyYWN0IHRoZSBpZCBvdXQgb2YgYSBGdW5jSVJJLiAqL1xuY29uc3QgZnVuY0lyaVBhdHRlcm4gPSAvXnVybFxcKFsnXCJdPyMoLio/KVsnXCJdP1xcKSQvO1xuXG4vKipcbiAqIENvbXBvbmVudCB0byBkaXNwbGF5IGFuIGljb24uIEl0IGNhbiBiZSB1c2VkIGluIHRoZSBmb2xsb3dpbmcgd2F5czpcbiAqXG4gKiAtIFNwZWNpZnkgdGhlIHN2Z0ljb24gaW5wdXQgdG8gbG9hZCBhbiBTVkcgaWNvbiBmcm9tIGEgVVJMIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIHRoZVxuICogICBhZGRTdmdJY29uLCBhZGRTdmdJY29uSW5OYW1lc3BhY2UsIGFkZFN2Z0ljb25TZXQsIG9yIGFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZSBtZXRob2RzIG9mXG4gKiAgIE1hdEljb25SZWdpc3RyeS4gSWYgdGhlIHN2Z0ljb24gdmFsdWUgY29udGFpbnMgYSBjb2xvbiBpdCBpcyBhc3N1bWVkIHRvIGJlIGluIHRoZSBmb3JtYXRcbiAqICAgXCJbbmFtZXNwYWNlXTpbbmFtZV1cIiwgaWYgbm90IHRoZSB2YWx1ZSB3aWxsIGJlIHRoZSBuYW1lIG9mIGFuIGljb24gaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICogICBFeGFtcGxlczpcbiAqICAgICBgPG1hdC1pY29uIHN2Z0ljb249XCJsZWZ0LWFycm93XCI+PC9tYXQtaWNvbj5cbiAqICAgICA8bWF0LWljb24gc3ZnSWNvbj1cImFuaW1hbHM6Y2F0XCI+PC9tYXQtaWNvbj5gXG4gKlxuICogLSBVc2UgYSBmb250IGxpZ2F0dXJlIGFzIGFuIGljb24gYnkgcHV0dGluZyB0aGUgbGlnYXR1cmUgdGV4dCBpbiB0aGUgY29udGVudCBvZiB0aGUgYDxtYXQtaWNvbj5gXG4gKiAgIGNvbXBvbmVudC4gQnkgZGVmYXVsdCB0aGUgTWF0ZXJpYWwgaWNvbnMgZm9udCBpcyB1c2VkIGFzIGRlc2NyaWJlZCBhdFxuICogICBodHRwOi8vZ29vZ2xlLmdpdGh1Yi5pby9tYXRlcmlhbC1kZXNpZ24taWNvbnMvI2ljb24tZm9udC1mb3ItdGhlLXdlYi4gWW91IGNhbiBzcGVjaWZ5IGFuXG4gKiAgIGFsdGVybmF0ZSBmb250IGJ5IHNldHRpbmcgdGhlIGZvbnRTZXQgaW5wdXQgdG8gZWl0aGVyIHRoZSBDU1MgY2xhc3MgdG8gYXBwbHkgdG8gdXNlIHRoZVxuICogICBkZXNpcmVkIGZvbnQsIG9yIHRvIGFuIGFsaWFzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIE1hdEljb25SZWdpc3RyeS5yZWdpc3RlckZvbnRDbGFzc0FsaWFzLlxuICogICBFeGFtcGxlczpcbiAqICAgICBgPG1hdC1pY29uPmhvbWU8L21hdC1pY29uPlxuICogICAgIDxtYXQtaWNvbiBmb250U2V0PVwibXlmb250XCI+c3VuPC9tYXQtaWNvbj5gXG4gKlxuICogLSBTcGVjaWZ5IGEgZm9udCBnbHlwaCB0byBiZSBpbmNsdWRlZCB2aWEgQ1NTIHJ1bGVzIGJ5IHNldHRpbmcgdGhlIGZvbnRTZXQgaW5wdXQgdG8gc3BlY2lmeSB0aGVcbiAqICAgZm9udCwgYW5kIHRoZSBmb250SWNvbiBpbnB1dCB0byBzcGVjaWZ5IHRoZSBpY29uLiBUeXBpY2FsbHkgdGhlIGZvbnRJY29uIHdpbGwgc3BlY2lmeSBhXG4gKiAgIENTUyBjbGFzcyB3aGljaCBjYXVzZXMgdGhlIGdseXBoIHRvIGJlIGRpc3BsYXllZCB2aWEgYSA6YmVmb3JlIHNlbGVjdG9yLCBhcyBpblxuICogICBodHRwczovL2ZvcnRhd2Vzb21lLmdpdGh1Yi5pby9Gb250LUF3ZXNvbWUvZXhhbXBsZXMvXG4gKiAgIEV4YW1wbGU6XG4gKiAgICAgYDxtYXQtaWNvbiBmb250U2V0PVwiZmFcIiBmb250SWNvbj1cImFsYXJtXCI+PC9tYXQtaWNvbj5gXG4gKi9cbkBDb21wb25lbnQoe1xuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBzZWxlY3RvcjogJ21hdC1pY29uJyxcbiAgZXhwb3J0QXM6ICdtYXRJY29uJyxcbiAgc3R5bGVVcmxzOiBbJ2ljb24uY3NzJ10sXG4gIGlucHV0czogWydjb2xvciddLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnaW1nJyxcbiAgICAnY2xhc3MnOiAnbWF0LWljb24gbm90cmFuc2xhdGUnLFxuICAgICdbY2xhc3MubWF0LWljb24taW5saW5lXSc6ICdpbmxpbmUnLFxuICAgICdbY2xhc3MubWF0LWljb24tbm8tY29sb3JdJzogJ2NvbG9yICE9PSBcInByaW1hcnlcIiAmJiBjb2xvciAhPT0gXCJhY2NlbnRcIiAmJiBjb2xvciAhPT0gXCJ3YXJuXCInLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SWNvbiBleHRlbmRzIF9NYXRJY29uTWl4aW5CYXNlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0NoZWNrZWQsXG4gIENhbkNvbG9yLCBPbkRlc3Ryb3kge1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpY29uIHNob3VsZCBiZSBpbmxpbmVkLCBhdXRvbWF0aWNhbGx5IHNpemluZyB0aGUgaWNvbiB0byBtYXRjaCB0aGUgZm9udCBzaXplIG9mXG4gICAqIHRoZSBlbGVtZW50IHRoZSBpY29uIGlzIGNvbnRhaW5lZCBpbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBpbmxpbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lubGluZTtcbiAgfVxuICBzZXQgaW5saW5lKGlubGluZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2lubGluZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShpbmxpbmUpO1xuICB9XG4gIHByaXZhdGUgX2lubGluZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBOYW1lIG9mIHRoZSBpY29uIGluIHRoZSBTVkcgaWNvbiBzZXQuICovXG4gIEBJbnB1dCgpIHN2Z0ljb246IHN0cmluZztcblxuICAvKiogRm9udCBzZXQgdGhhdCB0aGUgaWNvbiBpcyBhIHBhcnQgb2YuICovXG4gIEBJbnB1dCgpXG4gIGdldCBmb250U2V0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9mb250U2V0OyB9XG4gIHNldCBmb250U2V0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9mb250U2V0ID0gdGhpcy5fY2xlYW51cEZvbnRWYWx1ZSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZm9udFNldDogc3RyaW5nO1xuXG4gIC8qKiBOYW1lIG9mIGFuIGljb24gd2l0aGluIGEgZm9udCBzZXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBmb250SWNvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZm9udEljb247IH1cbiAgc2V0IGZvbnRJY29uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9mb250SWNvbiA9IHRoaXMuX2NsZWFudXBGb250VmFsdWUodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ZvbnRJY29uOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfcHJldmlvdXNGb250U2V0Q2xhc3M6IHN0cmluZztcbiAgcHJpdmF0ZSBfcHJldmlvdXNGb250SWNvbkNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IHBhZ2UgcGF0aC4gKi9cbiAgcHJpdmF0ZSBfcHJldmlvdXNQYXRoPzogc3RyaW5nO1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgZWxlbWVudHMgYW5kIGF0dHJpYnV0ZXMgdGhhdCB3ZSd2ZSBwcmVmaXhlZCB3aXRoIHRoZSBjdXJyZW50IHBhdGguICovXG4gIHByaXZhdGUgX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcz86IE1hcDxFbGVtZW50LCB7bmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nfVtdPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9pY29uUmVnaXN0cnk6IE1hdEljb25SZWdpc3RyeSxcbiAgICAgIEBBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgYXJpYUhpZGRlbjogc3RyaW5nLFxuICAgICAgLyoqXG4gICAgICAgKiBAZGVwcmVjYXRlZCBgbG9jYXRpb25gIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgICAgICovXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9JQ09OX0xPQ0FUSU9OKSBwcml2YXRlIF9sb2NhdGlvbj86IE1hdEljb25Mb2NhdGlvbixcbiAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgX2Vycm9ySGFuZGxlciBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByZWFkb25seSBfZXJyb3JIYW5kbGVyPzogRXJyb3JIYW5kbGVyKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoYXMgbm90IGV4cGxpY2l0bHkgc2V0IGFyaWEtaGlkZGVuLCBtYXJrIHRoZSBpY29uIGFzIGhpZGRlbiwgYXMgdGhpcyBpc1xuICAgIC8vIHRoZSByaWdodCB0aGluZyB0byBkbyBmb3IgdGhlIG1ham9yaXR5IG9mIGljb24gdXNlLWNhc2VzLlxuICAgIGlmICghYXJpYUhpZGRlbikge1xuICAgICAgZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTcGxpdHMgYW4gc3ZnSWNvbiBiaW5kaW5nIHZhbHVlIGludG8gaXRzIGljb24gc2V0IGFuZCBpY29uIG5hbWUgY29tcG9uZW50cy5cbiAgICogUmV0dXJucyBhIDItZWxlbWVudCBhcnJheSBvZiBbKGljb24gc2V0KSwgKGljb24gbmFtZSldLlxuICAgKiBUaGUgc2VwYXJhdG9yIGZvciB0aGUgdHdvIGZpZWxkcyBpcyAnOicuIElmIHRoZXJlIGlzIG5vIHNlcGFyYXRvciwgYW4gZW1wdHlcbiAgICogc3RyaW5nIGlzIHJldHVybmVkIGZvciB0aGUgaWNvbiBzZXQgYW5kIHRoZSBlbnRpcmUgdmFsdWUgaXMgcmV0dXJuZWQgZm9yXG4gICAqIHRoZSBpY29uIG5hbWUuIElmIHRoZSBhcmd1bWVudCBpcyBmYWxzeSwgcmV0dXJucyBhbiBhcnJheSBvZiB0d28gZW1wdHkgc3RyaW5ncy5cbiAgICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBuYW1lIGNvbnRhaW5zIHR3byBvciBtb3JlICc6JyBzZXBhcmF0b3JzLlxuICAgKiBFeGFtcGxlczpcbiAgICogICBgJ3NvY2lhbDpjYWtlJyAtPiBbJ3NvY2lhbCcsICdjYWtlJ11cbiAgICogICAncGVuZ3VpbicgLT4gWycnLCAncGVuZ3VpbiddXG4gICAqICAgbnVsbCAtPiBbJycsICcnXVxuICAgKiAgICdhOmI6YycgLT4gKHRocm93cyBFcnJvcilgXG4gICAqL1xuICBwcml2YXRlIF9zcGxpdEljb25OYW1lKGljb25OYW1lOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICBpZiAoIWljb25OYW1lKSB7XG4gICAgICByZXR1cm4gWycnLCAnJ107XG4gICAgfVxuICAgIGNvbnN0IHBhcnRzID0gaWNvbk5hbWUuc3BsaXQoJzonKTtcbiAgICBzd2l0Y2ggKHBhcnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gWycnLCBwYXJ0c1swXV07IC8vIFVzZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICAgIGNhc2UgMjogcmV0dXJuIDxbc3RyaW5nLCBzdHJpbmddPnBhcnRzO1xuICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IoYEludmFsaWQgaWNvbiBuYW1lOiBcIiR7aWNvbk5hbWV9XCJgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgLy8gT25seSB1cGRhdGUgdGhlIGlubGluZSBTVkcgaWNvbiBpZiB0aGUgaW5wdXRzIGNoYW5nZWQsIHRvIGF2b2lkIHVubmVjZXNzYXJ5IERPTSBvcGVyYXRpb25zLlxuICAgIGNvbnN0IHN2Z0ljb25DaGFuZ2VzID0gY2hhbmdlc1snc3ZnSWNvbiddO1xuXG4gICAgaWYgKHN2Z0ljb25DaGFuZ2VzKSB7XG4gICAgICBpZiAodGhpcy5zdmdJY29uKSB7XG4gICAgICAgIGNvbnN0IFtuYW1lc3BhY2UsIGljb25OYW1lXSA9IHRoaXMuX3NwbGl0SWNvbk5hbWUodGhpcy5zdmdJY29uKTtcblxuICAgICAgICB0aGlzLl9pY29uUmVnaXN0cnkuZ2V0TmFtZWRTdmdJY29uKGljb25OYW1lLCBuYW1lc3BhY2UpXG4gICAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgICAgLnN1YnNjcmliZShzdmcgPT4gdGhpcy5fc2V0U3ZnRWxlbWVudChzdmcpLCAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgRXJyb3IgcmV0cmlldmluZyBpY29uICR7bmFtZXNwYWNlfToke2ljb25OYW1lfSEgJHtlcnIubWVzc2FnZX1gO1xuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIF9lcnJvckhhbmRsZXIgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl9lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IobmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHN2Z0ljb25DaGFuZ2VzLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5fY2xlYXJTdmdFbGVtZW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVXBkYXRlIGZvbnQgY2xhc3NlcyBiZWNhdXNlIG5nT25DaGFuZ2VzIHdvbid0IGJlIGNhbGxlZCBpZiBub25lIG9mIHRoZSBpbnB1dHMgYXJlIHByZXNlbnQsXG4gICAgLy8gZS5nLiA8bWF0LWljb24+YXJyb3c8L21hdC1pY29uPiBJbiB0aGlzIGNhc2Ugd2UgbmVlZCB0byBhZGQgYSBDU1MgY2xhc3MgZm9yIHRoZSBkZWZhdWx0IGZvbnQuXG4gICAgaWYgKHRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGNvbnN0IGNhY2hlZEVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzO1xuXG4gICAgaWYgKGNhY2hlZEVsZW1lbnRzICYmIHRoaXMuX2xvY2F0aW9uICYmIGNhY2hlZEVsZW1lbnRzLnNpemUpIHtcbiAgICAgIGNvbnN0IG5ld1BhdGggPSB0aGlzLl9sb2NhdGlvbi5nZXRQYXRobmFtZSgpO1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGhlIFVSTCBoYXMgY2hhbmdlZCBvbiBlYWNoIGNoYW5nZSBkZXRlY3Rpb24gc2luY2VcbiAgICAgIC8vIHRoZSBicm93c2VyIGRvZXNuJ3QgaGF2ZSBhbiBBUEkgdGhhdCB3aWxsIGxldCB1cyByZWFjdCBvbiBsaW5rIGNsaWNrcyBhbmRcbiAgICAgIC8vIHdlIGNhbid0IGRlcGVuZCBvbiB0aGUgQW5ndWxhciByb3V0ZXIuIFRoZSByZWZlcmVuY2VzIG5lZWQgdG8gYmUgdXBkYXRlZCxcbiAgICAgIC8vIGJlY2F1c2Ugd2hpbGUgbW9zdCBicm93c2VycyBkb24ndCBjYXJlIHdoZXRoZXIgdGhlIFVSTCBpcyBjb3JyZWN0IGFmdGVyXG4gICAgICAvLyB0aGUgZmlyc3QgcmVuZGVyLCBTYWZhcmkgd2lsbCBicmVhayBpZiB0aGUgdXNlciBuYXZpZ2F0ZXMgdG8gYSBkaWZmZXJlbnRcbiAgICAgIC8vIHBhZ2UgYW5kIHRoZSBTVkcgaXNuJ3QgcmUtcmVuZGVyZWQuXG4gICAgICBpZiAobmV3UGF0aCAhPT0gdGhpcy5fcHJldmlvdXNQYXRoKSB7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUGF0aCA9IG5ld1BhdGg7XG4gICAgICAgIHRoaXMuX3ByZXBlbmRQYXRoVG9SZWZlcmVuY2VzKG5ld1BhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcy5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VzaW5nRm9udEljb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnN2Z0ljb247XG4gIH1cblxuICBwcml2YXRlIF9zZXRTdmdFbGVtZW50KHN2ZzogU1ZHRWxlbWVudCkge1xuICAgIHRoaXMuX2NsZWFyU3ZnRWxlbWVudCgpO1xuXG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgSUUxMSBhbmQgRWRnZSBpZ25vcmluZyBgc3R5bGVgIHRhZ3MgaW5zaWRlIGR5bmFtaWNhbGx5LWNyZWF0ZWQgU1ZHcy5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEwODk4NDY5L1xuICAgIC8vIERvIHRoaXMgYmVmb3JlIGluc2VydGluZyB0aGUgZWxlbWVudCBpbnRvIHRoZSBET00sIGluIG9yZGVyIHRvIGF2b2lkIGEgc3R5bGUgcmVjYWxjdWxhdGlvbi5cbiAgICBjb25zdCBzdHlsZVRhZ3MgPSBzdmcucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSBhcyBOb2RlTGlzdE9mPEhUTUxTdHlsZUVsZW1lbnQ+O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHlsZVRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0eWxlVGFnc1tpXS50ZXh0Q29udGVudCArPSAnICc7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgZG8gdGhpcyBmaXggaGVyZSwgcmF0aGVyIHRoYW4gdGhlIGljb24gcmVnaXN0cnksIGJlY2F1c2UgdGhlXG4gICAgLy8gcmVmZXJlbmNlcyBoYXZlIHRvIHBvaW50IHRvIHRoZSBVUkwgYXQgdGhlIHRpbWUgdGhhdCB0aGUgaWNvbiB3YXMgY3JlYXRlZC5cbiAgICBpZiAodGhpcy5fbG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9sb2NhdGlvbi5nZXRQYXRobmFtZSgpO1xuICAgICAgdGhpcy5fcHJldmlvdXNQYXRoID0gcGF0aDtcbiAgICAgIHRoaXMuX2NhY2hlQ2hpbGRyZW5XaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKHN2Zyk7XG4gICAgICB0aGlzLl9wcmVwZW5kUGF0aFRvUmVmZXJlbmNlcyhwYXRoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFyU3ZnRWxlbWVudCgpIHtcbiAgICBjb25zdCBsYXlvdXRFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgY2hpbGRDb3VudCA9IGxheW91dEVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKSB7XG4gICAgICB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXhpc3Rpbmcgbm9uLWVsZW1lbnQgY2hpbGQgbm9kZXMgYW5kIFNWR3MsIGFuZCBhZGQgdGhlIG5ldyBTVkcgZWxlbWVudC4gTm90ZSB0aGF0XG4gICAgLy8gd2UgY2FuJ3QgdXNlIGlubmVySFRNTCwgYmVjYXVzZSBJRSB3aWxsIHRocm93IGlmIHRoZSBlbGVtZW50IGhhcyBhIGRhdGEgYmluZGluZy5cbiAgICB3aGlsZSAoY2hpbGRDb3VudC0tKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IGxheW91dEVsZW1lbnQuY2hpbGROb2Rlc1tjaGlsZENvdW50XTtcblxuICAgICAgLy8gMSBjb3JyZXNwb25kcyB0byBOb2RlLkVMRU1FTlRfTk9ERS4gV2UgcmVtb3ZlIGFsbCBub24tZWxlbWVudCBub2RlcyBpbiBvcmRlciB0byBnZXQgcmlkXG4gICAgICAvLyBvZiBhbnkgbG9vc2UgdGV4dCBub2RlcywgYXMgd2VsbCBhcyBhbnkgU1ZHIGVsZW1lbnRzIGluIG9yZGVyIHRvIHJlbW92ZSBhbnkgb2xkIGljb25zLlxuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9PSAxIHx8IGNoaWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdmcnKSB7XG4gICAgICAgIGxheW91dEVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUZvbnRJY29uQ2xhc3NlcygpIHtcbiAgICBpZiAoIXRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW06IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGZvbnRTZXRDbGFzcyA9IHRoaXMuZm9udFNldCA/XG4gICAgICAgIHRoaXMuX2ljb25SZWdpc3RyeS5jbGFzc05hbWVGb3JGb250QWxpYXModGhpcy5mb250U2V0KSA6XG4gICAgICAgIHRoaXMuX2ljb25SZWdpc3RyeS5nZXREZWZhdWx0Rm9udFNldENsYXNzKCk7XG5cbiAgICBpZiAoZm9udFNldENsYXNzICE9IHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzKSB7XG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChmb250U2V0Q2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGZvbnRTZXRDbGFzcyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcmV2aW91c0ZvbnRTZXRDbGFzcyA9IGZvbnRTZXRDbGFzcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb250SWNvbiAhPSB0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MpIHtcbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mb250SWNvbikge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQodGhpcy5mb250SWNvbik7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcmV2aW91c0ZvbnRJY29uQ2xhc3MgPSB0aGlzLmZvbnRJY29uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnMgdXAgYSB2YWx1ZSB0byBiZSB1c2VkIGFzIGEgZm9udEljb24gb3IgZm9udFNldC5cbiAgICogU2luY2UgdGhlIHZhbHVlIGVuZHMgdXAgYmVpbmcgYXNzaWduZWQgYXMgYSBDU1MgY2xhc3MsIHdlXG4gICAqIGhhdmUgdG8gdHJpbSB0aGUgdmFsdWUgYW5kIG9taXQgc3BhY2Utc2VwYXJhdGVkIHZhbHVlcy5cbiAgICovXG4gIHByaXZhdGUgX2NsZWFudXBGb250VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUudHJpbSgpLnNwbGl0KCcgJylbMF0gOiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVwZW5kcyB0aGUgY3VycmVudCBwYXRoIHRvIGFsbCBlbGVtZW50cyB0aGF0IGhhdmUgYW4gYXR0cmlidXRlIHBvaW50aW5nIHRvIGEgYEZ1bmNJUklgXG4gICAqIHJlZmVyZW5jZS4gVGhpcyBpcyByZXF1aXJlZCBiZWNhdXNlIFdlYktpdCBicm93c2VycyByZXF1aXJlIHJlZmVyZW5jZXMgdG8gYmUgcHJlZml4ZWQgd2l0aFxuICAgKiB0aGUgY3VycmVudCBwYXRoLCBpZiB0aGUgcGFnZSBoYXMgYSBgYmFzZWAgdGFnLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJlcGVuZFBhdGhUb1JlZmVyZW5jZXMocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXM7XG5cbiAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnRzLmZvckVhY2goKGF0dHJzLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGF0dHJzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBgdXJsKCcke3BhdGh9IyR7YXR0ci52YWx1ZX0nKWApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZXMgdGhlIGNoaWxkcmVuIG9mIGFuIFNWRyBlbGVtZW50IHRoYXQgaGF2ZSBgdXJsKClgXG4gICAqIHJlZmVyZW5jZXMgdGhhdCB3ZSBuZWVkIHRvIHByZWZpeCB3aXRoIHRoZSBjdXJyZW50IHBhdGguXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZUNoaWxkcmVuV2l0aEV4dGVybmFsUmVmZXJlbmNlcyhlbGVtZW50OiBTVkdFbGVtZW50KSB7XG4gICAgY29uc3QgZWxlbWVudHNXaXRoRnVuY0lyaSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChmdW5jSXJpQXR0cmlidXRlU2VsZWN0b3IpO1xuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzID1cbiAgICAgICAgdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzIHx8IG5ldyBNYXAoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHNXaXRoRnVuY0lyaS5sZW5ndGg7IGkrKykge1xuICAgICAgZnVuY0lyaUF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudFdpdGhSZWZlcmVuY2UgPSBlbGVtZW50c1dpdGhGdW5jSXJpW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnRXaXRoUmVmZXJlbmNlLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB2YWx1ZSA/IHZhbHVlLm1hdGNoKGZ1bmNJcmlQYXR0ZXJuKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBlbGVtZW50cy5nZXQoZWxlbWVudFdpdGhSZWZlcmVuY2UpO1xuXG4gICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICBlbGVtZW50cy5zZXQoZWxlbWVudFdpdGhSZWZlcmVuY2UsIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF0dHJpYnV0ZXMhLnB1c2goe25hbWU6IGF0dHIsIHZhbHVlOiBtYXRjaFsxXX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW5saW5lOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=