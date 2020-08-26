/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { Attribute, ChangeDetectionStrategy, Component, ElementRef, ErrorHandler, inject, Inject, InjectionToken, Input, ViewEncapsulation, } from '@angular/core';
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
export class MatIcon extends _MatIconMixinBase {
    constructor(elementRef, _iconRegistry, ariaHidden, _location, _errorHandler) {
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
            default: throw Error(`Invalid icon name: "${iconName}"`); // TODO: add an ngDevMode check
        }
    }
    ngOnChanges(changes) {
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        const svgIconChanges = changes['svgIcon'];
        this._svgNamespace = null;
        this._svgName = null;
        if (svgIconChanges) {
            this._currentIconFetch.unsubscribe();
            if (this.svgIcon) {
                const [namespace, iconName] = this._splitIconName(this.svgIcon);
                if (namespace) {
                    this._svgNamespace = namespace;
                }
                if (iconName) {
                    this._svgName = iconName;
                }
                this._currentIconFetch = this._iconRegistry.getNamedSvgIcon(iconName, namespace)
                    .pipe(take(1))
                    .subscribe(svg => this._setSvgElement(svg), (err) => {
                    const errorMessage = `Error retrieving icon ${namespace}:${iconName}! ${err.message}`;
                    this._errorHandler.handleError(new Error(errorMessage));
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
                    '[attr.data-mat-icon-type]': '_usingFontIcon() ? "font" : "svg"',
                    '[attr.data-mat-icon-name]': '_svgName || fontIcon',
                    '[attr.data-mat-icon-namespace]': '_svgNamespace || fontSet',
                    '[class.mat-icon-inline]': 'inline',
                    '[class.mat-icon-no-color]': 'color !== "primary" && color !== "accent" && color !== "warn"',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-icon{background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}\n"]
            },] }
];
MatIcon.ctorParameters = () => [
    { type: ElementRef },
    { type: MatIconRegistry },
    { type: String, decorators: [{ type: Attribute, args: ['aria-hidden',] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_ICON_LOCATION,] }] },
    { type: ErrorHandler }
];
MatIcon.propDecorators = {
    inline: [{ type: Input }],
    svgIcon: [{ type: Input }],
    fontSet: [{ type: Input }],
    fontIcon: [{ type: Input }]
};
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFLTCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QixVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHaEQsOENBQThDO0FBQzlDLG9CQUFvQjtBQUNwQixNQUFNLFdBQVc7SUFDZixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0M7QUFDRCxNQUFNLGlCQUFpQixHQUFzQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFckY7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLElBQUksY0FBYyxDQUFrQixtQkFBbUIsRUFBRTtJQUN4RixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUseUJBQXlCO0NBQ25DLENBQUMsQ0FBQztBQVVILG9CQUFvQjtBQUNwQixNQUFNLFVBQVUseUJBQXlCO0lBQ3ZDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FB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QzVELHlCQUF5QixFQUFFLFFBQVE7b0JBQ25DLDJCQUEyQixFQUFFLCtEQUErRDtpQkFDN0Y7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7O1lBM0hDLFVBQVU7WUFnQkosZUFBZTt5Q0FnS2hCLFNBQVMsU0FBQyxhQUFhOzRDQUN2QixNQUFNLFNBQUMsaUJBQWlCO1lBaEw3QixZQUFZOzs7cUJBa0lYLEtBQUs7c0JBVUwsS0FBSztzQkFHTCxLQUFLO3VCQVFMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdDaGVja2VkLFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEVycm9ySGFuZGxlcixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLCBtaXhpbkNvbG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01hdEljb25SZWdpc3RyeX0gZnJvbSAnLi9pY29uLXJlZ2lzdHJ5JztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEljb24uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0SWNvbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0SWNvbk1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdEljb25CYXNlID0gbWl4aW5Db2xvcihNYXRJY29uQmFzZSk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gcHJvdmlkZSB0aGUgY3VycmVudCBsb2NhdGlvbiB0byBgTWF0SWNvbmAuXG4gKiBVc2VkIHRvIGhhbmRsZSBzZXJ2ZXItc2lkZSByZW5kZXJpbmcgYW5kIHRvIHN0dWIgb3V0IGR1cmluZyB1bml0IHRlc3RzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0lDT05fTE9DQVRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0SWNvbkxvY2F0aW9uPignbWF0LWljb24tbG9jYXRpb24nLCB7XG4gIHByb3ZpZGVkSW46ICdyb290JyxcbiAgZmFjdG9yeTogTUFUX0lDT05fTE9DQVRJT05fRkFDVE9SWVxufSk7XG5cbi8qKlxuICogU3R1YmJlZCBvdXQgbG9jYXRpb24gZm9yIGBNYXRJY29uYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRJY29uTG9jYXRpb24ge1xuICBnZXRQYXRobmFtZTogKCkgPT4gc3RyaW5nO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9JQ09OX0xPQ0FUSU9OX0ZBQ1RPUlkoKTogTWF0SWNvbkxvY2F0aW9uIHtcbiAgY29uc3QgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgY29uc3QgX2xvY2F0aW9uID0gX2RvY3VtZW50ID8gX2RvY3VtZW50LmxvY2F0aW9uIDogbnVsbDtcblxuICByZXR1cm4ge1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIG5lZWRzIHRvIGJlIGEgZnVuY3Rpb24sIHJhdGhlciB0aGFuIGEgcHJvcGVydHksIGJlY2F1c2UgQW5ndWxhclxuICAgIC8vIHdpbGwgb25seSByZXNvbHZlIGl0IG9uY2UsIGJ1dCB3ZSB3YW50IHRoZSBjdXJyZW50IHBhdGggb24gZWFjaCBjYWxsLlxuICAgIGdldFBhdGhuYW1lOiAoKSA9PiBfbG9jYXRpb24gPyAoX2xvY2F0aW9uLnBhdGhuYW1lICsgX2xvY2F0aW9uLnNlYXJjaCkgOiAnJ1xuICB9O1xufVxuXG5cbi8qKiBTVkcgYXR0cmlidXRlcyB0aGF0IGFjY2VwdCBhIEZ1bmNJUkkgKGUuZy4gYHVybCg8c29tZXRoaW5nPilgKS4gKi9cbmNvbnN0IGZ1bmNJcmlBdHRyaWJ1dGVzID0gW1xuICAnY2xpcC1wYXRoJyxcbiAgJ2NvbG9yLXByb2ZpbGUnLFxuICAnc3JjJyxcbiAgJ2N1cnNvcicsXG4gICdmaWxsJyxcbiAgJ2ZpbHRlcicsXG4gICdtYXJrZXInLFxuICAnbWFya2VyLXN0YXJ0JyxcbiAgJ21hcmtlci1taWQnLFxuICAnbWFya2VyLWVuZCcsXG4gICdtYXNrJyxcbiAgJ3N0cm9rZSdcbl07XG5cbi8qKiBTZWxlY3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIGZpbmQgYWxsIGVsZW1lbnRzIHRoYXQgYXJlIHVzaW5nIGEgYEZ1bmNJUklgLiAqL1xuY29uc3QgZnVuY0lyaUF0dHJpYnV0ZVNlbGVjdG9yID0gZnVuY0lyaUF0dHJpYnV0ZXMubWFwKGF0dHIgPT4gYFske2F0dHJ9XWApLmpvaW4oJywgJyk7XG5cbi8qKiBSZWdleCB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4dHJhY3QgdGhlIGlkIG91dCBvZiBhIEZ1bmNJUkkuICovXG5jb25zdCBmdW5jSXJpUGF0dGVybiA9IC9edXJsXFwoWydcIl0/IyguKj8pWydcIl0/XFwpJC87XG5cbi8qKlxuICogQ29tcG9uZW50IHRvIGRpc3BsYXkgYW4gaWNvbi4gSXQgY2FuIGJlIHVzZWQgaW4gdGhlIGZvbGxvd2luZyB3YXlzOlxuICpcbiAqIC0gU3BlY2lmeSB0aGUgc3ZnSWNvbiBpbnB1dCB0byBsb2FkIGFuIFNWRyBpY29uIGZyb20gYSBVUkwgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlXG4gKiAgIGFkZFN2Z0ljb24sIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZSwgYWRkU3ZnSWNvblNldCwgb3IgYWRkU3ZnSWNvblNldEluTmFtZXNwYWNlIG1ldGhvZHMgb2ZcbiAqICAgTWF0SWNvblJlZ2lzdHJ5LiBJZiB0aGUgc3ZnSWNvbiB2YWx1ZSBjb250YWlucyBhIGNvbG9uIGl0IGlzIGFzc3VtZWQgdG8gYmUgaW4gdGhlIGZvcm1hdFxuICogICBcIltuYW1lc3BhY2VdOltuYW1lXVwiLCBpZiBub3QgdGhlIHZhbHVlIHdpbGwgYmUgdGhlIG5hbWUgb2YgYW4gaWNvbiBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24gc3ZnSWNvbj1cImxlZnQtYXJyb3dcIj48L21hdC1pY29uPlxuICogICAgIDxtYXQtaWNvbiBzdmdJY29uPVwiYW5pbWFsczpjYXRcIj48L21hdC1pY29uPmBcbiAqXG4gKiAtIFVzZSBhIGZvbnQgbGlnYXR1cmUgYXMgYW4gaWNvbiBieSBwdXR0aW5nIHRoZSBsaWdhdHVyZSB0ZXh0IGluIHRoZSBjb250ZW50IG9mIHRoZSBgPG1hdC1pY29uPmBcbiAqICAgY29tcG9uZW50LiBCeSBkZWZhdWx0IHRoZSBNYXRlcmlhbCBpY29ucyBmb250IGlzIHVzZWQgYXMgZGVzY3JpYmVkIGF0XG4gKiAgIGh0dHA6Ly9nb29nbGUuZ2l0aHViLmlvL21hdGVyaWFsLWRlc2lnbi1pY29ucy8jaWNvbi1mb250LWZvci10aGUtd2ViLiBZb3UgY2FuIHNwZWNpZnkgYW5cbiAqICAgYWx0ZXJuYXRlIGZvbnQgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBlaXRoZXIgdGhlIENTUyBjbGFzcyB0byBhcHBseSB0byB1c2UgdGhlXG4gKiAgIGRlc2lyZWQgZm9udCwgb3IgdG8gYW4gYWxpYXMgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggTWF0SWNvblJlZ2lzdHJ5LnJlZ2lzdGVyRm9udENsYXNzQWxpYXMuXG4gKiAgIEV4YW1wbGVzOlxuICogICAgIGA8bWF0LWljb24+aG9tZTwvbWF0LWljb24+XG4gKiAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJteWZvbnRcIj5zdW48L21hdC1pY29uPmBcbiAqXG4gKiAtIFNwZWNpZnkgYSBmb250IGdseXBoIHRvIGJlIGluY2x1ZGVkIHZpYSBDU1MgcnVsZXMgYnkgc2V0dGluZyB0aGUgZm9udFNldCBpbnB1dCB0byBzcGVjaWZ5IHRoZVxuICogICBmb250LCBhbmQgdGhlIGZvbnRJY29uIGlucHV0IHRvIHNwZWNpZnkgdGhlIGljb24uIFR5cGljYWxseSB0aGUgZm9udEljb24gd2lsbCBzcGVjaWZ5IGFcbiAqICAgQ1NTIGNsYXNzIHdoaWNoIGNhdXNlcyB0aGUgZ2x5cGggdG8gYmUgZGlzcGxheWVkIHZpYSBhIDpiZWZvcmUgc2VsZWN0b3IsIGFzIGluXG4gKiAgIGh0dHBzOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9leGFtcGxlcy9cbiAqICAgRXhhbXBsZTpcbiAqICAgICBgPG1hdC1pY29uIGZvbnRTZXQ9XCJmYVwiIGZvbnRJY29uPVwiYWxhcm1cIj48L21hdC1pY29uPmBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHNlbGVjdG9yOiAnbWF0LWljb24nLFxuICBleHBvcnRBczogJ21hdEljb24nLFxuICBzdHlsZVVybHM6IFsnaWNvbi5jc3MnXSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdpbWcnLFxuICAgICdjbGFzcyc6ICdtYXQtaWNvbiBub3RyYW5zbGF0ZScsXG4gICAgJ1thdHRyLmRhdGEtbWF0LWljb24tdHlwZV0nOiAnX3VzaW5nRm9udEljb24oKSA/IFwiZm9udFwiIDogXCJzdmdcIicsXG4gICAgJ1thdHRyLmRhdGEtbWF0LWljb24tbmFtZV0nOiAnX3N2Z05hbWUgfHwgZm9udEljb24nLFxuICAgICdbYXR0ci5kYXRhLW1hdC1pY29uLW5hbWVzcGFjZV0nOiAnX3N2Z05hbWVzcGFjZSB8fCBmb250U2V0JyxcbiAgICAnW2NsYXNzLm1hdC1pY29uLWlubGluZV0nOiAnaW5saW5lJyxcbiAgICAnW2NsYXNzLm1hdC1pY29uLW5vLWNvbG9yXSc6ICdjb2xvciAhPT0gXCJwcmltYXJ5XCIgJiYgY29sb3IgIT09IFwiYWNjZW50XCIgJiYgY29sb3IgIT09IFwid2FyblwiJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEljb24gZXh0ZW5kcyBfTWF0SWNvbk1peGluQmFzZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdDaGVja2VkLFxuICBDYW5Db2xvciwgT25EZXN0cm95IHtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaWNvbiBzaG91bGQgYmUgaW5saW5lZCwgYXV0b21hdGljYWxseSBzaXppbmcgdGhlIGljb24gdG8gbWF0Y2ggdGhlIGZvbnQgc2l6ZSBvZlxuICAgKiB0aGUgZWxlbWVudCB0aGUgaWNvbiBpcyBjb250YWluZWQgaW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaW5saW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pbmxpbmU7XG4gIH1cbiAgc2V0IGlubGluZShpbmxpbmU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbmxpbmUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkoaW5saW5lKTtcbiAgfVxuICBwcml2YXRlIF9pbmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogTmFtZSBvZiB0aGUgaWNvbiBpbiB0aGUgU1ZHIGljb24gc2V0LiAqL1xuICBASW5wdXQoKSBzdmdJY29uOiBzdHJpbmc7XG5cbiAgLyoqIEZvbnQgc2V0IHRoYXQgdGhlIGljb24gaXMgYSBwYXJ0IG9mLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9udFNldCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZm9udFNldDsgfVxuICBzZXQgZm9udFNldCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fZm9udFNldCA9IHRoaXMuX2NsZWFudXBGb250VmFsdWUodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2ZvbnRTZXQ6IHN0cmluZztcblxuICAvKiogTmFtZSBvZiBhbiBpY29uIHdpdGhpbiBhIGZvbnQgc2V0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9udEljb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZvbnRJY29uOyB9XG4gIHNldCBmb250SWNvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fZm9udEljb24gPSB0aGlzLl9jbGVhbnVwRm9udFZhbHVlKHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9mb250SWNvbjogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3ByZXZpb3VzRm9udFNldENsYXNzOiBzdHJpbmc7XG4gIHByaXZhdGUgX3ByZXZpb3VzRm9udEljb25DbGFzczogc3RyaW5nO1xuXG4gIF9zdmdOYW1lOiBzdHJpbmcgfCBudWxsO1xuICBfc3ZnTmFtZXNwYWNlOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBwYWdlIHBhdGguICovXG4gIHByaXZhdGUgX3ByZXZpb3VzUGF0aD86IHN0cmluZztcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGVsZW1lbnRzIGFuZCBhdHRyaWJ1dGVzIHRoYXQgd2UndmUgcHJlZml4ZWQgd2l0aCB0aGUgY3VycmVudCBwYXRoLiAqL1xuICBwcml2YXRlIF9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXM/OiBNYXA8RWxlbWVudCwge25hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZ31bXT47XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0aGUgY3VycmVudCBpbi1wcm9ncmVzcyBTVkcgaWNvbiByZXF1ZXN0LiAqL1xuICBwcml2YXRlIF9jdXJyZW50SWNvbkZldGNoID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX2ljb25SZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LFxuICAgICAgQEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSBhcmlhSGlkZGVuOiBzdHJpbmcsXG4gICAgICBASW5qZWN0KE1BVF9JQ09OX0xPQ0FUSU9OKSBwcml2YXRlIF9sb2NhdGlvbjogTWF0SWNvbkxvY2F0aW9uLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBfZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBub3QgZXhwbGljaXRseSBzZXQgYXJpYS1oaWRkZW4sIG1hcmsgdGhlIGljb24gYXMgaGlkZGVuLCBhcyB0aGlzIGlzXG4gICAgLy8gdGhlIHJpZ2h0IHRoaW5nIHRvIGRvIGZvciB0aGUgbWFqb3JpdHkgb2YgaWNvbiB1c2UtY2FzZXMuXG4gICAgaWYgKCFhcmlhSGlkZGVuKSB7XG4gICAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0cyBhbiBzdmdJY29uIGJpbmRpbmcgdmFsdWUgaW50byBpdHMgaWNvbiBzZXQgYW5kIGljb24gbmFtZSBjb21wb25lbnRzLlxuICAgKiBSZXR1cm5zIGEgMi1lbGVtZW50IGFycmF5IG9mIFsoaWNvbiBzZXQpLCAoaWNvbiBuYW1lKV0uXG4gICAqIFRoZSBzZXBhcmF0b3IgZm9yIHRoZSB0d28gZmllbGRzIGlzICc6Jy4gSWYgdGhlcmUgaXMgbm8gc2VwYXJhdG9yLCBhbiBlbXB0eVxuICAgKiBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIHRoZSBpY29uIHNldCBhbmQgdGhlIGVudGlyZSB2YWx1ZSBpcyByZXR1cm5lZCBmb3JcbiAgICogdGhlIGljb24gbmFtZS4gSWYgdGhlIGFyZ3VtZW50IGlzIGZhbHN5LCByZXR1cm5zIGFuIGFycmF5IG9mIHR3byBlbXB0eSBzdHJpbmdzLlxuICAgKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIG5hbWUgY29udGFpbnMgdHdvIG9yIG1vcmUgJzonIHNlcGFyYXRvcnMuXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIGAnc29jaWFsOmNha2UnIC0+IFsnc29jaWFsJywgJ2Nha2UnXVxuICAgKiAgICdwZW5ndWluJyAtPiBbJycsICdwZW5ndWluJ11cbiAgICogICBudWxsIC0+IFsnJywgJyddXG4gICAqICAgJ2E6YjpjJyAtPiAodGhyb3dzIEVycm9yKWBcbiAgICovXG4gIHByaXZhdGUgX3NwbGl0SWNvbk5hbWUoaWNvbk5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICAgIGlmICghaWNvbk5hbWUpIHtcbiAgICAgIHJldHVybiBbJycsICcnXTtcbiAgICB9XG4gICAgY29uc3QgcGFydHMgPSBpY29uTmFtZS5zcGxpdCgnOicpO1xuICAgIHN3aXRjaCAocGFydHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBbJycsIHBhcnRzWzBdXTsgLy8gVXNlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgICAgY2FzZSAyOiByZXR1cm4gPFtzdHJpbmcsIHN0cmluZ10+cGFydHM7XG4gICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvcihgSW52YWxpZCBpY29uIG5hbWU6IFwiJHtpY29uTmFtZX1cImApOyAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBpbmxpbmUgU1ZHIGljb24gaWYgdGhlIGlucHV0cyBjaGFuZ2VkLCB0byBhdm9pZCB1bm5lY2Vzc2FyeSBET00gb3BlcmF0aW9ucy5cbiAgICBjb25zdCBzdmdJY29uQ2hhbmdlcyA9IGNoYW5nZXNbJ3N2Z0ljb24nXTtcblxuICAgIHRoaXMuX3N2Z05hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fc3ZnTmFtZSA9IG51bGw7XG5cbiAgICBpZiAoc3ZnSWNvbkNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRJY29uRmV0Y2gudW5zdWJzY3JpYmUoKTtcblxuICAgICAgaWYgKHRoaXMuc3ZnSWNvbikge1xuICAgICAgICBjb25zdCBbbmFtZXNwYWNlLCBpY29uTmFtZV0gPSB0aGlzLl9zcGxpdEljb25OYW1lKHRoaXMuc3ZnSWNvbik7XG5cbiAgICAgICAgaWYgKG5hbWVzcGFjZSkge1xuICAgICAgICAgIHRoaXMuX3N2Z05hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpY29uTmFtZSkge1xuICAgICAgICAgIHRoaXMuX3N2Z05hbWUgPSBpY29uTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJY29uRmV0Y2ggPSB0aGlzLl9pY29uUmVnaXN0cnkuZ2V0TmFtZWRTdmdJY29uKGljb25OYW1lLCBuYW1lc3BhY2UpXG4gICAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgICAgLnN1YnNjcmliZShzdmcgPT4gdGhpcy5fc2V0U3ZnRWxlbWVudChzdmcpLCAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgRXJyb3IgcmV0cmlldmluZyBpY29uICR7bmFtZXNwYWNlfToke2ljb25OYW1lfSEgJHtlcnIubWVzc2FnZX1gO1xuICAgICAgICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IobmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHN2Z0ljb25DaGFuZ2VzLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5fY2xlYXJTdmdFbGVtZW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVXBkYXRlIGZvbnQgY2xhc3NlcyBiZWNhdXNlIG5nT25DaGFuZ2VzIHdvbid0IGJlIGNhbGxlZCBpZiBub25lIG9mIHRoZSBpbnB1dHMgYXJlIHByZXNlbnQsXG4gICAgLy8gZS5nLiA8bWF0LWljb24+YXJyb3c8L21hdC1pY29uPiBJbiB0aGlzIGNhc2Ugd2UgbmVlZCB0byBhZGQgYSBDU1MgY2xhc3MgZm9yIHRoZSBkZWZhdWx0IGZvbnQuXG4gICAgaWYgKHRoaXMuX3VzaW5nRm9udEljb24oKSkge1xuICAgICAgdGhpcy5fdXBkYXRlRm9udEljb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGNvbnN0IGNhY2hlZEVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHNXaXRoRXh0ZXJuYWxSZWZlcmVuY2VzO1xuXG4gICAgaWYgKGNhY2hlZEVsZW1lbnRzICYmIGNhY2hlZEVsZW1lbnRzLnNpemUpIHtcbiAgICAgIGNvbnN0IG5ld1BhdGggPSB0aGlzLl9sb2NhdGlvbi5nZXRQYXRobmFtZSgpO1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGhlIFVSTCBoYXMgY2hhbmdlZCBvbiBlYWNoIGNoYW5nZSBkZXRlY3Rpb24gc2luY2VcbiAgICAgIC8vIHRoZSBicm93c2VyIGRvZXNuJ3QgaGF2ZSBhbiBBUEkgdGhhdCB3aWxsIGxldCB1cyByZWFjdCBvbiBsaW5rIGNsaWNrcyBhbmRcbiAgICAgIC8vIHdlIGNhbid0IGRlcGVuZCBvbiB0aGUgQW5ndWxhciByb3V0ZXIuIFRoZSByZWZlcmVuY2VzIG5lZWQgdG8gYmUgdXBkYXRlZCxcbiAgICAgIC8vIGJlY2F1c2Ugd2hpbGUgbW9zdCBicm93c2VycyBkb24ndCBjYXJlIHdoZXRoZXIgdGhlIFVSTCBpcyBjb3JyZWN0IGFmdGVyXG4gICAgICAvLyB0aGUgZmlyc3QgcmVuZGVyLCBTYWZhcmkgd2lsbCBicmVhayBpZiB0aGUgdXNlciBuYXZpZ2F0ZXMgdG8gYSBkaWZmZXJlbnRcbiAgICAgIC8vIHBhZ2UgYW5kIHRoZSBTVkcgaXNuJ3QgcmUtcmVuZGVyZWQuXG4gICAgICBpZiAobmV3UGF0aCAhPT0gdGhpcy5fcHJldmlvdXNQYXRoKSB7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUGF0aCA9IG5ld1BhdGg7XG4gICAgICAgIHRoaXMuX3ByZXBlbmRQYXRoVG9SZWZlcmVuY2VzKG5ld1BhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2N1cnJlbnRJY29uRmV0Y2gudW5zdWJzY3JpYmUoKTtcblxuICAgIGlmICh0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcy5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIF91c2luZ0ZvbnRJY29uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5zdmdJY29uO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0U3ZnRWxlbWVudChzdmc6IFNWR0VsZW1lbnQpIHtcbiAgICB0aGlzLl9jbGVhclN2Z0VsZW1lbnQoKTtcblxuICAgIC8vIFdvcmthcm91bmQgZm9yIElFMTEgYW5kIEVkZ2UgaWdub3JpbmcgYHN0eWxlYCB0YWdzIGluc2lkZSBkeW5hbWljYWxseS1jcmVhdGVkIFNWR3MuXG4gICAgLy8gU2VlOiBodHRwczovL2RldmVsb3Blci5taWNyb3NvZnQuY29tL2VuLXVzL21pY3Jvc29mdC1lZGdlL3BsYXRmb3JtL2lzc3Vlcy8xMDg5ODQ2OS9cbiAgICAvLyBEbyB0aGlzIGJlZm9yZSBpbnNlcnRpbmcgdGhlIGVsZW1lbnQgaW50byB0aGUgRE9NLCBpbiBvcmRlciB0byBhdm9pZCBhIHN0eWxlIHJlY2FsY3VsYXRpb24uXG4gICAgY29uc3Qgc3R5bGVUYWdzID0gc3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJykgYXMgTm9kZUxpc3RPZjxIVE1MU3R5bGVFbGVtZW50PjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R5bGVUYWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdHlsZVRhZ3NbaV0udGV4dENvbnRlbnQgKz0gJyAnO1xuICAgIH1cblxuICAgIC8vIE5vdGU6IHdlIGRvIHRoaXMgZml4IGhlcmUsIHJhdGhlciB0aGFuIHRoZSBpY29uIHJlZ2lzdHJ5LCBiZWNhdXNlIHRoZVxuICAgIC8vIHJlZmVyZW5jZXMgaGF2ZSB0byBwb2ludCB0byB0aGUgVVJMIGF0IHRoZSB0aW1lIHRoYXQgdGhlIGljb24gd2FzIGNyZWF0ZWQuXG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2xvY2F0aW9uLmdldFBhdGhuYW1lKCk7XG4gICAgdGhpcy5fcHJldmlvdXNQYXRoID0gcGF0aDtcbiAgICB0aGlzLl9jYWNoZUNoaWxkcmVuV2l0aEV4dGVybmFsUmVmZXJlbmNlcyhzdmcpO1xuICAgIHRoaXMuX3ByZXBlbmRQYXRoVG9SZWZlcmVuY2VzKHBhdGgpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChzdmcpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYXJTdmdFbGVtZW50KCkge1xuICAgIGNvbnN0IGxheW91dEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGxldCBjaGlsZENvdW50ID0gbGF5b3V0RWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcy5jbGVhcigpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBleGlzdGluZyBub24tZWxlbWVudCBjaGlsZCBub2RlcyBhbmQgU1ZHcywgYW5kIGFkZCB0aGUgbmV3IFNWRyBlbGVtZW50LiBOb3RlIHRoYXRcbiAgICAvLyB3ZSBjYW4ndCB1c2UgaW5uZXJIVE1MLCBiZWNhdXNlIElFIHdpbGwgdGhyb3cgaWYgdGhlIGVsZW1lbnQgaGFzIGEgZGF0YSBiaW5kaW5nLlxuICAgIHdoaWxlIChjaGlsZENvdW50LS0pIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gbGF5b3V0RWxlbWVudC5jaGlsZE5vZGVzW2NoaWxkQ291bnRdO1xuXG4gICAgICAvLyAxIGNvcnJlc3BvbmRzIHRvIE5vZGUuRUxFTUVOVF9OT0RFLiBXZSByZW1vdmUgYWxsIG5vbi1lbGVtZW50IG5vZGVzIGluIG9yZGVyIHRvIGdldCByaWRcbiAgICAgIC8vIG9mIGFueSBsb29zZSB0ZXh0IG5vZGVzLCBhcyB3ZWxsIGFzIGFueSBTVkcgZWxlbWVudHMgaW4gb3JkZXIgdG8gcmVtb3ZlIGFueSBvbGQgaWNvbnMuXG4gICAgICBpZiAoY2hpbGQubm9kZVR5cGUgIT09IDEgfHwgY2hpbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2ZycpIHtcbiAgICAgICAgbGF5b3V0RWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlRm9udEljb25DbGFzc2VzKCkge1xuICAgIGlmICghdGhpcy5fdXNpbmdGb250SWNvbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbTogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZm9udFNldENsYXNzID0gdGhpcy5mb250U2V0ID9cbiAgICAgICAgdGhpcy5faWNvblJlZ2lzdHJ5LmNsYXNzTmFtZUZvckZvbnRBbGlhcyh0aGlzLmZvbnRTZXQpIDpcbiAgICAgICAgdGhpcy5faWNvblJlZ2lzdHJ5LmdldERlZmF1bHRGb250U2V0Q2xhc3MoKTtcblxuICAgIGlmIChmb250U2V0Q2xhc3MgIT0gdGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MpIHtcbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0ZvbnRTZXRDbGFzcykge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fcHJldmlvdXNGb250U2V0Q2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGZvbnRTZXRDbGFzcykge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoZm9udFNldENsYXNzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3ByZXZpb3VzRm9udFNldENsYXNzID0gZm9udFNldENsYXNzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvbnRJY29uICE9IHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcykge1xuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcykge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fcHJldmlvdXNGb250SWNvbkNsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZvbnRJY29uKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLmZvbnRJY29uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3ByZXZpb3VzRm9udEljb25DbGFzcyA9IHRoaXMuZm9udEljb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFucyB1cCBhIHZhbHVlIHRvIGJlIHVzZWQgYXMgYSBmb250SWNvbiBvciBmb250U2V0LlxuICAgKiBTaW5jZSB0aGUgdmFsdWUgZW5kcyB1cCBiZWluZyBhc3NpZ25lZCBhcyBhIENTUyBjbGFzcywgd2VcbiAgICogaGF2ZSB0byB0cmltIHRoZSB2YWx1ZSBhbmQgb21pdCBzcGFjZS1zZXBhcmF0ZWQgdmFsdWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2xlYW51cEZvbnRWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZS50cmltKCkuc3BsaXQoJyAnKVswXSA6IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBlbmRzIHRoZSBjdXJyZW50IHBhdGggdG8gYWxsIGVsZW1lbnRzIHRoYXQgaGF2ZSBhbiBhdHRyaWJ1dGUgcG9pbnRpbmcgdG8gYSBgRnVuY0lSSWBcbiAgICogcmVmZXJlbmNlLiBUaGlzIGlzIHJlcXVpcmVkIGJlY2F1c2UgV2ViS2l0IGJyb3dzZXJzIHJlcXVpcmUgcmVmZXJlbmNlcyB0byBiZSBwcmVmaXhlZCB3aXRoXG4gICAqIHRoZSBjdXJyZW50IHBhdGgsIGlmIHRoZSBwYWdlIGhhcyBhIGBiYXNlYCB0YWcuXG4gICAqL1xuICBwcml2YXRlIF9wcmVwZW5kUGF0aFRvUmVmZXJlbmNlcyhwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzV2l0aEV4dGVybmFsUmVmZXJlbmNlcztcblxuICAgIGlmIChlbGVtZW50cykge1xuICAgICAgZWxlbWVudHMuZm9yRWFjaCgoYXR0cnMsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgYXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGB1cmwoJyR7cGF0aH0jJHthdHRyLnZhbHVlfScpYCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlcyB0aGUgY2hpbGRyZW4gb2YgYW4gU1ZHIGVsZW1lbnQgdGhhdCBoYXZlIGB1cmwoKWBcbiAgICogcmVmZXJlbmNlcyB0aGF0IHdlIG5lZWQgdG8gcHJlZml4IHdpdGggdGhlIGN1cnJlbnQgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgX2NhY2hlQ2hpbGRyZW5XaXRoRXh0ZXJuYWxSZWZlcmVuY2VzKGVsZW1lbnQ6IFNWR0VsZW1lbnQpIHtcbiAgICBjb25zdCBlbGVtZW50c1dpdGhGdW5jSXJpID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGZ1bmNJcmlBdHRyaWJ1dGVTZWxlY3Rvcik7XG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMgPVxuICAgICAgICB0aGlzLl9lbGVtZW50c1dpdGhFeHRlcm5hbFJlZmVyZW5jZXMgfHwgbmV3IE1hcCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50c1dpdGhGdW5jSXJpLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmdW5jSXJpQXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50V2l0aFJlZmVyZW5jZSA9IGVsZW1lbnRzV2l0aEZ1bmNJcmlbaV07XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudFdpdGhSZWZlcmVuY2UuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBjb25zdCBtYXRjaCA9IHZhbHVlID8gdmFsdWUubWF0Y2goZnVuY0lyaVBhdHRlcm4pIDogbnVsbDtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGVsZW1lbnRzLmdldChlbGVtZW50V2l0aFJlZmVyZW5jZSk7XG5cbiAgICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIGVsZW1lbnRzLnNldChlbGVtZW50V2l0aFJlZmVyZW5jZSwgYXR0cmlidXRlcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXR0cmlidXRlcyEucHVzaCh7bmFtZTogYXR0ciwgdmFsdWU6IG1hdGNoWzFdfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pbmxpbmU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==