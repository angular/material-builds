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
    constructor(url, svgText, options) {
        this.url = url;
        this.svgText = svgText;
        this.options = options;
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
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(url, null, options));
    }
    /**
     * Registers an icon using an HTML string in the specified namespace.
     * @param namespace Namespace in which the icon should be registered.
     * @param iconName Name under which the icon should be registered.
     * @param literal SVG source of the icon.
     */
    addSvgIconLiteralInNamespace(namespace, iconName, literal, options) {
        const cleanLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        // TODO: add an ngDevMode check
        if (!cleanLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig('', cleanLiteral, options));
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
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig(url, null, options));
    }
    /**
     * Registers an icon set using an HTML string in the specified namespace.
     * @param namespace Namespace in which to register the icon set.
     * @param literal SVG source of the icon set.
     */
    addSvgIconSetLiteralInNamespace(namespace, literal, options) {
        const cleanLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        if (!cleanLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig('', cleanLiteral, options));
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
        return this._loadSvgIconFromConfig(new SvgIconConfig(safeUrl, null)).pipe(tap(svg => this._cachedIconsByUrl.set(url, svg)), map(svg => cloneSvg(svg)));
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
        if (config.svgText) {
            // We already have the SVG element for this icon, return a copy.
            return observableOf(cloneSvg(this._svgElementFromConfig(config)));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return this._loadSvgIconFromConfig(config).pipe(map(svg => cloneSvg(svg)));
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
            .filter(iconSetConfig => !iconSetConfig.svgText)
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
            // TODO: add an ngDevMode check
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
            // Parsing the icon set's text into an SVG element can be expensive. We can avoid some of
            // the parsing by doing a quick check using `indexOf` to see if there's any chance for the
            // icon to be in the set. This won't be 100% accurate, but it should help us avoid at least
            // some of the parsing.
            if (config.svgText && config.svgText.indexOf(iconName) > -1) {
                const svg = this._svgElementFromConfig(config);
                const foundIcon = this._extractSvgIconFromSet(svg, iconName, config.options);
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
        return this._fetchIcon(config).pipe(tap(svgText => config.svgText = svgText), map(() => this._svgElementFromConfig(config)));
    }
    /**
     * Loads the content of the icon set URL specified in the
     * SvgIconConfig and attaches it to the config.
     */
    _loadSvgIconSetFromConfig(config) {
        if (config.svgText) {
            return observableOf(null);
        }
        return this._fetchIcon(config).pipe(tap(svgText => config.svgText = svgText));
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
        // TODO: add an ngDevMode check
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
        // TODO: add an ngDevMode check
        if (safeUrl == null) {
            throw Error(`Cannot fetch icon from URL "${safeUrl}".`);
        }
        const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        // TODO: add an ngDevMode check
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
    /** Parses a config's text into an SVG element. */
    _svgElementFromConfig(config) {
        if (!config.svgElement) {
            const svg = this._svgElementFromString(config.svgText);
            this._setSvgAttributes(svg, config.options);
            config.svgElement = svg;
        }
        return config.svgElement;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQW9CLE1BQU0sc0JBQXNCLENBQUM7QUFDbkUsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUVWLFFBQVEsRUFDUixlQUFlLEVBQ2YsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxZQUFZLEVBQTRCLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFFBQVEsRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0YsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFHckU7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSwyQkFBMkIsQ0FBQyxRQUFnQjtJQUMxRCxPQUFPLEtBQUssQ0FBQyxzQ0FBc0MsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBR0Q7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSw2QkFBNkI7SUFDM0MsT0FBTyxLQUFLLENBQUMsMEVBQTBFO1FBQzFFLHdFQUF3RTtRQUN4RSxjQUFjLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBR0Q7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxHQUFvQjtJQUNyRSxPQUFPLEtBQUssQ0FBQyx3RUFBd0U7UUFDeEUsa0RBQWtELEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxN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RUFDMUIsUUFBYztJQUNkLE9BQU8sY0FBYyxJQUFJLElBQUksZUFBZSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzlGLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsNEZBQTRGO0lBQzVGLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLElBQUksRUFBRTtRQUNKLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGVBQWUsQ0FBQztRQUNqRCxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsVUFBVSxDQUFDO1FBQzVCLFlBQVk7UUFDWixZQUFZO1FBQ1osQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLFFBQStCLENBQUM7S0FDbEQ7SUFDRCxVQUFVLEVBQUUsOEJBQThCO0NBQzNDLENBQUM7QUFFRiw4REFBOEQ7QUFDOUQsU0FBUyxRQUFRLENBQUMsR0FBZTtJQUMvQixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFlLENBQUM7QUFDM0MsQ0FBQztBQUVELG1FQUFtRTtBQUNuRSxTQUFTLE9BQU8sQ0FBQyxTQUFpQixFQUFFLElBQVk7SUFDOUMsT0FBTyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBFcnJvclJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBFcnJvckhhbmRsZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9wdGlvbmFsLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIFNraXBTZWxmLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEb21TYW5pdGl6ZXIsIFNhZmVSZXNvdXJjZVVybCwgU2FmZUh0bWx9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtmb3JrSm9pbiwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd30gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIGZpbmFsaXplLCBtYXAsIHNoYXJlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biBpbiB0aGUgY2FzZSB3aGVuIGF0dGVtcHRpbmcgdG9cbiAqIGxvYWQgYW4gaWNvbiB3aXRoIGEgbmFtZSB0aGF0IGNhbm5vdCBiZSBmb3VuZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEljb25OYW1lTm90Rm91bmRFcnJvcihpY29uTmFtZTogc3RyaW5nKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYFVuYWJsZSB0byBmaW5kIGljb24gd2l0aCB0aGUgbmFtZSBcIiR7aWNvbk5hbWV9XCJgKTtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIHRoZSBjb25zdW1lciBhdHRlbXB0cyB0byB1c2VcbiAqIGA8bWF0LWljb24+YCB3aXRob3V0IGluY2x1ZGluZyBAYW5ndWxhci9jb21tb24vaHR0cC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEljb25Ob0h0dHBQcm92aWRlckVycm9yKCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKCdDb3VsZCBub3QgZmluZCBIdHRwQ2xpZW50IHByb3ZpZGVyIGZvciB1c2Ugd2l0aCBBbmd1bGFyIE1hdGVyaWFsIGljb25zLiAnICtcbiAgICAgICAgICAgICAgICdQbGVhc2UgaW5jbHVkZSB0aGUgSHR0cENsaWVudE1vZHVsZSBmcm9tIEBhbmd1bGFyL2NvbW1vbi9odHRwIGluIHlvdXIgJyArXG4gICAgICAgICAgICAgICAnYXBwIGltcG9ydHMuJyk7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gd2hlbiBhIFVSTCBjb3VsZG4ndCBiZSBzYW5pdGl6ZWQuXG4gKiBAcGFyYW0gdXJsIFVSTCB0aGF0IHdhcyBhdHRlbXB0ZWQgdG8gYmUgc2FuaXRpemVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVVcmxFcnJvcih1cmw6IFNhZmVSZXNvdXJjZVVybCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBUaGUgVVJMIHByb3ZpZGVkIHRvIE1hdEljb25SZWdpc3RyeSB3YXMgbm90IHRydXN0ZWQgYXMgYSByZXNvdXJjZSBVUkwgYCArXG4gICAgICAgICAgICAgICBgdmlhIEFuZ3VsYXIncyBEb21TYW5pdGl6ZXIuIEF0dGVtcHRlZCBVUkwgd2FzIFwiJHt1cmx9XCIuYCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gYSBIVE1MIHN0cmluZyBjb3VsZG4ndCBiZSBzYW5pdGl6ZWQuXG4gKiBAcGFyYW0gbGl0ZXJhbCBIVE1MIHRoYXQgd2FzIGF0dGVtcHRlZCB0byBiZSBzYW5pdGl6ZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZUxpdGVyYWxFcnJvcihsaXRlcmFsOiBTYWZlSHRtbCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBUaGUgbGl0ZXJhbCBwcm92aWRlZCB0byBNYXRJY29uUmVnaXN0cnkgd2FzIG5vdCB0cnVzdGVkIGFzIHNhZmUgSFRNTCBieSBgICtcbiAgICAgICAgICAgICAgIGBBbmd1bGFyJ3MgRG9tU2FuaXRpemVyLiBBdHRlbXB0ZWQgbGl0ZXJhbCB3YXMgXCIke2xpdGVyYWx9XCIuYCk7XG59XG5cbi8qKiBPcHRpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIGhvdyBhbiBpY29uIG9yIHRoZSBpY29ucyBpbiBhbiBpY29uIHNldCBhcmUgcHJlc2VudGVkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJY29uT3B0aW9ucyB7XG4gIC8qKiBWaWV3IGJveCB0byBzZXQgb24gdGhlIGljb24uICovXG4gIHZpZXdCb3g/OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRvIGZldGNoIHRoZSBpY29uIG9yIGljb24gc2V0IHVzaW5nIEhUVFAgY3JlZGVudGlhbHMuICovXG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYW4gaWNvbiwgaW5jbHVkaW5nIHRoZSBVUkwgYW5kIHBvc3NpYmx5IHRoZSBjYWNoZWQgU1ZHIGVsZW1lbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNsYXNzIFN2Z0ljb25Db25maWcge1xuICBzdmdFbGVtZW50OiBTVkdFbGVtZW50IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdXJsOiBTYWZlUmVzb3VyY2VVcmwsXG4gICAgcHVibGljIHN2Z1RleHQ6IHN0cmluZyB8IG51bGwsXG4gICAgcHVibGljIG9wdGlvbnM/OiBJY29uT3B0aW9ucykge31cbn1cblxuLyoqIEljb24gY29uZmlndXJhdGlvbiB3aG9zZSBjb250ZW50IGhhcyBhbHJlYWR5IGJlZW4gbG9hZGVkLiAqL1xudHlwZSBMb2FkZWRTdmdJY29uQ29uZmlnID0gU3ZnSWNvbkNvbmZpZyAmIHtzdmdUZXh0OiBzdHJpbmd9O1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gcmVnaXN0ZXIgYW5kIGRpc3BsYXkgaWNvbnMgdXNlZCBieSB0aGUgYDxtYXQtaWNvbj5gIGNvbXBvbmVudC5cbiAqIC0gUmVnaXN0ZXJzIGljb24gVVJMcyBieSBuYW1lc3BhY2UgYW5kIG5hbWUuXG4gKiAtIFJlZ2lzdGVycyBpY29uIHNldCBVUkxzIGJ5IG5hbWVzcGFjZS5cbiAqIC0gUmVnaXN0ZXJzIGFsaWFzZXMgZm9yIENTUyBjbGFzc2VzLCBmb3IgdXNlIHdpdGggaWNvbiBmb250cy5cbiAqIC0gTG9hZHMgaWNvbnMgZnJvbSBVUkxzIGFuZCBleHRyYWN0cyBpbmRpdmlkdWFsIGljb25zIGZyb20gaWNvbiBzZXRzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRJY29uUmVnaXN0cnkgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqXG4gICAqIFVSTHMgYW5kIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIGluZGl2aWR1YWwgaWNvbnMuIEtleXMgYXJlIG9mIHRoZSBmb3JtYXQgXCJbbmFtZXNwYWNlXTpbaWNvbl1cIi5cbiAgICovXG4gIHByaXZhdGUgX3N2Z0ljb25Db25maWdzID0gbmV3IE1hcDxzdHJpbmcsIFN2Z0ljb25Db25maWc+KCk7XG5cbiAgLyoqXG4gICAqIFN2Z0ljb25Db25maWcgb2JqZWN0cyBhbmQgY2FjaGVkIFNWRyBlbGVtZW50cyBmb3IgaWNvbiBzZXRzLCBrZXllZCBieSBuYW1lc3BhY2UuXG4gICAqIE11bHRpcGxlIGljb24gc2V0cyBjYW4gYmUgcmVnaXN0ZXJlZCB1bmRlciB0aGUgc2FtZSBuYW1lc3BhY2UuXG4gICAqL1xuICBwcml2YXRlIF9pY29uU2V0Q29uZmlncyA9IG5ldyBNYXA8c3RyaW5nLCBTdmdJY29uQ29uZmlnW10+KCk7XG5cbiAgLyoqIENhY2hlIGZvciBpY29ucyBsb2FkZWQgYnkgZGlyZWN0IFVSTHMuICovXG4gIHByaXZhdGUgX2NhY2hlZEljb25zQnlVcmwgPSBuZXcgTWFwPHN0cmluZywgU1ZHRWxlbWVudD4oKTtcblxuICAvKiogSW4tcHJvZ3Jlc3MgaWNvbiBmZXRjaGVzLiBVc2VkIHRvIGNvYWxlc2NlIG11bHRpcGxlIHJlcXVlc3RzIHRvIHRoZSBzYW1lIFVSTC4gKi9cbiAgcHJpdmF0ZSBfaW5Qcm9ncmVzc1VybEZldGNoZXMgPSBuZXcgTWFwPHN0cmluZywgT2JzZXJ2YWJsZTxzdHJpbmc+PigpO1xuXG4gIC8qKiBNYXAgZnJvbSBmb250IGlkZW50aWZpZXJzIHRvIHRoZWlyIENTUyBjbGFzcyBuYW1lcy4gVXNlZCBmb3IgaWNvbiBmb250cy4gKi9cbiAgcHJpdmF0ZSBfZm9udENzc0NsYXNzZXNCeUFsaWFzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICAvKipcbiAgICogVGhlIENTUyBjbGFzcyB0byBhcHBseSB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgaGFzIG5vIGljb24gbmFtZSwgdXJsLCBvciBmb250IHNwZWNpZmllZC5cbiAgICogVGhlIGRlZmF1bHQgJ21hdGVyaWFsLWljb25zJyB2YWx1ZSBhc3N1bWVzIHRoYXQgdGhlIG1hdGVyaWFsIGljb24gZm9udCBoYXMgYmVlbiBsb2FkZWQgYXNcbiAgICogZGVzY3JpYmVkIGF0IGh0dHA6Ly9nb29nbGUuZ2l0aHViLmlvL21hdGVyaWFsLWRlc2lnbi1pY29ucy8jaWNvbi1mb250LWZvci10aGUtd2ViXG4gICAqL1xuICBwcml2YXRlIF9kZWZhdWx0Rm9udFNldENsYXNzID0gJ21hdGVyaWFsLWljb25zJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9odHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgX3Nhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBieSBVUkwgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHVybFxuICAgKi9cbiAgYWRkU3ZnSWNvbihpY29uTmFtZTogc3RyaW5nLCB1cmw6IFNhZmVSZXNvdXJjZVVybCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvbkluTmFtZXNwYWNlKCcnLCBpY29uTmFtZSwgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uLlxuICAgKi9cbiAgYWRkU3ZnSWNvbkxpdGVyYWwoaWNvbk5hbWU6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UoJycsIGljb25OYW1lLCBsaXRlcmFsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBieSBVUkwgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHVybFxuICAgKi9cbiAgYWRkU3ZnSWNvbkluTmFtZXNwYWNlKG5hbWVzcGFjZTogc3RyaW5nLCBpY29uTmFtZTogc3RyaW5nLCB1cmw6IFNhZmVSZXNvdXJjZVVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uQ29uZmlnKG5hbWVzcGFjZSwgaWNvbk5hbWUsIG5ldyBTdmdJY29uQ29uZmlnKHVybCwgbnVsbCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBsaXRlcmFsIFNWRyBzb3VyY2Ugb2YgdGhlIGljb24uXG4gICAqL1xuICBhZGRTdmdJY29uTGl0ZXJhbEluTmFtZXNwYWNlKG5hbWVzcGFjZTogc3RyaW5nLCBpY29uTmFtZTogc3RyaW5nLCBsaXRlcmFsOiBTYWZlSHRtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICBjb25zdCBjbGVhbkxpdGVyYWwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIGxpdGVyYWwpO1xuXG4gICAgLy8gVE9ETzogYWRkIGFuIG5nRGV2TW9kZSBjaGVja1xuICAgIGlmICghY2xlYW5MaXRlcmFsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZUxpdGVyYWxFcnJvcihsaXRlcmFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2UsIGljb25OYW1lLFxuICAgICAgICBuZXcgU3ZnSWNvbkNvbmZpZygnJywgY2xlYW5MaXRlcmFsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGJ5IFVSTCBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXQodXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZSgnJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uIHNldC5cbiAgICovXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsKGxpdGVyYWw6IFNhZmVIdG1sLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uU2V0TGl0ZXJhbEluTmFtZXNwYWNlKCcnLCBsaXRlcmFsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgYnkgVVJMIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZSwgbmV3IFN2Z0ljb25Db25maWcodXJsLCBudWxsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSBsaXRlcmFsIFNWRyBzb3VyY2Ugb2YgdGhlIGljb24gc2V0LlxuICAgKi9cbiAgYWRkU3ZnSWNvblNldExpdGVyYWxJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgY29uc3QgY2xlYW5MaXRlcmFsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCBsaXRlcmFsKTtcblxuICAgIGlmICghY2xlYW5MaXRlcmFsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZUxpdGVyYWxFcnJvcihsaXRlcmFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2UsIG5ldyBTdmdJY29uQ29uZmlnKCcnLCBjbGVhbkxpdGVyYWwsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIGFsaWFzIGZvciBhIENTUyBjbGFzcyBuYW1lIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMuIENyZWF0aW5nIGFuIG1hdEljb25cbiAgICogY29tcG9uZW50IHdpdGggdGhlIGFsaWFzIGFzIHRoZSBmb250U2V0IGlucHV0IHdpbGwgY2F1c2UgdGhlIGNsYXNzIG5hbWUgdG8gYmUgYXBwbGllZFxuICAgKiB0byB0aGUgYDxtYXQtaWNvbj5gIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBhbGlhcyBBbGlhcyBmb3IgdGhlIGZvbnQuXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgQ2xhc3MgbmFtZSBvdmVycmlkZSB0byBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGFsaWFzLlxuICAgKi9cbiAgcmVnaXN0ZXJGb250Q2xhc3NBbGlhcyhhbGlhczogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZyA9IGFsaWFzKTogdGhpcyB7XG4gICAgdGhpcy5fZm9udENzc0NsYXNzZXNCeUFsaWFzLnNldChhbGlhcywgY2xhc3NOYW1lKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3MgbmFtZSBhc3NvY2lhdGVkIHdpdGggdGhlIGFsaWFzIGJ5IGEgcHJldmlvdXMgY2FsbCB0b1xuICAgKiByZWdpc3RlckZvbnRDbGFzc0FsaWFzLiBJZiBubyBDU1MgY2xhc3MgaGFzIGJlZW4gYXNzb2NpYXRlZCwgcmV0dXJucyB0aGUgYWxpYXMgdW5tb2RpZmllZC5cbiAgICovXG4gIGNsYXNzTmFtZUZvckZvbnRBbGlhcyhhbGlhczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZm9udENzc0NsYXNzZXNCeUFsaWFzLmdldChhbGlhcykgfHwgYWxpYXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgQ1NTIGNsYXNzIG5hbWUgdG8gYmUgdXNlZCBmb3IgaWNvbiBmb250cyB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgZG9lcyBub3RcbiAgICogaGF2ZSBhIGZvbnRTZXQgaW5wdXQgdmFsdWUsIGFuZCBpcyBub3QgbG9hZGluZyBhbiBpY29uIGJ5IG5hbWUgb3IgVVJMLlxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAqL1xuICBzZXREZWZhdWx0Rm9udFNldENsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy5fZGVmYXVsdEZvbnRTZXRDbGFzcyA9IGNsYXNzTmFtZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3MgbmFtZSB0byBiZSB1c2VkIGZvciBpY29uIGZvbnRzIHdoZW4gYW4gYDxtYXQtaWNvbj5gIGNvbXBvbmVudCBkb2VzIG5vdFxuICAgKiBoYXZlIGEgZm9udFNldCBpbnB1dCB2YWx1ZSwgYW5kIGlzIG5vdCBsb2FkaW5nIGFuIGljb24gYnkgbmFtZSBvciBVUkwuXG4gICAqL1xuICBnZXREZWZhdWx0Rm9udFNldENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRGb250U2V0Q2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgcHJvZHVjZXMgdGhlIGljb24gKGFzIGFuIGA8c3ZnPmAgRE9NIGVsZW1lbnQpIGZyb20gdGhlIGdpdmVuIFVSTC5cbiAgICogVGhlIHJlc3BvbnNlIGZyb20gdGhlIFVSTCBtYXkgYmUgY2FjaGVkIHNvIHRoaXMgd2lsbCBub3QgYWx3YXlzIGNhdXNlIGFuIEhUVFAgcmVxdWVzdCwgYnV0XG4gICAqIHRoZSBwcm9kdWNlZCBlbGVtZW50IHdpbGwgYWx3YXlzIGJlIGEgbmV3IGNvcHkgb2YgdGhlIG9yaWdpbmFsbHkgZmV0Y2hlZCBpY29uLiAoVGhhdCBpcyxcbiAgICogaXQgd2lsbCBub3QgY29udGFpbiBhbnkgbW9kaWZpY2F0aW9ucyBtYWRlIHRvIGVsZW1lbnRzIHByZXZpb3VzbHkgcmV0dXJuZWQpLlxuICAgKlxuICAgKiBAcGFyYW0gc2FmZVVybCBVUkwgZnJvbSB3aGljaCB0byBmZXRjaCB0aGUgU1ZHIGljb24uXG4gICAqL1xuICBnZXRTdmdJY29uRnJvbVVybChzYWZlVXJsOiBTYWZlUmVzb3VyY2VVcmwpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlJFU09VUkNFX1VSTCwgc2FmZVVybCk7XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVVcmxFcnJvcihzYWZlVXJsKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWNoZWRJY29uID0gdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5nZXQodXJsKTtcblxuICAgIGlmIChjYWNoZWRJY29uKSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGNsb25lU3ZnKGNhY2hlZEljb24pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25Gcm9tQ29uZmlnKG5ldyBTdmdJY29uQ29uZmlnKHNhZmVVcmwsIG51bGwpKS5waXBlKFxuICAgICAgdGFwKHN2ZyA9PiB0aGlzLl9jYWNoZWRJY29uc0J5VXJsLnNldCh1cmwhLCBzdmcpKSxcbiAgICAgIG1hcChzdmcgPT4gY2xvbmVTdmcoc3ZnKSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBwcm9kdWNlcyB0aGUgaWNvbiAoYXMgYW4gYDxzdmc+YCBET00gZWxlbWVudCkgd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKiBhbmQgbmFtZXNwYWNlLiBUaGUgaWNvbiBtdXN0IGhhdmUgYmVlbiBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCBhZGRJY29uIG9yIGFkZEljb25TZXQ7XG4gICAqIGlmIG5vdCwgdGhlIE9ic2VydmFibGUgd2lsbCB0aHJvdyBhbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgaWNvbiB0byBiZSByZXRyaWV2ZWQuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRvIGxvb2sgZm9yIHRoZSBpY29uLlxuICAgKi9cbiAgZ2V0TmFtZWRTdmdJY29uKG5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcgPSAnJyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIC8vIFJldHVybiAoY29weSBvZikgY2FjaGVkIGljb24gaWYgcG9zc2libGUuXG4gICAgY29uc3Qga2V5ID0gaWNvbktleShuYW1lc3BhY2UsIG5hbWUpO1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX3N2Z0ljb25Db25maWdzLmdldChrZXkpO1xuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21Db25maWcoY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBTZWUgaWYgd2UgaGF2ZSBhbnkgaWNvbiBzZXRzIHJlZ2lzdGVyZWQgZm9yIHRoZSBuYW1lc3BhY2UuXG4gICAgY29uc3QgaWNvblNldENvbmZpZ3MgPSB0aGlzLl9pY29uU2V0Q29uZmlncy5nZXQobmFtZXNwYWNlKTtcblxuICAgIGlmIChpY29uU2V0Q29uZmlncykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21JY29uU2V0Q29uZmlncyhuYW1lLCBpY29uU2V0Q29uZmlncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUaHJvdyhnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3Ioa2V5KSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgIHRoaXMuX3N2Z0ljb25Db25maWdzLmNsZWFyKCk7XG4gICB0aGlzLl9pY29uU2V0Q29uZmlncy5jbGVhcigpO1xuICAgdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNhY2hlZCBpY29uIGZvciBhIFN2Z0ljb25Db25maWcgaWYgYXZhaWxhYmxlLCBvciBmZXRjaGVzIGl0IGZyb20gaXRzIFVSTCBpZiBub3QuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTdmdGcm9tQ29uZmlnKGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIGlmIChjb25maWcuc3ZnVGV4dCkge1xuICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIHRoZSBTVkcgZWxlbWVudCBmb3IgdGhpcyBpY29uLCByZXR1cm4gYSBjb3B5LlxuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjbG9uZVN2Zyh0aGlzLl9zdmdFbGVtZW50RnJvbUNvbmZpZyhjb25maWcgYXMgTG9hZGVkU3ZnSWNvbkNvbmZpZykpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmV0Y2ggdGhlIGljb24gZnJvbSB0aGUgY29uZmlnJ3MgVVJMLCBjYWNoZSBpdCwgYW5kIHJldHVybiBhIGNvcHkuXG4gICAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25Gcm9tQ29uZmlnKGNvbmZpZykucGlwZShtYXAoc3ZnID0+IGNsb25lU3ZnKHN2ZykpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gZmluZCBhbiBpY29uIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGluIGFueSBvZiB0aGUgU1ZHIGljb24gc2V0cy5cbiAgICogRmlyc3Qgc2VhcmNoZXMgdGhlIGF2YWlsYWJsZSBjYWNoZWQgaWNvbnMgZm9yIGEgbmVzdGVkIGVsZW1lbnQgd2l0aCBhIG1hdGNoaW5nIG5hbWUsIGFuZFxuICAgKiBpZiBmb3VuZCBjb3BpZXMgdGhlIGVsZW1lbnQgdG8gYSBuZXcgYDxzdmc+YCBlbGVtZW50LiBJZiBub3QgZm91bmQsIGZldGNoZXMgYWxsIGljb24gc2V0c1xuICAgKiB0aGF0IGhhdmUgbm90IGJlZW4gY2FjaGVkLCBhbmQgc2VhcmNoZXMgYWdhaW4gYWZ0ZXIgYWxsIGZldGNoZXMgYXJlIGNvbXBsZXRlZC5cbiAgICogVGhlIHJldHVybmVkIE9ic2VydmFibGUgcHJvZHVjZXMgdGhlIFNWRyBlbGVtZW50IGlmIHBvc3NpYmxlLCBhbmQgdGhyb3dzXG4gICAqIGFuIGVycm9yIGlmIG5vIGljb24gd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgY2FuIGJlIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0U3ZnRnJvbUljb25TZXRDb25maWdzKG5hbWU6IHN0cmluZywgaWNvblNldENvbmZpZ3M6IFN2Z0ljb25Db25maWdbXSk6XG4gICAgICBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICAvLyBGb3IgYWxsIHRoZSBpY29uIHNldCBTVkcgZWxlbWVudHMgd2UndmUgZmV0Y2hlZCwgc2VlIGlmIGFueSBjb250YWluIGFuIGljb24gd2l0aCB0aGVcbiAgICAvLyByZXF1ZXN0ZWQgbmFtZS5cbiAgICBjb25zdCBuYW1lZEljb24gPSB0aGlzLl9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChuYW1lLCBpY29uU2V0Q29uZmlncyk7XG5cbiAgICBpZiAobmFtZWRJY29uKSB7XG4gICAgICAvLyBXZSBjb3VsZCBjYWNoZSBuYW1lZEljb24gaW4gX3N2Z0ljb25Db25maWdzLCBidXQgc2luY2Ugd2UgaGF2ZSB0byBtYWtlIGEgY29weSBldmVyeVxuICAgICAgLy8gdGltZSBhbnl3YXksIHRoZXJlJ3MgcHJvYmFibHkgbm90IG11Y2ggYWR2YW50YWdlIGNvbXBhcmVkIHRvIGp1c3QgYWx3YXlzIGV4dHJhY3RpbmdcbiAgICAgIC8vIGl0IGZyb20gdGhlIGljb24gc2V0LlxuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihuYW1lZEljb24pO1xuICAgIH1cblxuICAgIC8vIE5vdCBmb3VuZCBpbiBhbnkgY2FjaGVkIGljb24gc2V0cy4gSWYgdGhlcmUgYXJlIGljb24gc2V0cyB3aXRoIFVSTHMgdGhhdCB3ZSBoYXZlbid0XG4gICAgLy8gZmV0Y2hlZCwgZmV0Y2ggdGhlbSBub3cgYW5kIGxvb2sgZm9yIGljb25OYW1lIGluIHRoZSByZXN1bHRzLlxuICAgIGNvbnN0IGljb25TZXRGZXRjaFJlcXVlc3RzOiBPYnNlcnZhYmxlPHN0cmluZyB8IG51bGw+W10gPSBpY29uU2V0Q29uZmlnc1xuICAgICAgLmZpbHRlcihpY29uU2V0Q29uZmlnID0+ICFpY29uU2V0Q29uZmlnLnN2Z1RleHQpXG4gICAgICAubWFwKGljb25TZXRDb25maWcgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25TZXRGcm9tQ29uZmlnKGljb25TZXRDb25maWcpLnBpcGUoXG4gICAgICAgICAgY2F0Y2hFcnJvcigoZXJyOiBIdHRwRXJyb3JSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIGljb25TZXRDb25maWcudXJsKTtcblxuICAgICAgICAgICAgLy8gU3dhbGxvdyBlcnJvcnMgZmV0Y2hpbmcgaW5kaXZpZHVhbCBVUkxzIHNvIHRoZVxuICAgICAgICAgICAgLy8gY29tYmluZWQgT2JzZXJ2YWJsZSB3b24ndCBuZWNlc3NhcmlseSBmYWlsLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYExvYWRpbmcgaWNvbiBzZXQgVVJMOiAke3VybH0gZmFpbGVkOiAke2Vyci5tZXNzYWdlfWA7XG4gICAgICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IobmV3IEVycm9yKGVycm9yTWVzc2FnZSkpO1xuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihudWxsKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAvLyBGZXRjaCBhbGwgdGhlIGljb24gc2V0IFVSTHMuIFdoZW4gdGhlIHJlcXVlc3RzIGNvbXBsZXRlLCBldmVyeSBJY29uU2V0IHNob3VsZCBoYXZlIGFcbiAgICAvLyBjYWNoZWQgU1ZHIGVsZW1lbnQgKHVubGVzcyB0aGUgcmVxdWVzdCBmYWlsZWQpLCBhbmQgd2UgY2FuIGNoZWNrIGFnYWluIGZvciB0aGUgaWNvbi5cbiAgICByZXR1cm4gZm9ya0pvaW4oaWNvblNldEZldGNoUmVxdWVzdHMpLnBpcGUobWFwKCgpID0+IHtcbiAgICAgIGNvbnN0IGZvdW5kSWNvbiA9IHRoaXMuX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KG5hbWUsIGljb25TZXRDb25maWdzKTtcblxuICAgICAgLy8gVE9ETzogYWRkIGFuIG5nRGV2TW9kZSBjaGVja1xuICAgICAgaWYgKCFmb3VuZEljb24pIHtcbiAgICAgICAgdGhyb3cgZ2V0TWF0SWNvbk5hbWVOb3RGb3VuZEVycm9yKG5hbWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm91bmRJY29uO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyB0aGUgY2FjaGVkIFNWRyBlbGVtZW50cyBmb3IgdGhlIGdpdmVuIGljb24gc2V0cyBmb3IgYSBuZXN0ZWQgaWNvbiBlbGVtZW50IHdob3NlIFwiaWRcIlxuICAgKiB0YWcgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIG5hbWUuIElmIGZvdW5kLCBjb3BpZXMgdGhlIG5lc3RlZCBlbGVtZW50IHRvIGEgbmV3IFNWRyBlbGVtZW50IGFuZFxuICAgKiByZXR1cm5zIGl0LiBSZXR1cm5zIG51bGwgaWYgbm8gbWF0Y2hpbmcgZWxlbWVudCBpcyBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KGljb25OYW1lOiBzdHJpbmcsIGljb25TZXRDb25maWdzOiBTdmdJY29uQ29uZmlnW10pOlxuICAgICAgU1ZHRWxlbWVudCB8IG51bGwge1xuICAgIC8vIEl0ZXJhdGUgYmFja3dhcmRzLCBzbyBpY29uIHNldHMgYWRkZWQgbGF0ZXIgaGF2ZSBwcmVjZWRlbmNlLlxuICAgIGZvciAobGV0IGkgPSBpY29uU2V0Q29uZmlncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY29uZmlnID0gaWNvblNldENvbmZpZ3NbaV07XG5cbiAgICAgIC8vIFBhcnNpbmcgdGhlIGljb24gc2V0J3MgdGV4dCBpbnRvIGFuIFNWRyBlbGVtZW50IGNhbiBiZSBleHBlbnNpdmUuIFdlIGNhbiBhdm9pZCBzb21lIG9mXG4gICAgICAvLyB0aGUgcGFyc2luZyBieSBkb2luZyBhIHF1aWNrIGNoZWNrIHVzaW5nIGBpbmRleE9mYCB0byBzZWUgaWYgdGhlcmUncyBhbnkgY2hhbmNlIGZvciB0aGVcbiAgICAgIC8vIGljb24gdG8gYmUgaW4gdGhlIHNldC4gVGhpcyB3b24ndCBiZSAxMDAlIGFjY3VyYXRlLCBidXQgaXQgc2hvdWxkIGhlbHAgdXMgYXZvaWQgYXQgbGVhc3RcbiAgICAgIC8vIHNvbWUgb2YgdGhlIHBhcnNpbmcuXG4gICAgICBpZiAoY29uZmlnLnN2Z1RleHQgJiYgY29uZmlnLnN2Z1RleHQuaW5kZXhPZihpY29uTmFtZSkgPiAtMSkge1xuICAgICAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbUNvbmZpZyhjb25maWcgYXMgTG9hZGVkU3ZnSWNvbkNvbmZpZyk7XG4gICAgICAgIGNvbnN0IGZvdW5kSWNvbiA9IHRoaXMuX2V4dHJhY3RTdmdJY29uRnJvbVNldChzdmcsIGljb25OYW1lLCBjb25maWcub3B0aW9ucyk7XG4gICAgICAgIGlmIChmb3VuZEljb24pIHtcbiAgICAgICAgICByZXR1cm4gZm91bmRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjb250ZW50IG9mIHRoZSBpY29uIFVSTCBzcGVjaWZpZWQgaW4gdGhlIFN2Z0ljb25Db25maWcgYW5kIGNyZWF0ZXMgYW4gU1ZHIGVsZW1lbnRcbiAgICogZnJvbSBpdC5cbiAgICovXG4gIHByaXZhdGUgX2xvYWRTdmdJY29uRnJvbUNvbmZpZyhjb25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZmV0Y2hJY29uKGNvbmZpZykucGlwZShcbiAgICAgIHRhcChzdmdUZXh0ID0+IGNvbmZpZy5zdmdUZXh0ID0gc3ZnVGV4dCksXG4gICAgICBtYXAoKCkgPT4gdGhpcy5fc3ZnRWxlbWVudEZyb21Db25maWcoY29uZmlnIGFzIExvYWRlZFN2Z0ljb25Db25maWcpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIGNvbnRlbnQgb2YgdGhlIGljb24gc2V0IFVSTCBzcGVjaWZpZWQgaW4gdGhlXG4gICAqIFN2Z0ljb25Db25maWcgYW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9sb2FkU3ZnSWNvblNldEZyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgaWYgKGNvbmZpZy5zdmdUZXh0KSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9mZXRjaEljb24oY29uZmlnKS5waXBlKHRhcChzdmdUZXh0ID0+IGNvbmZpZy5zdmdUZXh0ID0gc3ZnVGV4dCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIHRoZSBjYWNoZWQgZWxlbWVudCBvZiB0aGUgZ2l2ZW4gU3ZnSWNvbkNvbmZpZyBmb3IgYSBuZXN0ZWQgaWNvbiBlbGVtZW50IHdob3NlIFwiaWRcIlxuICAgKiB0YWcgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIG5hbWUuIElmIGZvdW5kLCBjb3BpZXMgdGhlIG5lc3RlZCBlbGVtZW50IHRvIGEgbmV3IFNWRyBlbGVtZW50IGFuZFxuICAgKiByZXR1cm5zIGl0LiBSZXR1cm5zIG51bGwgaWYgbm8gbWF0Y2hpbmcgZWxlbWVudCBpcyBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2V4dHJhY3RTdmdJY29uRnJvbVNldChpY29uU2V0OiBTVkdFbGVtZW50LCBpY29uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogU1ZHRWxlbWVudCB8IG51bGwge1xuICAgIC8vIFVzZSB0aGUgYGlkPVwiaWNvbk5hbWVcImAgc3ludGF4IGluIG9yZGVyIHRvIGVzY2FwZSBzcGVjaWFsXG4gICAgLy8gY2hhcmFjdGVycyBpbiB0aGUgSUQgKHZlcnN1cyB1c2luZyB0aGUgI2ljb25OYW1lIHN5bnRheCkuXG4gICAgY29uc3QgaWNvblNvdXJjZSA9IGljb25TZXQucXVlcnlTZWxlY3RvcihgW2lkPVwiJHtpY29uTmFtZX1cIl1gKTtcblxuICAgIGlmICghaWNvblNvdXJjZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xvbmUgdGhlIGVsZW1lbnQgYW5kIHJlbW92ZSB0aGUgSUQgdG8gcHJldmVudCBtdWx0aXBsZSBlbGVtZW50cyBmcm9tIGJlaW5nIGFkZGVkXG4gICAgLy8gdG8gdGhlIHBhZ2Ugd2l0aCB0aGUgc2FtZSBJRC5cbiAgICBjb25zdCBpY29uRWxlbWVudCA9IGljb25Tb3VyY2UuY2xvbmVOb2RlKHRydWUpIGFzIEVsZW1lbnQ7XG4gICAgaWNvbkVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuXG4gICAgLy8gSWYgdGhlIGljb24gbm9kZSBpcyBpdHNlbGYgYW4gPHN2Zz4gbm9kZSwgY2xvbmUgYW5kIHJldHVybiBpdCBkaXJlY3RseS4gSWYgbm90LCBzZXQgaXQgYXNcbiAgICAvLyB0aGUgY29udGVudCBvZiBhIG5ldyA8c3ZnPiBub2RlLlxuICAgIGlmIChpY29uRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXMoaWNvbkVsZW1lbnQgYXMgU1ZHRWxlbWVudCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG5vZGUgaXMgYSA8c3ltYm9sPiwgaXQgd29uJ3QgYmUgcmVuZGVyZWQgc28gd2UgaGF2ZSB0byBjb252ZXJ0IGl0IGludG8gPHN2Zz4uIE5vdGVcbiAgICAvLyB0aGF0IHRoZSBzYW1lIGNvdWxkIGJlIGFjaGlldmVkIGJ5IHJlZmVycmluZyB0byBpdCB2aWEgPHVzZSBocmVmPVwiI2lkXCI+LCBob3dldmVyIHRoZSA8dXNlPlxuICAgIC8vIHRhZyBpcyBwcm9ibGVtYXRpYyBvbiBGaXJlZm94LCBiZWNhdXNlIGl0IG5lZWRzIHRvIGluY2x1ZGUgdGhlIGN1cnJlbnQgcGFnZSBwYXRoLlxuICAgIGlmIChpY29uRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXModGhpcy5fdG9TdmdFbGVtZW50KGljb25FbGVtZW50KSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlRWxlbWVudCgnU1ZHJykgZG9lc24ndCB3b3JrIGFzIGV4cGVjdGVkOyB0aGUgRE9NIGVuZHMgdXAgd2l0aFxuICAgIC8vIHRoZSBjb3JyZWN0IG5vZGVzLCBidXQgdGhlIFNWRyBjb250ZW50IGRvZXNuJ3QgcmVuZGVyLiBJbnN0ZWFkIHdlXG4gICAgLy8gaGF2ZSB0byBjcmVhdGUgYW4gZW1wdHkgU1ZHIG5vZGUgdXNpbmcgaW5uZXJIVE1MIGFuZCBhcHBlbmQgaXRzIGNvbnRlbnQuXG4gICAgLy8gRWxlbWVudHMgY3JlYXRlZCB1c2luZyBET01QYXJzZXIucGFyc2VGcm9tU3RyaW5nIGhhdmUgdGhlIHNhbWUgcHJvYmxlbS5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIzMDAzMjc4L3N2Zy1pbm5lcmh0bWwtaW4tZmlyZWZveC1jYW4tbm90LWRpc3BsYXlcbiAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZygnPHN2Zz48L3N2Zz4nKTtcbiAgICAvLyBDbG9uZSB0aGUgbm9kZSBzbyB3ZSBkb24ndCByZW1vdmUgaXQgZnJvbSB0aGUgcGFyZW50IGljb24gc2V0IGVsZW1lbnQuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGljb25FbGVtZW50KTtcblxuICAgIHJldHVybiB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKHN2Zywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50IGZyb20gdGhlIGdpdmVuIFNWRyBzdHJpbmcuXG4gICAqL1xuICBwcml2YXRlIF9zdmdFbGVtZW50RnJvbVN0cmluZyhzdHI6IHN0cmluZyk6IFNWR0VsZW1lbnQge1xuICAgIGNvbnN0IGRpdiA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHI7XG4gICAgY29uc3Qgc3ZnID0gZGl2LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpIGFzIFNWR0VsZW1lbnQ7XG5cbiAgICAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgaWYgKCFzdmcpIHtcbiAgICAgIHRocm93IEVycm9yKCc8c3ZnPiB0YWcgbm90IGZvdW5kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbiBlbGVtZW50IGludG8gYW4gU1ZHIG5vZGUgYnkgY2xvbmluZyBhbGwgb2YgaXRzIGNoaWxkcmVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfdG9TdmdFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZygnPHN2Zz48L3N2Zz4nKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzO1xuXG4gICAgLy8gQ29weSBvdmVyIGFsbCB0aGUgYXR0cmlidXRlcyBmcm9tIHRoZSBgc3ltYm9sYCB0byB0aGUgbmV3IFNWRywgZXhjZXB0IHRoZSBpZC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHtuYW1lLCB2YWx1ZX0gPSBhdHRyaWJ1dGVzW2ldO1xuXG4gICAgICBpZiAobmFtZSAhPT0gJ2lkJykge1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGROb2Rlc1tpXS5ub2RlVHlwZSA9PT0gdGhpcy5fZG9jdW1lbnQuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChlbGVtZW50LmNoaWxkTm9kZXNbaV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgYXR0cmlidXRlcyBmb3IgYW4gU1ZHIGVsZW1lbnQgdG8gYmUgdXNlZCBhcyBhbiBpY29uLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0U3ZnQXR0cmlidXRlcyhzdmc6IFNWR0VsZW1lbnQsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IFNWR0VsZW1lbnQge1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpdCcsICcnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdmb2N1c2FibGUnLCAnZmFsc2UnKTsgLy8gRGlzYWJsZSBJRTExIGRlZmF1bHQgYmVoYXZpb3IgdG8gbWFrZSBTVkdzIGZvY3VzYWJsZS5cblxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudmlld0JveCkge1xuICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIG9wdGlvbnMudmlld0JveCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgd2hpY2ggcHJvZHVjZXMgdGhlIHN0cmluZyBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gaWNvbi4gUmVzdWx0cyBtYXkgYmVcbiAgICogY2FjaGVkLCBzbyBmdXR1cmUgY2FsbHMgd2l0aCB0aGUgc2FtZSBVUkwgbWF5IG5vdCBjYXVzZSBhbm90aGVyIEhUVFAgcmVxdWVzdC5cbiAgICovXG4gIHByaXZhdGUgX2ZldGNoSWNvbihpY29uQ29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICBjb25zdCB7dXJsOiBzYWZlVXJsLCBvcHRpb25zfSA9IGljb25Db25maWc7XG4gICAgY29uc3Qgd2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucz8ud2l0aENyZWRlbnRpYWxzID8/IGZhbHNlO1xuXG4gICAgaWYgKCF0aGlzLl9odHRwQ2xpZW50KSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uTm9IdHRwUHJvdmlkZXJFcnJvcigpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGFkZCBhbiBuZ0Rldk1vZGUgY2hlY2tcbiAgICBpZiAoc2FmZVVybCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZldGNoIGljb24gZnJvbSBVUkwgXCIke3NhZmVVcmx9XCIuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHNhZmVVcmwpO1xuXG4gICAgLy8gVE9ETzogYWRkIGFuIG5nRGV2TW9kZSBjaGVja1xuICAgIGlmICghdXJsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHNhZmVVcmwpO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIGluLXByb2dyZXNzIGZldGNoZXMgdG8gYXZvaWQgc2VuZGluZyBhIGR1cGxpY2F0ZSByZXF1ZXN0IGZvciBhIFVSTCB3aGVuIHRoZXJlIGlzXG4gICAgLy8gYWxyZWFkeSBhIHJlcXVlc3QgaW4gcHJvZ3Jlc3MgZm9yIHRoYXQgVVJMLiBJdCdzIG5lY2Vzc2FyeSB0byBjYWxsIHNoYXJlKCkgb24gdGhlXG4gICAgLy8gT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBodHRwLmdldCgpIHNvIHRoYXQgbXVsdGlwbGUgc3Vic2NyaWJlcnMgZG9uJ3QgY2F1c2UgbXVsdGlwbGUgWEhScy5cbiAgICBjb25zdCBpblByb2dyZXNzRmV0Y2ggPSB0aGlzLl9pblByb2dyZXNzVXJsRmV0Y2hlcy5nZXQodXJsKTtcblxuICAgIGlmIChpblByb2dyZXNzRmV0Y2gpIHtcbiAgICAgIHJldHVybiBpblByb2dyZXNzRmV0Y2g7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxID0gdGhpcy5faHR0cENsaWVudC5nZXQodXJsLCB7cmVzcG9uc2VUeXBlOiAndGV4dCcsIHdpdGhDcmVkZW50aWFsc30pLnBpcGUoXG4gICAgICBmaW5hbGl6ZSgoKSA9PiB0aGlzLl9pblByb2dyZXNzVXJsRmV0Y2hlcy5kZWxldGUodXJsKSksXG4gICAgICBzaGFyZSgpLFxuICAgICk7XG5cbiAgICB0aGlzLl9pblByb2dyZXNzVXJsRmV0Y2hlcy5zZXQodXJsLCByZXEpO1xuICAgIHJldHVybiByZXE7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gY29uZmlnIGJ5IG5hbWUgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBpY29uIGNvbmZpZy5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGNvbmZpZy5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHByaXZhdGUgX2FkZFN2Z0ljb25Db25maWcobmFtZXNwYWNlOiBzdHJpbmcsIGljb25OYW1lOiBzdHJpbmcsIGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IHRoaXMge1xuICAgIHRoaXMuX3N2Z0ljb25Db25maWdzLnNldChpY29uS2V5KG5hbWVzcGFjZSwgaWNvbk5hbWUpLCBjb25maWcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCBjb25maWcgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBpY29uIGNvbmZpZy5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHByaXZhdGUgX2FkZFN2Z0ljb25TZXRDb25maWcobmFtZXNwYWNlOiBzdHJpbmcsIGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IHRoaXMge1xuICAgIGNvbnN0IGNvbmZpZ05hbWVzcGFjZSA9IHRoaXMuX2ljb25TZXRDb25maWdzLmdldChuYW1lc3BhY2UpO1xuXG4gICAgaWYgKGNvbmZpZ05hbWVzcGFjZSkge1xuICAgICAgY29uZmlnTmFtZXNwYWNlLnB1c2goY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faWNvblNldENvbmZpZ3Muc2V0KG5hbWVzcGFjZSwgW2NvbmZpZ10pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFBhcnNlcyBhIGNvbmZpZydzIHRleHQgaW50byBhbiBTVkcgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfc3ZnRWxlbWVudEZyb21Db25maWcoY29uZmlnOiBMb2FkZWRTdmdJY29uQ29uZmlnKTogU1ZHRWxlbWVudCB7XG4gICAgaWYgKCFjb25maWcuc3ZnRWxlbWVudCkge1xuICAgICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcoY29uZmlnLnN2Z1RleHQpO1xuICAgICAgdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyhzdmcsIGNvbmZpZy5vcHRpb25zKTtcbiAgICAgIGNvbmZpZy5zdmdFbGVtZW50ID0gc3ZnO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWcuc3ZnRWxlbWVudDtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIElDT05fUkVHSVNUUllfUFJPVklERVJfRkFDVE9SWShcbiAgcGFyZW50UmVnaXN0cnk6IE1hdEljb25SZWdpc3RyeSxcbiAgaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBkb2N1bWVudD86IGFueSkge1xuICByZXR1cm4gcGFyZW50UmVnaXN0cnkgfHwgbmV3IE1hdEljb25SZWdpc3RyeShodHRwQ2xpZW50LCBzYW5pdGl6ZXIsIGRvY3VtZW50LCBlcnJvckhhbmRsZXIpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IElDT05fUkVHSVNUUllfUFJPVklERVIgPSB7XG4gIC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYW4gTWF0SWNvblJlZ2lzdHJ5IGF2YWlsYWJsZSwgdXNlIHRoYXQuIE90aGVyd2lzZSwgcHJvdmlkZSBhIG5ldyBvbmUuXG4gIHByb3ZpZGU6IE1hdEljb25SZWdpc3RyeSxcbiAgZGVwczogW1xuICAgIFtuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdEljb25SZWdpc3RyeV0sXG4gICAgW25ldyBPcHRpb25hbCgpLCBIdHRwQ2xpZW50XSxcbiAgICBEb21TYW5pdGl6ZXIsXG4gICAgRXJyb3JIYW5kbGVyLFxuICAgIFtuZXcgT3B0aW9uYWwoKSwgRE9DVU1FTlQgYXMgSW5qZWN0aW9uVG9rZW48YW55Pl0sXG4gIF0sXG4gIHVzZUZhY3Rvcnk6IElDT05fUkVHSVNUUllfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cbi8qKiBDbG9uZXMgYW4gU1ZHRWxlbWVudCB3aGlsZSBwcmVzZXJ2aW5nIHR5cGUgaW5mb3JtYXRpb24uICovXG5mdW5jdGlvbiBjbG9uZVN2Zyhzdmc6IFNWR0VsZW1lbnQpOiBTVkdFbGVtZW50IHtcbiAgcmV0dXJuIHN2Zy5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHRWxlbWVudDtcbn1cblxuLyoqIFJldHVybnMgdGhlIGNhY2hlIGtleSB0byB1c2UgZm9yIGFuIGljb24gbmFtZXNwYWNlIGFuZCBuYW1lLiAqL1xuZnVuY3Rpb24gaWNvbktleShuYW1lc3BhY2U6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBuYW1lc3BhY2UgKyAnOicgKyBuYW1lO1xufVxuIl19