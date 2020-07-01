/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Optional, SecurityContext, SkipSelf, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin, of as observableOf, throwError as observableThrow } from 'rxjs';
import { catchError, finalize, map, share, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
/**
 * Returns an exception to be thrown in the case when attempting to
 * load an icon with a name that cannot be found.
 * @docs-private
 */
export function getMatIconNameNotFoundError(iconName) {
    return Error(`Unable to find icon with the name "${iconName}"`);
}
/**
 * Returns an exception to be thrown when the consumer attempts to use
 * `<mat-icon>` without including @angular/common/http.
 * @docs-private
 */
export function getMatIconNoHttpProviderError() {
    return Error('Could not find HttpClient provider for use with Angular Material icons. ' +
        'Please include the HttpClientModule from @angular/common/http in your ' +
        'app imports.');
}
/**
 * Returns an exception to be thrown when a URL couldn't be sanitized.
 * @param url URL that was attempted to be sanitized.
 * @docs-private
 */
export function getMatIconFailedToSanitizeUrlError(url) {
    return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL ` +
        `via Angular's DomSanitizer. Attempted URL was "${url}".`);
}
/**
 * Returns an exception to be thrown when a HTML string couldn't be sanitized.
 * @param literal HTML that was attempted to be sanitized.
 * @docs-private
 */
export function getMatIconFailedToSanitizeLiteralError(literal) {
    return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by ` +
        `Angular's DomSanitizer. Attempted literal was "${literal}".`);
}
/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 * @docs-private
 */
class SvgIconConfig {
    constructor(data, options) {
        this.options = options;
        // Note that we can't use `instanceof SVGElement` here,
        // because it'll break during server-side rendering.
        if (!!data.nodeName) {
            this.svgElement = data;
        }
        else {
            this.url = data;
        }
    }
}
/**
 * Service to register and display icons used by the `<mat-icon>` component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
export class MatIconRegistry {
    constructor(_httpClient, _sanitizer, document, _errorHandler) {
        this._httpClient = _httpClient;
        this._sanitizer = _sanitizer;
        this._errorHandler = _errorHandler;
        /**
         * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
         */
        this._svgIconConfigs = new Map();
        /**
         * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
         * Multiple icon sets can be registered under the same namespace.
         */
        this._iconSetConfigs = new Map();
        /** Cache for icons loaded by direct URLs. */
        this._cachedIconsByUrl = new Map();
        /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
        this._inProgressUrlFetches = new Map();
        /** Map from font identifiers to their CSS class names. Used for icon fonts. */
        this._fontCssClassesByAlias = new Map();
        /**
         * The CSS class to apply when an `<mat-icon>` component has no icon name, url, or font specified.
         * The default 'material-icons' value assumes that the material icon font has been loaded as
         * described at http://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = 'material-icons';
        this._document = document;
    }
    /**
     * Registers an icon by URL in the default namespace.
     * @param iconName Name under which the icon should be registered.
     * @param url
     */
    addSvgIcon(iconName, url, options) {
        return this.addSvgIconInNamespace('', iconName, url, options);
    }
    /**
     * Registers an icon using an HTML string in the default namespace.
     * @param iconName Name under which the icon should be registered.
     * @param literal SVG source of the icon.
     */
    addSvgIconLiteral(iconName, literal, options) {
        return this.addSvgIconLiteralInNamespace('', iconName, literal, options);
    }
    /**
     * Registers an icon by URL in the specified namespace.
     * @param namespace Namespace in which the icon should be registered.
     * @param iconName Name under which the icon should be registered.
     * @param url
     */
    addSvgIconInNamespace(namespace, iconName, url, options) {
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(url, options));
    }
    /**
     * Registers an icon using an HTML string in the specified namespace.
     * @param namespace Namespace in which the icon should be registered.
     * @param iconName Name under which the icon should be registered.
     * @param literal SVG source of the icon.
     */
    addSvgIconLiteralInNamespace(namespace, iconName, literal, options) {
        const sanitizedLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        if (!sanitizedLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        const svgElement = this._createSvgElementForSingleIcon(sanitizedLiteral, options);
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(svgElement, options));
    }
    /**
     * Registers an icon set by URL in the default namespace.
     * @param url
     */
    addSvgIconSet(url, options) {
        return this.addSvgIconSetInNamespace('', url, options);
    }
    /**
     * Registers an icon set using an HTML string in the default namespace.
     * @param literal SVG source of the icon set.
     */
    addSvgIconSetLiteral(literal, options) {
        return this.addSvgIconSetLiteralInNamespace('', literal, options);
    }
    /**
     * Registers an icon set by URL in the specified namespace.
     * @param namespace Namespace in which to register the icon set.
     * @param url
     */
    addSvgIconSetInNamespace(namespace, url, options) {
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig(url, options));
    }
    /**
     * Registers an icon set using an HTML string in the specified namespace.
     * @param namespace Namespace in which to register the icon set.
     * @param literal SVG source of the icon set.
     */
    addSvgIconSetLiteralInNamespace(namespace, literal, options) {
        const sanitizedLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        if (!sanitizedLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        const svgElement = this._svgElementFromString(sanitizedLiteral);
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig(svgElement, options));
    }
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an matIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the `<mat-icon>` element.
     *
     * @param alias Alias for the font.
     * @param className Class name override to be used instead of the alias.
     */
    registerFontClassAlias(alias, className = alias) {
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    }
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     */
    classNameForFontAlias(alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    }
    /**
     * Sets the CSS class name to be used for icon fonts when an `<mat-icon>` component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     *
     * @param className
     */
    setDefaultFontSetClass(className) {
        this._defaultFontSetClass = className;
        return this;
    }
    /**
     * Returns the CSS class name to be used for icon fonts when an `<mat-icon>` component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    getDefaultFontSetClass() {
        return this._defaultFontSetClass;
    }
    /**
     * Returns an Observable that produces the icon (as an `<svg>` DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     *
     * @param safeUrl URL from which to fetch the SVG icon.
     */
    getSvgIconFromUrl(safeUrl) {
        const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMatIconFailedToSanitizeUrlError(safeUrl);
        }
        const cachedIcon = this._cachedIconsByUrl.get(url);
        if (cachedIcon) {
            return observableOf(cloneSvg(cachedIcon));
        }
        return this._loadSvgIconFromConfig(new SvgIconConfig(safeUrl)).pipe(tap(svg => this._cachedIconsByUrl.set(url, svg)), map(svg => cloneSvg(svg)));
    }
    /**
     * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an error.
     *
     * @param name Name of the icon to be retrieved.
     * @param namespace Namespace in which to look for the icon.
     */
    getNamedSvgIcon(name, namespace = '') {
        // Return (copy of) cached icon if possible.
        const key = iconKey(namespace, name);
        const config = this._svgIconConfigs.get(key);
        if (config) {
            return this._getSvgFromConfig(config);
        }
        // See if we have any icon sets registered for the namespace.
        const iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return observableThrow(getMatIconNameNotFoundError(key));
    }
    ngOnDestroy() {
        this._svgIconConfigs.clear();
        this._iconSetConfigs.clear();
        this._cachedIconsByUrl.clear();
    }
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     */
    _getSvgFromConfig(config) {
        if (config.svgElement) {
            // We already have the SVG element for this icon, return a copy.
            return observableOf(cloneSvg(config.svgElement));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return this._loadSvgIconFromConfig(config).pipe(tap(svg => config.svgElement = svg), map(svg => cloneSvg(svg)));
        }
    }
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new `<svg>` element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * an error if no icon with the specified name can be found.
     */
    _getSvgFromIconSetConfigs(name, iconSetConfigs) {
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        const namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return observableOf(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        const iconSetFetchRequests = iconSetConfigs
            .filter(iconSetConfig => !iconSetConfig.svgElement)
            .map(iconSetConfig => {
            return this._loadSvgIconSetFromConfig(iconSetConfig).pipe(catchError((err) => {
                const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, iconSetConfig.url);
                // Swallow errors fetching individual URLs so the
                // combined Observable won't necessarily fail.
                const errorMessage = `Loading icon set URL: ${url} failed: ${err.message}`;
                this._errorHandler.handleError(new Error(errorMessage));
                return observableOf(null);
            }));
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return forkJoin(iconSetFetchRequests).pipe(map(() => {
            const foundIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            if (!foundIcon) {
                throw getMatIconNameNotFoundError(name);
            }
            return foundIcon;
        }));
    }
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    _extractIconWithNameFromAnySet(iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (let i = iconSetConfigs.length - 1; i >= 0; i--) {
            const config = iconSetConfigs[i];
            if (config.svgElement) {
                const foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName, config.options);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    }
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    _loadSvgIconFromConfig(config) {
        return this._fetchIcon(config)
            .pipe(map(svgText => this._createSvgElementForSingleIcon(svgText, config.options)));
    }
    /**
     * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    _loadSvgIconSetFromConfig(config) {
        // If the SVG for this icon set has already been parsed, do nothing.
        if (config.svgElement) {
            return observableOf(config.svgElement);
        }
        return this._fetchIcon(config).pipe(map(svgText => {
            // It is possible that the icon set was parsed and cached by an earlier request, so parsing
            // only needs to occur if the cache is yet unset.
            if (!config.svgElement) {
                config.svgElement = this._svgElementFromString(svgText);
            }
            return config.svgElement;
        }));
    }
    /**
     * Creates a DOM element from the given SVG string, and adds default attributes.
     */
    _createSvgElementForSingleIcon(responseText, options) {
        const svg = this._svgElementFromString(responseText);
        this._setSvgAttributes(svg, options);
        return svg;
    }
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    _extractSvgIconFromSet(iconSet, iconName, options) {
        // Use the `id="iconName"` syntax in order to escape special
        // characters in the ID (versus using the #iconName syntax).
        const iconSource = iconSet.querySelector(`[id="${iconName}"]`);
        if (!iconSource) {
            return null;
        }
        // Clone the element and remove the ID to prevent multiple elements from being added
        // to the page with the same ID.
        const iconElement = iconSource.cloneNode(true);
        iconElement.removeAttribute('id');
        // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
        // the content of a new <svg> node.
        if (iconElement.nodeName.toLowerCase() === 'svg') {
            return this._setSvgAttributes(iconElement, options);
        }
        // If the node is a <symbol>, it won't be rendered so we have to convert it into <svg>. Note
        // that the same could be achieved by referring to it via <use href="#id">, however the <use>
        // tag is problematic on Firefox, because it needs to include the current page path.
        if (iconElement.nodeName.toLowerCase() === 'symbol') {
            return this._setSvgAttributes(this._toSvgElement(iconElement), options);
        }
        // createElement('SVG') doesn't work as expected; the DOM ends up with
        // the correct nodes, but the SVG content doesn't render. Instead we
        // have to create an empty SVG node using innerHTML and append its content.
        // Elements created using DOMParser.parseFromString have the same problem.
        // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
        const svg = this._svgElementFromString('<svg></svg>');
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconElement);
        return this._setSvgAttributes(svg, options);
    }
    /**
     * Creates a DOM element from the given SVG string.
     */
    _svgElementFromString(str) {
        const div = this._document.createElement('DIV');
        div.innerHTML = str;
        const svg = div.querySelector('svg');
        if (!svg) {
            throw Error('<svg> tag not found');
        }
        return svg;
    }
    /**
     * Converts an element into an SVG node by cloning all of its children.
     */
    _toSvgElement(element) {
        const svg = this._svgElementFromString('<svg></svg>');
        const attributes = element.attributes;
        // Copy over all the attributes from the `symbol` to the new SVG, except the id.
        for (let i = 0; i < attributes.length; i++) {
            const { name, value } = attributes[i];
            if (name !== 'id') {
                svg.setAttribute(name, value);
            }
        }
        for (let i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType === this._document.ELEMENT_NODE) {
                svg.appendChild(element.childNodes[i].cloneNode(true));
            }
        }
        return svg;
    }
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     */
    _setSvgAttributes(svg, options) {
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        if (options && options.viewBox) {
            svg.setAttribute('viewBox', options.viewBox);
        }
        return svg;
    }
    /**
     * Returns an Observable which produces the string contents of the given icon. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     */
    _fetchIcon(iconConfig) {
        var _a;
        const { url: safeUrl, options } = iconConfig;
        const withCredentials = (_a = options === null || options === void 0 ? void 0 : options.withCredentials) !== null && _a !== void 0 ? _a : false;
        if (!this._httpClient) {
            throw getMatIconNoHttpProviderError();
        }
        if (safeUrl == null) {
            throw Error(`Cannot fetch icon from URL "${safeUrl}".`);
        }
        const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMatIconFailedToSanitizeUrlError(safeUrl);
        }
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        const inProgressFetch = this._inProgressUrlFetches.get(url);
        if (inProgressFetch) {
            return inProgressFetch;
        }
        // TODO(jelbourn): for some reason, the `finalize` operator "loses" the generic type on the
        // Observable. Figure out why and fix it.
        const req = this._httpClient.get(url, { responseType: 'text', withCredentials }).pipe(finalize(() => this._inProgressUrlFetches.delete(url)), share());
        this._inProgressUrlFetches.set(url, req);
        return req;
    }
    /**
     * Registers an icon config by name in the specified namespace.
     * @param namespace Namespace in which to register the icon config.
     * @param iconName Name under which to register the config.
     * @param config Config to be registered.
     */
    _addSvgIconConfig(namespace, iconName, config) {
        this._svgIconConfigs.set(iconKey(namespace, iconName), config);
        return this;
    }
    /**
     * Registers an icon set config in the specified namespace.
     * @param namespace Namespace in which to register the icon config.
     * @param config Config to be registered.
     */
    _addSvgIconSetConfig(namespace, config) {
        const configNamespace = this._iconSetConfigs.get(namespace);
        if (configNamespace) {
            configNamespace.push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    }
}
MatIconRegistry.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatIconRegistry_Factory() { return new MatIconRegistry(i0.ɵɵinject(i1.HttpClient, 8), i0.ɵɵinject(i2.DomSanitizer), i0.ɵɵinject(i3.DOCUMENT, 8), i0.ɵɵinject(i0.ErrorHandler)); }, token: MatIconRegistry, providedIn: "root" });
MatIconRegistry.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
MatIconRegistry.ctorParameters = () => [
    { type: HttpClient, decorators: [{ type: Optional }] },
    { type: DomSanitizer },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: ErrorHandler }
];
/** @docs-private */
export function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, httpClient, sanitizer, errorHandler, document) {
    return parentRegistry || new MatIconRegistry(httpClient, sanitizer, document, errorHandler);
}
/** @docs-private */
export const ICON_REGISTRY_PROVIDER = {
    // If there is already an MatIconRegistry available, use that. Otherwise, provide a new one.
    provide: MatIconRegistry,
    deps: [
        [new Optional(), new SkipSelf(), MatIconRegistry],
        [new Optional(), HttpClient],
        DomSanitizer,
        ErrorHandler,
        [new Optional(), DOCUMENT],
    ],
    useFactory: ICON_REGISTRY_PROVIDER_FACTORY,
};
/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg) {
    return svg.cloneNode(true);
}
/** Returns the cache key to use for an icon namespace and name. */
function iconKey(namespace, name) {
    return namespace + ':' + name;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQW9CLE1BQU0sc0JBQXNCLENBQUM7QUFDbkUsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUVWLFFBQVEsRUFDUixlQUFlLEVBQ2YsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxZQUFZLEVBQTRCLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFFBQVEsRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0YsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFHckU7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSwyQkFBMkIsQ0FBQyxRQUFnQjtJQUMxRCxPQUFPLEtBQUssQ0FBQyxzQ0FBc0MsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBR0Q7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSw2QkFBNkI7SUFDM0MsT0FBTyxLQUFLLENBQUMsMEVBQTBFO1FBQzFFLHdFQUF3RTtRQUN4RSxjQUFjLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBR0Q7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxHQUFvQjtJQUNyRSxPQUFPLEtBQUssQ0FBQyx3RUFBd0U7UUFDeEUsa0RBQWtELEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxN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QixDQUM1QyxjQUErQixFQUMvQixVQUFzQixFQUN0QixTQUF1QixFQUN2QixZQUEwQixFQUMxQixRQUFjO0lBQ2QsT0FBTyxjQUFjLElBQUksSUFBSSxlQUFlLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRztJQUNwQyw0RkFBNEY7SUFDNUYsT0FBTyxFQUFFLGVBQWU7SUFDeEIsSUFBSSxFQUFFO1FBQ0osQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsZUFBZSxDQUFDO1FBQ2pELENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxVQUFVLENBQUM7UUFDNUIsWUFBWTtRQUNaLFlBQVk7UUFDWixDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsUUFBK0IsQ0FBQztLQUNsRDtJQUNELFVBQVUsRUFBRSw4QkFBOEI7Q0FDM0MsQ0FBQztBQUVGLDhEQUE4RDtBQUM5RCxTQUFTLFFBQVEsQ0FBQyxHQUFlO0lBQy9CLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQWUsQ0FBQztBQUMzQyxDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLFNBQVMsT0FBTyxDQUFDLFNBQWlCLEVBQUUsSUFBWTtJQUM5QyxPQUFPLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cEVycm9yUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7XG4gIEVycm9ySGFuZGxlcixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgT3B0aW9uYWwsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgU2tpcFNlbGYsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsLCBTYWZlSHRtbH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQge2ZvcmtKb2luLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93fSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZmluYWxpemUsIG1hcCwgc2hhcmUsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIGluIHRoZSBjYXNlIHdoZW4gYXR0ZW1wdGluZyB0b1xuICogbG9hZCBhbiBpY29uIHdpdGggYSBuYW1lIHRoYXQgY2Fubm90IGJlIGZvdW5kLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbk5hbWVOb3RGb3VuZEVycm9yKGljb25OYW1lOiBzdHJpbmcpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihgVW5hYmxlIHRvIGZpbmQgaWNvbiB3aXRoIHRoZSBuYW1lIFwiJHtpY29uTmFtZX1cImApO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gdGhlIGNvbnN1bWVyIGF0dGVtcHRzIHRvIHVzZVxuICogYDxtYXQtaWNvbj5gIHdpdGhvdXQgaW5jbHVkaW5nIEBhbmd1bGFyL2NvbW1vbi9odHRwLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbk5vSHR0cFByb3ZpZGVyRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIEh0dHBDbGllbnQgcHJvdmlkZXIgZm9yIHVzZSB3aXRoIEFuZ3VsYXIgTWF0ZXJpYWwgaWNvbnMuICcgK1xuICAgICAgICAgICAgICAgJ1BsZWFzZSBpbmNsdWRlIHRoZSBIdHRwQ2xpZW50TW9kdWxlIGZyb20gQGFuZ3VsYXIvY29tbW9uL2h0dHAgaW4geW91ciAnICtcbiAgICAgICAgICAgICAgICdhcHAgaW1wb3J0cy4nKTtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGEgVVJMIGNvdWxkbid0IGJlIHNhbml0aXplZC5cbiAqIEBwYXJhbSB1cmwgVVJMIHRoYXQgd2FzIGF0dGVtcHRlZCB0byBiZSBzYW5pdGl6ZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHVybDogU2FmZVJlc291cmNlVXJsKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYFRoZSBVUkwgcHJvdmlkZWQgdG8gTWF0SWNvblJlZ2lzdHJ5IHdhcyBub3QgdHJ1c3RlZCBhcyBhIHJlc291cmNlIFVSTCBgICtcbiAgICAgICAgICAgICAgIGB2aWEgQW5ndWxhcidzIERvbVNhbml0aXplci4gQXR0ZW1wdGVkIFVSTCB3YXMgXCIke3VybH1cIi5gKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gd2hlbiBhIEhUTUwgc3RyaW5nIGNvdWxkbid0IGJlIHNhbml0aXplZC5cbiAqIEBwYXJhbSBsaXRlcmFsIEhUTUwgdGhhdCB3YXMgYXR0ZW1wdGVkIHRvIGJlIHNhbml0aXplZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWw6IFNhZmVIdG1sKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYFRoZSBsaXRlcmFsIHByb3ZpZGVkIHRvIE1hdEljb25SZWdpc3RyeSB3YXMgbm90IHRydXN0ZWQgYXMgc2FmZSBIVE1MIGJ5IGAgK1xuICAgICAgICAgICAgICAgYEFuZ3VsYXIncyBEb21TYW5pdGl6ZXIuIEF0dGVtcHRlZCBsaXRlcmFsIHdhcyBcIiR7bGl0ZXJhbH1cIi5gKTtcbn1cblxuLyoqIE9wdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgaG93IGFuIGljb24gb3IgdGhlIGljb25zIGluIGFuIGljb24gc2V0IGFyZSBwcmVzZW50ZWQuICovXG5leHBvcnQgaW50ZXJmYWNlIEljb25PcHRpb25zIHtcbiAgLyoqIFZpZXcgYm94IHRvIHNldCBvbiB0aGUgaWNvbi4gKi9cbiAgdmlld0JveD86IHN0cmluZztcblxuICAvKiogV2hldGhlciBvciBub3QgdG8gZmV0Y2ggdGhlIGljb24gb3IgaWNvbiBzZXQgdXNpbmcgSFRUUCBjcmVkZW50aWFscy4gKi9cbiAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBhbiBpY29uLCBpbmNsdWRpbmcgdGhlIFVSTCBhbmQgcG9zc2libHkgdGhlIGNhY2hlZCBTVkcgZWxlbWVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY2xhc3MgU3ZnSWNvbkNvbmZpZyB7XG4gIHVybDogU2FmZVJlc291cmNlVXJsIHwgbnVsbDtcbiAgc3ZnRWxlbWVudDogU1ZHRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IodXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk7XG4gIGNvbnN0cnVjdG9yKHN2Z0VsZW1lbnQ6IFNWR0VsZW1lbnQsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk7XG4gIGNvbnN0cnVjdG9yKGRhdGE6IFNhZmVSZXNvdXJjZVVybCB8IFNWR0VsZW1lbnQsIHB1YmxpYyBvcHRpb25zPzogSWNvbk9wdGlvbnMpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgY2FuJ3QgdXNlIGBpbnN0YW5jZW9mIFNWR0VsZW1lbnRgIGhlcmUsXG4gICAgLy8gYmVjYXVzZSBpdCdsbCBicmVhayBkdXJpbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgIGlmICghIShkYXRhIGFzIGFueSkubm9kZU5hbWUpIHtcbiAgICAgIHRoaXMuc3ZnRWxlbWVudCA9IGRhdGEgYXMgU1ZHRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBkYXRhIGFzIFNhZmVSZXNvdXJjZVVybDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXJ2aWNlIHRvIHJlZ2lzdGVyIGFuZCBkaXNwbGF5IGljb25zIHVzZWQgYnkgdGhlIGA8bWF0LWljb24+YCBjb21wb25lbnQuXG4gKiAtIFJlZ2lzdGVycyBpY29uIFVSTHMgYnkgbmFtZXNwYWNlIGFuZCBuYW1lLlxuICogLSBSZWdpc3RlcnMgaWNvbiBzZXQgVVJMcyBieSBuYW1lc3BhY2UuXG4gKiAtIFJlZ2lzdGVycyBhbGlhc2VzIGZvciBDU1MgY2xhc3NlcywgZm9yIHVzZSB3aXRoIGljb24gZm9udHMuXG4gKiAtIExvYWRzIGljb25zIGZyb20gVVJMcyBhbmQgZXh0cmFjdHMgaW5kaXZpZHVhbCBpY29ucyBmcm9tIGljb24gc2V0cy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0SWNvblJlZ2lzdHJ5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBVUkxzIGFuZCBjYWNoZWQgU1ZHIGVsZW1lbnRzIGZvciBpbmRpdmlkdWFsIGljb25zLiBLZXlzIGFyZSBvZiB0aGUgZm9ybWF0IFwiW25hbWVzcGFjZV06W2ljb25dXCIuXG4gICAqL1xuICBwcml2YXRlIF9zdmdJY29uQ29uZmlncyA9IG5ldyBNYXA8c3RyaW5nLCBTdmdJY29uQ29uZmlnPigpO1xuXG4gIC8qKlxuICAgKiBTdmdJY29uQ29uZmlnIG9iamVjdHMgYW5kIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIGljb24gc2V0cywga2V5ZWQgYnkgbmFtZXNwYWNlLlxuICAgKiBNdWx0aXBsZSBpY29uIHNldHMgY2FuIGJlIHJlZ2lzdGVyZWQgdW5kZXIgdGhlIHNhbWUgbmFtZXNwYWNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaWNvblNldENvbmZpZ3MgPSBuZXcgTWFwPHN0cmluZywgU3ZnSWNvbkNvbmZpZ1tdPigpO1xuXG4gIC8qKiBDYWNoZSBmb3IgaWNvbnMgbG9hZGVkIGJ5IGRpcmVjdCBVUkxzLiAqL1xuICBwcml2YXRlIF9jYWNoZWRJY29uc0J5VXJsID0gbmV3IE1hcDxzdHJpbmcsIFNWR0VsZW1lbnQ+KCk7XG5cbiAgLyoqIEluLXByb2dyZXNzIGljb24gZmV0Y2hlcy4gVXNlZCB0byBjb2FsZXNjZSBtdWx0aXBsZSByZXF1ZXN0cyB0byB0aGUgc2FtZSBVUkwuICovXG4gIHByaXZhdGUgX2luUHJvZ3Jlc3NVcmxGZXRjaGVzID0gbmV3IE1hcDxzdHJpbmcsIE9ic2VydmFibGU8c3RyaW5nPj4oKTtcblxuICAvKiogTWFwIGZyb20gZm9udCBpZGVudGlmaWVycyB0byB0aGVpciBDU1MgY2xhc3MgbmFtZXMuIFVzZWQgZm9yIGljb24gZm9udHMuICovXG4gIHByaXZhdGUgX2ZvbnRDc3NDbGFzc2VzQnlBbGlhcyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBDU1MgY2xhc3MgdG8gYXBwbHkgd2hlbiBhbiBgPG1hdC1pY29uPmAgY29tcG9uZW50IGhhcyBubyBpY29uIG5hbWUsIHVybCwgb3IgZm9udCBzcGVjaWZpZWQuXG4gICAqIFRoZSBkZWZhdWx0ICdtYXRlcmlhbC1pY29ucycgdmFsdWUgYXNzdW1lcyB0aGF0IHRoZSBtYXRlcmlhbCBpY29uIGZvbnQgaGFzIGJlZW4gbG9hZGVkIGFzXG4gICAqIGRlc2NyaWJlZCBhdCBodHRwOi8vZ29vZ2xlLmdpdGh1Yi5pby9tYXRlcmlhbC1kZXNpZ24taWNvbnMvI2ljb24tZm9udC1mb3ItdGhlLXdlYlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVmYXVsdEZvbnRTZXRDbGFzcyA9ICdtYXRlcmlhbC1pY29ucyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIF9zYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2Vycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyKSB7XG4gICAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gYnkgVVJMIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb24oaWNvbk5hbWU6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25Jbk5hbWVzcGFjZSgnJywgaWNvbk5hbWUsIHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIGxpdGVyYWwgU1ZHIHNvdXJjZSBvZiB0aGUgaWNvbi5cbiAgICovXG4gIGFkZFN2Z0ljb25MaXRlcmFsKGljb25OYW1lOiBzdHJpbmcsIGxpdGVyYWw6IFNhZmVIdG1sLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uTGl0ZXJhbEluTmFtZXNwYWNlKCcnLCBpY29uTmFtZSwgbGl0ZXJhbCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gYnkgVVJMIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgaWNvbk5hbWU6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2UsIGljb25OYW1lLCBuZXcgU3ZnSWNvbkNvbmZpZyh1cmwsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uLlxuICAgKi9cbiAgYWRkU3ZnSWNvbkxpdGVyYWxJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgaWNvbk5hbWU6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgY29uc3Qgc2FuaXRpemVkTGl0ZXJhbCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgbGl0ZXJhbCk7XG5cbiAgICBpZiAoIXNhbml0aXplZExpdGVyYWwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHN2Z0VsZW1lbnQgPSB0aGlzLl9jcmVhdGVTdmdFbGVtZW50Rm9yU2luZ2xlSWNvbihzYW5pdGl6ZWRMaXRlcmFsLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2UsIGljb25OYW1lLCBuZXcgU3ZnSWNvbkNvbmZpZyhzdmdFbGVtZW50LCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGJ5IFVSTCBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXQodXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZSgnJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uIHNldC5cbiAgICovXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsKGxpdGVyYWw6IFNhZmVIdG1sLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uU2V0TGl0ZXJhbEluTmFtZXNwYWNlKCcnLCBsaXRlcmFsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgYnkgVVJMIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZSwgbmV3IFN2Z0ljb25Db25maWcodXJsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSBsaXRlcmFsIFNWRyBzb3VyY2Ugb2YgdGhlIGljb24gc2V0LlxuICAgKi9cbiAgYWRkU3ZnSWNvblNldExpdGVyYWxJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgY29uc3Qgc2FuaXRpemVkTGl0ZXJhbCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgbGl0ZXJhbCk7XG5cbiAgICBpZiAoIXNhbml0aXplZExpdGVyYWwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHN2Z0VsZW1lbnQgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZyhzYW5pdGl6ZWRMaXRlcmFsKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2UsIG5ldyBTdmdJY29uQ29uZmlnKHN2Z0VsZW1lbnQsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIGFsaWFzIGZvciBhIENTUyBjbGFzcyBuYW1lIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMuIENyZWF0aW5nIGFuIG1hdEljb25cbiAgICogY29tcG9uZW50IHdpdGggdGhlIGFsaWFzIGFzIHRoZSBmb250U2V0IGlucHV0IHdpbGwgY2F1c2UgdGhlIGNsYXNzIG5hbWUgdG8gYmUgYXBwbGllZFxuICAgKiB0byB0aGUgYDxtYXQtaWNvbj5gIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBhbGlhcyBBbGlhcyBmb3IgdGhlIGZvbnQuXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgQ2xhc3MgbmFtZSBvdmVycmlkZSB0byBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGFsaWFzLlxuICAgKi9cbiAgcmVnaXN0ZXJGb250Q2xhc3NBbGlhcyhhbGlhczogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZyA9IGFsaWFzKTogdGhpcyB7XG4gICAgdGhpcy5fZm9udENzc0NsYXNzZXNCeUFsaWFzLnNldChhbGlhcywgY2xhc3NOYW1lKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3MgbmFtZSBhc3NvY2lhdGVkIHdpdGggdGhlIGFsaWFzIGJ5IGEgcHJldmlvdXMgY2FsbCB0b1xuICAgKiByZWdpc3RlckZvbnRDbGFzc0FsaWFzLiBJZiBubyBDU1MgY2xhc3MgaGFzIGJlZW4gYXNzb2NpYXRlZCwgcmV0dXJucyB0aGUgYWxpYXMgdW5tb2RpZmllZC5cbiAgICovXG4gIGNsYXNzTmFtZUZvckZvbnRBbGlhcyhhbGlhczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZm9udENzc0NsYXNzZXNCeUFsaWFzLmdldChhbGlhcykgfHwgYWxpYXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgQ1NTIGNsYXNzIG5hbWUgdG8gYmUgdXNlZCBmb3IgaWNvbiBmb250cyB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgZG9lcyBub3RcbiAgICogaGF2ZSBhIGZvbnRTZXQgaW5wdXQgdmFsdWUsIGFuZCBpcyBub3QgbG9hZGluZyBhbiBpY29uIGJ5IG5hbWUgb3IgVVJMLlxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAqL1xuICBzZXREZWZhdWx0Rm9udFNldENsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy5fZGVmYXVsdEZvbnRTZXRDbGFzcyA9IGNsYXNzTmFtZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3MgbmFtZSB0byBiZSB1c2VkIGZvciBpY29uIGZvbnRzIHdoZW4gYW4gYDxtYXQtaWNvbj5gIGNvbXBvbmVudCBkb2VzIG5vdFxuICAgKiBoYXZlIGEgZm9udFNldCBpbnB1dCB2YWx1ZSwgYW5kIGlzIG5vdCBsb2FkaW5nIGFuIGljb24gYnkgbmFtZSBvciBVUkwuXG4gICAqL1xuICBnZXREZWZhdWx0Rm9udFNldENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRGb250U2V0Q2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgcHJvZHVjZXMgdGhlIGljb24gKGFzIGFuIGA8c3ZnPmAgRE9NIGVsZW1lbnQpIGZyb20gdGhlIGdpdmVuIFVSTC5cbiAgICogVGhlIHJlc3BvbnNlIGZyb20gdGhlIFVSTCBtYXkgYmUgY2FjaGVkIHNvIHRoaXMgd2lsbCBub3QgYWx3YXlzIGNhdXNlIGFuIEhUVFAgcmVxdWVzdCwgYnV0XG4gICAqIHRoZSBwcm9kdWNlZCBlbGVtZW50IHdpbGwgYWx3YXlzIGJlIGEgbmV3IGNvcHkgb2YgdGhlIG9yaWdpbmFsbHkgZmV0Y2hlZCBpY29uLiAoVGhhdCBpcyxcbiAgICogaXQgd2lsbCBub3QgY29udGFpbiBhbnkgbW9kaWZpY2F0aW9ucyBtYWRlIHRvIGVsZW1lbnRzIHByZXZpb3VzbHkgcmV0dXJuZWQpLlxuICAgKlxuICAgKiBAcGFyYW0gc2FmZVVybCBVUkwgZnJvbSB3aGljaCB0byBmZXRjaCB0aGUgU1ZHIGljb24uXG4gICAqL1xuICBnZXRTdmdJY29uRnJvbVVybChzYWZlVXJsOiBTYWZlUmVzb3VyY2VVcmwpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlJFU09VUkNFX1VSTCwgc2FmZVVybCk7XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVVcmxFcnJvcihzYWZlVXJsKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWNoZWRJY29uID0gdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5nZXQodXJsKTtcblxuICAgIGlmIChjYWNoZWRJY29uKSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGNsb25lU3ZnKGNhY2hlZEljb24pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25Gcm9tQ29uZmlnKG5ldyBTdmdJY29uQ29uZmlnKHNhZmVVcmwpKS5waXBlKFxuICAgICAgdGFwKHN2ZyA9PiB0aGlzLl9jYWNoZWRJY29uc0J5VXJsLnNldCh1cmwhLCBzdmcpKSxcbiAgICAgIG1hcChzdmcgPT4gY2xvbmVTdmcoc3ZnKSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBwcm9kdWNlcyB0aGUgaWNvbiAoYXMgYW4gYDxzdmc+YCBET00gZWxlbWVudCkgd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKiBhbmQgbmFtZXNwYWNlLiBUaGUgaWNvbiBtdXN0IGhhdmUgYmVlbiBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCBhZGRJY29uIG9yIGFkZEljb25TZXQ7XG4gICAqIGlmIG5vdCwgdGhlIE9ic2VydmFibGUgd2lsbCB0aHJvdyBhbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgaWNvbiB0byBiZSByZXRyaWV2ZWQuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRvIGxvb2sgZm9yIHRoZSBpY29uLlxuICAgKi9cbiAgZ2V0TmFtZWRTdmdJY29uKG5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcgPSAnJyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIC8vIFJldHVybiAoY29weSBvZikgY2FjaGVkIGljb24gaWYgcG9zc2libGUuXG4gICAgY29uc3Qga2V5ID0gaWNvbktleShuYW1lc3BhY2UsIG5hbWUpO1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX3N2Z0ljb25Db25maWdzLmdldChrZXkpO1xuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21Db25maWcoY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBTZWUgaWYgd2UgaGF2ZSBhbnkgaWNvbiBzZXRzIHJlZ2lzdGVyZWQgZm9yIHRoZSBuYW1lc3BhY2UuXG4gICAgY29uc3QgaWNvblNldENvbmZpZ3MgPSB0aGlzLl9pY29uU2V0Q29uZmlncy5nZXQobmFtZXNwYWNlKTtcblxuICAgIGlmIChpY29uU2V0Q29uZmlncykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21JY29uU2V0Q29uZmlncyhuYW1lLCBpY29uU2V0Q29uZmlncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUaHJvdyhnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3Ioa2V5KSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgIHRoaXMuX3N2Z0ljb25Db25maWdzLmNsZWFyKCk7XG4gICB0aGlzLl9pY29uU2V0Q29uZmlncy5jbGVhcigpO1xuICAgdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNhY2hlZCBpY29uIGZvciBhIFN2Z0ljb25Db25maWcgaWYgYXZhaWxhYmxlLCBvciBmZXRjaGVzIGl0IGZyb20gaXRzIFVSTCBpZiBub3QuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTdmdGcm9tQ29uZmlnKGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIGlmIChjb25maWcuc3ZnRWxlbWVudCkge1xuICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIHRoZSBTVkcgZWxlbWVudCBmb3IgdGhpcyBpY29uLCByZXR1cm4gYSBjb3B5LlxuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjbG9uZVN2Zyhjb25maWcuc3ZnRWxlbWVudCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGZXRjaCB0aGUgaWNvbiBmcm9tIHRoZSBjb25maWcncyBVUkwsIGNhY2hlIGl0LCBhbmQgcmV0dXJuIGEgY29weS5cbiAgICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvbkZyb21Db25maWcoY29uZmlnKS5waXBlKFxuICAgICAgICB0YXAoc3ZnID0+IGNvbmZpZy5zdmdFbGVtZW50ID0gc3ZnKSxcbiAgICAgICAgbWFwKHN2ZyA9PiBjbG9uZVN2ZyhzdmcpKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIGZpbmQgYW4gaWNvbiB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBpbiBhbnkgb2YgdGhlIFNWRyBpY29uIHNldHMuXG4gICAqIEZpcnN0IHNlYXJjaGVzIHRoZSBhdmFpbGFibGUgY2FjaGVkIGljb25zIGZvciBhIG5lc3RlZCBlbGVtZW50IHdpdGggYSBtYXRjaGluZyBuYW1lLCBhbmRcbiAgICogaWYgZm91bmQgY29waWVzIHRoZSBlbGVtZW50IHRvIGEgbmV3IGA8c3ZnPmAgZWxlbWVudC4gSWYgbm90IGZvdW5kLCBmZXRjaGVzIGFsbCBpY29uIHNldHNcbiAgICogdGhhdCBoYXZlIG5vdCBiZWVuIGNhY2hlZCwgYW5kIHNlYXJjaGVzIGFnYWluIGFmdGVyIGFsbCBmZXRjaGVzIGFyZSBjb21wbGV0ZWQuXG4gICAqIFRoZSByZXR1cm5lZCBPYnNlcnZhYmxlIHByb2R1Y2VzIHRoZSBTVkcgZWxlbWVudCBpZiBwb3NzaWJsZSwgYW5kIHRocm93c1xuICAgKiBhbiBlcnJvciBpZiBubyBpY29uIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGNhbiBiZSBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2dldFN2Z0Zyb21JY29uU2V0Q29uZmlncyhuYW1lOiBzdHJpbmcsIGljb25TZXRDb25maWdzOiBTdmdJY29uQ29uZmlnW10pOlxuICAgICAgT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgLy8gRm9yIGFsbCB0aGUgaWNvbiBzZXQgU1ZHIGVsZW1lbnRzIHdlJ3ZlIGZldGNoZWQsIHNlZSBpZiBhbnkgY29udGFpbiBhbiBpY29uIHdpdGggdGhlXG4gICAgLy8gcmVxdWVzdGVkIG5hbWUuXG4gICAgY29uc3QgbmFtZWRJY29uID0gdGhpcy5fZXh0cmFjdEljb25XaXRoTmFtZUZyb21BbnlTZXQobmFtZSwgaWNvblNldENvbmZpZ3MpO1xuXG4gICAgaWYgKG5hbWVkSWNvbikge1xuICAgICAgLy8gV2UgY291bGQgY2FjaGUgbmFtZWRJY29uIGluIF9zdmdJY29uQ29uZmlncywgYnV0IHNpbmNlIHdlIGhhdmUgdG8gbWFrZSBhIGNvcHkgZXZlcnlcbiAgICAgIC8vIHRpbWUgYW55d2F5LCB0aGVyZSdzIHByb2JhYmx5IG5vdCBtdWNoIGFkdmFudGFnZSBjb21wYXJlZCB0byBqdXN0IGFsd2F5cyBleHRyYWN0aW5nXG4gICAgICAvLyBpdCBmcm9tIHRoZSBpY29uIHNldC5cbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobmFtZWRJY29uKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgZm91bmQgaW4gYW55IGNhY2hlZCBpY29uIHNldHMuIElmIHRoZXJlIGFyZSBpY29uIHNldHMgd2l0aCBVUkxzIHRoYXQgd2UgaGF2ZW4ndFxuICAgIC8vIGZldGNoZWQsIGZldGNoIHRoZW0gbm93IGFuZCBsb29rIGZvciBpY29uTmFtZSBpbiB0aGUgcmVzdWx0cy5cbiAgICBjb25zdCBpY29uU2V0RmV0Y2hSZXF1ZXN0czogT2JzZXJ2YWJsZTxTVkdFbGVtZW50IHwgbnVsbD5bXSA9IGljb25TZXRDb25maWdzXG4gICAgICAuZmlsdGVyKGljb25TZXRDb25maWcgPT4gIWljb25TZXRDb25maWcuc3ZnRWxlbWVudClcbiAgICAgIC5tYXAoaWNvblNldENvbmZpZyA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvblNldEZyb21Db25maWcoaWNvblNldENvbmZpZykucGlwZShcbiAgICAgICAgICBjYXRjaEVycm9yKChlcnI6IEh0dHBFcnJvclJlc3BvbnNlKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50IHwgbnVsbD4gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIGljb25TZXRDb25maWcudXJsKTtcblxuICAgICAgICAgICAgLy8gU3dhbGxvdyBlcnJvcnMgZmV0Y2hpbmcgaW5kaXZpZHVhbCBVUkxzIHNvIHRoZVxuICAgICAgICAgICAgLy8gY29tYmluZWQgT2JzZXJ2YWJsZSB3b24ndCBuZWNlc3NhcmlseSBmYWlsLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYExvYWRpbmcgaWNvbiBzZXQgVVJMOiAke3VybH0gZmFpbGVkOiAke2Vyci5tZXNzYWdlfWA7XG4gICAgICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IobmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihudWxsKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAvLyBGZXRjaCBhbGwgdGhlIGljb24gc2V0IFVSTHMuIFdoZW4gdGhlIHJlcXVlc3RzIGNvbXBsZXRlLCBldmVyeSBJY29uU2V0IHNob3VsZCBoYXZlIGFcbiAgICAvLyBjYWNoZWQgU1ZHIGVsZW1lbnQgKHVubGVzcyB0aGUgcmVxdWVzdCBmYWlsZWQpLCBhbmQgd2UgY2FuIGNoZWNrIGFnYWluIGZvciB0aGUgaWNvbi5cbiAgICByZXR1cm4gZm9ya0pvaW4oaWNvblNldEZldGNoUmVxdWVzdHMpLnBpcGUobWFwKCgpID0+IHtcbiAgICAgIGNvbnN0IGZvdW5kSWNvbiA9IHRoaXMuX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KG5hbWUsIGljb25TZXRDb25maWdzKTtcblxuICAgICAgaWYgKCFmb3VuZEljb24pIHtcbiAgICAgICAgdGhyb3cgZ2V0TWF0SWNvbk5hbWVOb3RGb3VuZEVycm9yKG5hbWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm91bmRJY29uO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyB0aGUgY2FjaGVkIFNWRyBlbGVtZW50cyBmb3IgdGhlIGdpdmVuIGljb24gc2V0cyBmb3IgYSBuZXN0ZWQgaWNvbiBlbGVtZW50IHdob3NlIFwiaWRcIlxuICAgKiB0YWcgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIG5hbWUuIElmIGZvdW5kLCBjb3BpZXMgdGhlIG5lc3RlZCBlbGVtZW50IHRvIGEgbmV3IFNWRyBlbGVtZW50IGFuZFxuICAgKiByZXR1cm5zIGl0LiBSZXR1cm5zIG51bGwgaWYgbm8gbWF0Y2hpbmcgZWxlbWVudCBpcyBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KGljb25OYW1lOiBzdHJpbmcsIGljb25TZXRDb25maWdzOiBTdmdJY29uQ29uZmlnW10pOlxuICAgICAgU1ZHRWxlbWVudCB8IG51bGwge1xuICAgIC8vIEl0ZXJhdGUgYmFja3dhcmRzLCBzbyBpY29uIHNldHMgYWRkZWQgbGF0ZXIgaGF2ZSBwcmVjZWRlbmNlLlxuICAgIGZvciAobGV0IGkgPSBpY29uU2V0Q29uZmlncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY29uZmlnID0gaWNvblNldENvbmZpZ3NbaV07XG4gICAgICBpZiAoY29uZmlnLnN2Z0VsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgZm91bmRJY29uID0gdGhpcy5fZXh0cmFjdFN2Z0ljb25Gcm9tU2V0KGNvbmZpZy5zdmdFbGVtZW50LCBpY29uTmFtZSwgY29uZmlnLm9wdGlvbnMpO1xuICAgICAgICBpZiAoZm91bmRJY29uKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kSWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgY29udGVudCBvZiB0aGUgaWNvbiBVUkwgc3BlY2lmaWVkIGluIHRoZSBTdmdJY29uQ29uZmlnIGFuZCBjcmVhdGVzIGFuIFNWRyBlbGVtZW50XG4gICAqIGZyb20gaXQuXG4gICAqL1xuICBwcml2YXRlIF9sb2FkU3ZnSWNvbkZyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZldGNoSWNvbihjb25maWcpXG4gICAgICAgIC5waXBlKG1hcChzdmdUZXh0ID0+IHRoaXMuX2NyZWF0ZVN2Z0VsZW1lbnRGb3JTaW5nbGVJY29uKHN2Z1RleHQsIGNvbmZpZy5vcHRpb25zKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjb250ZW50IG9mIHRoZSBpY29uIHNldCBVUkwgc3BlY2lmaWVkIGluIHRoZSBTdmdJY29uQ29uZmlnIGFuZCBjcmVhdGVzIGFuIFNWRyBlbGVtZW50XG4gICAqIGZyb20gaXQuXG4gICAqL1xuICBwcml2YXRlIF9sb2FkU3ZnSWNvblNldEZyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgLy8gSWYgdGhlIFNWRyBmb3IgdGhpcyBpY29uIHNldCBoYXMgYWxyZWFkeSBiZWVuIHBhcnNlZCwgZG8gbm90aGluZy5cbiAgICBpZiAoY29uZmlnLnN2Z0VsZW1lbnQpIHtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoY29uZmlnLnN2Z0VsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9mZXRjaEljb24oY29uZmlnKS5waXBlKG1hcChzdmdUZXh0ID0+IHtcbiAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGljb24gc2V0IHdhcyBwYXJzZWQgYW5kIGNhY2hlZCBieSBhbiBlYXJsaWVyIHJlcXVlc3QsIHNvIHBhcnNpbmdcbiAgICAgIC8vIG9ubHkgbmVlZHMgdG8gb2NjdXIgaWYgdGhlIGNhY2hlIGlzIHlldCB1bnNldC5cbiAgICAgIGlmICghY29uZmlnLnN2Z0VsZW1lbnQpIHtcbiAgICAgICAgY29uZmlnLnN2Z0VsZW1lbnQgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZyhzdmdUZXh0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbmZpZy5zdmdFbGVtZW50O1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgRE9NIGVsZW1lbnQgZnJvbSB0aGUgZ2l2ZW4gU1ZHIHN0cmluZywgYW5kIGFkZHMgZGVmYXVsdCBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlU3ZnRWxlbWVudEZvclNpbmdsZUljb24ocmVzcG9uc2VUZXh0OiBzdHJpbmcsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IFNWR0VsZW1lbnQge1xuICAgIGNvbnN0IHN2ZyA9IHRoaXMuX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKHJlc3BvbnNlVGV4dCk7XG4gICAgdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyhzdmcsIG9wdGlvbnMpO1xuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgdGhlIGNhY2hlZCBlbGVtZW50IG9mIHRoZSBnaXZlbiBTdmdJY29uQ29uZmlnIGZvciBhIG5lc3RlZCBpY29uIGVsZW1lbnQgd2hvc2UgXCJpZFwiXG4gICAqIHRhZyBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbmFtZS4gSWYgZm91bmQsIGNvcGllcyB0aGUgbmVzdGVkIGVsZW1lbnQgdG8gYSBuZXcgU1ZHIGVsZW1lbnQgYW5kXG4gICAqIHJldHVybnMgaXQuIFJldHVybnMgbnVsbCBpZiBubyBtYXRjaGluZyBlbGVtZW50IGlzIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZXh0cmFjdFN2Z0ljb25Gcm9tU2V0KGljb25TZXQ6IFNWR0VsZW1lbnQsIGljb25OYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiBTVkdFbGVtZW50IHwgbnVsbCB7XG4gICAgLy8gVXNlIHRoZSBgaWQ9XCJpY29uTmFtZVwiYCBzeW50YXggaW4gb3JkZXIgdG8gZXNjYXBlIHNwZWNpYWxcbiAgICAvLyBjaGFyYWN0ZXJzIGluIHRoZSBJRCAodmVyc3VzIHVzaW5nIHRoZSAjaWNvbk5hbWUgc3ludGF4KS5cbiAgICBjb25zdCBpY29uU291cmNlID0gaWNvblNldC5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2ljb25OYW1lfVwiXWApO1xuXG4gICAgaWYgKCFpY29uU291cmNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDbG9uZSB0aGUgZWxlbWVudCBhbmQgcmVtb3ZlIHRoZSBJRCB0byBwcmV2ZW50IG11bHRpcGxlIGVsZW1lbnRzIGZyb20gYmVpbmcgYWRkZWRcbiAgICAvLyB0byB0aGUgcGFnZSB3aXRoIHRoZSBzYW1lIElELlxuICAgIGNvbnN0IGljb25FbGVtZW50ID0gaWNvblNvdXJjZS5jbG9uZU5vZGUodHJ1ZSkgYXMgRWxlbWVudDtcbiAgICBpY29uRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAvLyBJZiB0aGUgaWNvbiBub2RlIGlzIGl0c2VsZiBhbiA8c3ZnPiBub2RlLCBjbG9uZSBhbmQgcmV0dXJuIGl0IGRpcmVjdGx5LiBJZiBub3QsIHNldCBpdCBhc1xuICAgIC8vIHRoZSBjb250ZW50IG9mIGEgbmV3IDxzdmc+IG5vZGUuXG4gICAgaWYgKGljb25FbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyhpY29uRWxlbWVudCBhcyBTVkdFbGVtZW50LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbm9kZSBpcyBhIDxzeW1ib2w+LCBpdCB3b24ndCBiZSByZW5kZXJlZCBzbyB3ZSBoYXZlIHRvIGNvbnZlcnQgaXQgaW50byA8c3ZnPi4gTm90ZVxuICAgIC8vIHRoYXQgdGhlIHNhbWUgY291bGQgYmUgYWNoaWV2ZWQgYnkgcmVmZXJyaW5nIHRvIGl0IHZpYSA8dXNlIGhyZWY9XCIjaWRcIj4sIGhvd2V2ZXIgdGhlIDx1c2U+XG4gICAgLy8gdGFnIGlzIHByb2JsZW1hdGljIG9uIEZpcmVmb3gsIGJlY2F1c2UgaXQgbmVlZHMgdG8gaW5jbHVkZSB0aGUgY3VycmVudCBwYWdlIHBhdGguXG4gICAgaWYgKGljb25FbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyh0aGlzLl90b1N2Z0VsZW1lbnQoaWNvbkVsZW1lbnQpLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVFbGVtZW50KCdTVkcnKSBkb2Vzbid0IHdvcmsgYXMgZXhwZWN0ZWQ7IHRoZSBET00gZW5kcyB1cCB3aXRoXG4gICAgLy8gdGhlIGNvcnJlY3Qgbm9kZXMsIGJ1dCB0aGUgU1ZHIGNvbnRlbnQgZG9lc24ndCByZW5kZXIuIEluc3RlYWQgd2VcbiAgICAvLyBoYXZlIHRvIGNyZWF0ZSBhbiBlbXB0eSBTVkcgbm9kZSB1c2luZyBpbm5lckhUTUwgYW5kIGFwcGVuZCBpdHMgY29udGVudC5cbiAgICAvLyBFbGVtZW50cyBjcmVhdGVkIHVzaW5nIERPTVBhcnNlci5wYXJzZUZyb21TdHJpbmcgaGF2ZSB0aGUgc2FtZSBwcm9ibGVtLlxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjMwMDMyNzgvc3ZnLWlubmVyaHRtbC1pbi1maXJlZm94LWNhbi1ub3QtZGlzcGxheVxuICAgIGNvbnN0IHN2ZyA9IHRoaXMuX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKCc8c3ZnPjwvc3ZnPicpO1xuICAgIC8vIENsb25lIHRoZSBub2RlIHNvIHdlIGRvbid0IHJlbW92ZSBpdCBmcm9tIHRoZSBwYXJlbnQgaWNvbiBzZXQgZWxlbWVudC5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoaWNvbkVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXMoc3ZnLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgRE9NIGVsZW1lbnQgZnJvbSB0aGUgZ2l2ZW4gU1ZHIHN0cmluZy5cbiAgICovXG4gIHByaXZhdGUgX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKHN0cjogc3RyaW5nKTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3QgZGl2ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgZGl2LmlubmVySFRNTCA9IHN0cjtcbiAgICBjb25zdCBzdmcgPSBkaXYucXVlcnlTZWxlY3Rvcignc3ZnJykgYXMgU1ZHRWxlbWVudDtcblxuICAgIGlmICghc3ZnKSB7XG4gICAgICB0aHJvdyBFcnJvcignPHN2Zz4gdGFnIG5vdCBmb3VuZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYW4gZWxlbWVudCBpbnRvIGFuIFNWRyBub2RlIGJ5IGNsb25pbmcgYWxsIG9mIGl0cyBjaGlsZHJlbi5cbiAgICovXG4gIHByaXZhdGUgX3RvU3ZnRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcoJzxzdmc+PC9zdmc+Jyk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlcztcblxuICAgIC8vIENvcHkgb3ZlciBhbGwgdGhlIGF0dHJpYnV0ZXMgZnJvbSB0aGUgYHN5bWJvbGAgdG8gdGhlIG5ldyBTVkcsIGV4Y2VwdCB0aGUgaWQuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB7bmFtZSwgdmFsdWV9ID0gYXR0cmlidXRlc1tpXTtcblxuICAgICAgaWYgKG5hbWUgIT09ICdpZCcpIHtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkTm9kZXNbaV0ubm9kZVR5cGUgPT09IHRoaXMuX2RvY3VtZW50LkVMRU1FTlRfTk9ERSkge1xuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzW2ldLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZWZhdWx0IGF0dHJpYnV0ZXMgZm9yIGFuIFNWRyBlbGVtZW50IHRvIGJlIHVzZWQgYXMgYW4gaWNvbi5cbiAgICovXG4gIHByaXZhdGUgX3NldFN2Z0F0dHJpYnV0ZXMoc3ZnOiBTVkdFbGVtZW50LCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiBTVkdFbGVtZW50IHtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdmaXQnLCAnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxMDAlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCBtZWV0Jyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnZm9jdXNhYmxlJywgJ2ZhbHNlJyk7IC8vIERpc2FibGUgSUUxMSBkZWZhdWx0IGJlaGF2aW9yIHRvIG1ha2UgU1ZHcyBmb2N1c2FibGUuXG5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnZpZXdCb3gpIHtcbiAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBvcHRpb25zLnZpZXdCb3gpO1xuICAgIH1cblxuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHdoaWNoIHByb2R1Y2VzIHRoZSBzdHJpbmcgY29udGVudHMgb2YgdGhlIGdpdmVuIGljb24uIFJlc3VsdHMgbWF5IGJlXG4gICAqIGNhY2hlZCwgc28gZnV0dXJlIGNhbGxzIHdpdGggdGhlIHNhbWUgVVJMIG1heSBub3QgY2F1c2UgYW5vdGhlciBIVFRQIHJlcXVlc3QuXG4gICAqL1xuICBwcml2YXRlIF9mZXRjaEljb24oaWNvbkNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgY29uc3Qge3VybDogc2FmZVVybCwgb3B0aW9uc30gPSBpY29uQ29uZmlnO1xuICAgIGNvbnN0IHdpdGhDcmVkZW50aWFscyA9IG9wdGlvbnM/LndpdGhDcmVkZW50aWFscyA/PyBmYWxzZTtcblxuICAgIGlmICghdGhpcy5faHR0cENsaWVudCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbk5vSHR0cFByb3ZpZGVyRXJyb3IoKTtcbiAgICB9XG5cbiAgICBpZiAoc2FmZVVybCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZldGNoIGljb24gZnJvbSBVUkwgXCIke3NhZmVVcmx9XCIuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHNhZmVVcmwpO1xuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplVXJsRXJyb3Ioc2FmZVVybCk7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgaW4tcHJvZ3Jlc3MgZmV0Y2hlcyB0byBhdm9pZCBzZW5kaW5nIGEgZHVwbGljYXRlIHJlcXVlc3QgZm9yIGEgVVJMIHdoZW4gdGhlcmUgaXNcbiAgICAvLyBhbHJlYWR5IGEgcmVxdWVzdCBpbiBwcm9ncmVzcyBmb3IgdGhhdCBVUkwuIEl0J3MgbmVjZXNzYXJ5IHRvIGNhbGwgc2hhcmUoKSBvbiB0aGVcbiAgICAvLyBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGh0dHAuZ2V0KCkgc28gdGhhdCBtdWx0aXBsZSBzdWJzY3JpYmVycyBkb24ndCBjYXVzZSBtdWx0aXBsZSBYSFJzLlxuICAgIGNvbnN0IGluUHJvZ3Jlc3NGZXRjaCA9IHRoaXMuX2luUHJvZ3Jlc3NVcmxGZXRjaGVzLmdldCh1cmwpO1xuXG4gICAgaWYgKGluUHJvZ3Jlc3NGZXRjaCkge1xuICAgICAgcmV0dXJuIGluUHJvZ3Jlc3NGZXRjaDtcbiAgICB9XG5cbiAgICAvLyBUT0RPKGplbGJvdXJuKTogZm9yIHNvbWUgcmVhc29uLCB0aGUgYGZpbmFsaXplYCBvcGVyYXRvciBcImxvc2VzXCIgdGhlIGdlbmVyaWMgdHlwZSBvbiB0aGVcbiAgICAvLyBPYnNlcnZhYmxlLiBGaWd1cmUgb3V0IHdoeSBhbmQgZml4IGl0LlxuICAgIGNvbnN0IHJlcSA9IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHVybCwge3Jlc3BvbnNlVHlwZTogJ3RleHQnLCB3aXRoQ3JlZGVudGlhbHN9KS5waXBlKFxuICAgICAgZmluYWxpemUoKCkgPT4gdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuZGVsZXRlKHVybCkpLFxuICAgICAgc2hhcmUoKSxcbiAgICApO1xuXG4gICAgdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuc2V0KHVybCwgcmVxKTtcbiAgICByZXR1cm4gcmVxO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIGNvbmZpZyBieSBuYW1lIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBjb25maWcuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBjb25maWcuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBwcml2YXRlIF9hZGRTdmdJY29uQ29uZmlnKG5hbWVzcGFjZTogc3RyaW5nLCBpY29uTmFtZTogc3RyaW5nLCBjb25maWc6IFN2Z0ljb25Db25maWcpOiB0aGlzIHtcbiAgICB0aGlzLl9zdmdJY29uQ29uZmlncy5zZXQoaWNvbktleShuYW1lc3BhY2UsIGljb25OYW1lKSwgY29uZmlnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgY29uZmlnIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBjb25maWcuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBwcml2YXRlIF9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZTogc3RyaW5nLCBjb25maWc6IFN2Z0ljb25Db25maWcpOiB0aGlzIHtcbiAgICBjb25zdCBjb25maWdOYW1lc3BhY2UgPSB0aGlzLl9pY29uU2V0Q29uZmlncy5nZXQobmFtZXNwYWNlKTtcblxuICAgIGlmIChjb25maWdOYW1lc3BhY2UpIHtcbiAgICAgIGNvbmZpZ05hbWVzcGFjZS5wdXNoKGNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ljb25TZXRDb25maWdzLnNldChuYW1lc3BhY2UsIFtjb25maWddKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIElDT05fUkVHSVNUUllfUFJPVklERVJfRkFDVE9SWShcbiAgcGFyZW50UmVnaXN0cnk6IE1hdEljb25SZWdpc3RyeSxcbiAgaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBkb2N1bWVudD86IGFueSkge1xuICByZXR1cm4gcGFyZW50UmVnaXN0cnkgfHwgbmV3IE1hdEljb25SZWdpc3RyeShodHRwQ2xpZW50LCBzYW5pdGl6ZXIsIGRvY3VtZW50LCBlcnJvckhhbmRsZXIpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IElDT05fUkVHSVNUUllfUFJPVklERVIgPSB7XG4gIC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYW4gTWF0SWNvblJlZ2lzdHJ5IGF2YWlsYWJsZSwgdXNlIHRoYXQuIE90aGVyd2lzZSwgcHJvdmlkZSBhIG5ldyBvbmUuXG4gIHByb3ZpZGU6IE1hdEljb25SZWdpc3RyeSxcbiAgZGVwczogW1xuICAgIFtuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdEljb25SZWdpc3RyeV0sXG4gICAgW25ldyBPcHRpb25hbCgpLCBIdHRwQ2xpZW50XSxcbiAgICBEb21TYW5pdGl6ZXIsXG4gICAgRXJyb3JIYW5kbGVyLFxuICAgIFtuZXcgT3B0aW9uYWwoKSwgRE9DVU1FTlQgYXMgSW5qZWN0aW9uVG9rZW48YW55Pl0sXG4gIF0sXG4gIHVzZUZhY3Rvcnk6IElDT05fUkVHSVNUUllfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cbi8qKiBDbG9uZXMgYW4gU1ZHRWxlbWVudCB3aGlsZSBwcmVzZXJ2aW5nIHR5cGUgaW5mb3JtYXRpb24uICovXG5mdW5jdGlvbiBjbG9uZVN2Zyhzdmc6IFNWR0VsZW1lbnQpOiBTVkdFbGVtZW50IHtcbiAgcmV0dXJuIHN2Zy5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHRWxlbWVudDtcbn1cblxuLyoqIFJldHVybnMgdGhlIGNhY2hlIGtleSB0byB1c2UgZm9yIGFuIGljb24gbmFtZXNwYWNlIGFuZCBuYW1lLiAqL1xuZnVuY3Rpb24gaWNvbktleShuYW1lc3BhY2U6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBuYW1lc3BhY2UgKyAnOicgKyBuYW1lO1xufVxuIl19