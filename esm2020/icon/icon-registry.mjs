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
import { trustedHTMLFromString } from './trusted-types';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@angular/platform-browser";
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
        /** Registered icon resolver functions. */
        this._resolvers = [];
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
     * Registers an icon resolver function with the registry. The function will be invoked with the
     * name and namespace of an icon when the registry tries to resolve the URL from which to fetch
     * the icon. The resolver is expected to return a `SafeResourceUrl` that points to the icon,
     * an object with the icon URL and icon options, or `null` if the icon is not supported. Resolvers
     * will be invoked in the order in which they have been registered.
     * @param resolver Resolver function to be registered.
     */
    addSvgIconResolver(resolver) {
        this._resolvers.push(resolver);
        return this;
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
        // Security: The literal is passed in as SafeHtml, and is thus trusted.
        const trustedLiteral = trustedHTMLFromString(cleanLiteral);
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig('', trustedLiteral, options));
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
        // Security: The literal is passed in as SafeHtml, and is thus trusted.
        const trustedLiteral = trustedHTMLFromString(cleanLiteral);
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig('', trustedLiteral, options));
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
        const key = iconKey(namespace, name);
        let config = this._svgIconConfigs.get(key);
        // Return (copy of) cached icon if possible.
        if (config) {
            return this._getSvgFromConfig(config);
        }
        // Otherwise try to resolve the config from one of the resolver functions.
        config = this._getIconConfigFromResolvers(namespace, name);
        if (config) {
            this._svgIconConfigs.set(key, config);
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
        this._resolvers = [];
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
            if (config.svgText && config.svgText.toString().indexOf(iconName) > -1) {
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
        const svg = this._svgElementFromString(trustedHTMLFromString('<svg></svg>'));
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
        const svg = this._svgElementFromString(trustedHTMLFromString('<svg></svg>'));
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
        const { url: safeUrl, options } = iconConfig;
        const withCredentials = options?.withCredentials ?? false;
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
        const req = this._httpClient.get(url, { responseType: 'text', withCredentials }).pipe(map(svg => {
            // Security: This SVG is fetched from a SafeResourceUrl, and is thus
            // trusted HTML.
            return trustedHTMLFromString(svg);
        }), finalize(() => this._inProgressUrlFetches.delete(url)), share());
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
    /** Tries to create an icon config through the registered resolver functions. */
    _getIconConfigFromResolvers(namespace, name) {
        for (let i = 0; i < this._resolvers.length; i++) {
            const result = this._resolvers[i](name, namespace);
            if (result) {
                return isSafeUrlWithOptions(result) ?
                    new SvgIconConfig(result.url, null, result.options) :
                    new SvgIconConfig(result, null);
            }
        }
        return undefined;
    }
}
MatIconRegistry.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatIconRegistry, deps: [{ token: i1.HttpClient, optional: true }, { token: i2.DomSanitizer }, { token: DOCUMENT, optional: true }, { token: i0.ErrorHandler }], target: i0.ɵɵFactoryTarget.Injectable });
MatIconRegistry.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatIconRegistry, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatIconRegistry, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient, decorators: [{
                    type: Optional
                }] }, { type: i2.DomSanitizer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ErrorHandler }]; } });
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
function isSafeUrlWithOptions(value) {
    return !!(value.url && value.options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQW9CLE1BQU0sc0JBQXNCLENBQUM7QUFDbkUsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUVWLFFBQVEsRUFDUixlQUFlLEVBQ2YsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxZQUFZLEVBQTRCLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFFBQVEsRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0YsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRSxPQUFPLEVBQWMscUJBQXFCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUduRTs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQixDQUFDLFFBQWdCO0lBQzFELE9BQU8sS0FBSyxDQUFDLHNDQUFzQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFHRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLDZCQUE2QjtJQUMzQyxPQUFPLEtBQUssQ0FBQywwRUFBMEU7UUFDMUUsd0VBQXdFO1FBQ3hFLGNBQWMsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFHRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGtDQUFrQyxDQUFDLEdBQW9CO0lBQ3JFLE9BQU8sS0FBSyxDQUFDLHdFQUF3RTtRQUN4RSxrREFBa0QsR0FBRyxJ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QUFvQixDQUFDLEtBQVU7SUFDdEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBFcnJvclJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBFcnJvckhhbmRsZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9wdGlvbmFsLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIFNraXBTZWxmLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEb21TYW5pdGl6ZXIsIFNhZmVSZXNvdXJjZVVybCwgU2FmZUh0bWx9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtmb3JrSm9pbiwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd30gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIGZpbmFsaXplLCBtYXAsIHNoYXJlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VHJ1c3RlZEhUTUwsIHRydXN0ZWRIVE1MRnJvbVN0cmluZ30gZnJvbSAnLi90cnVzdGVkLXR5cGVzJztcblxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biBpbiB0aGUgY2FzZSB3aGVuIGF0dGVtcHRpbmcgdG9cbiAqIGxvYWQgYW4gaWNvbiB3aXRoIGEgbmFtZSB0aGF0IGNhbm5vdCBiZSBmb3VuZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEljb25OYW1lTm90Rm91bmRFcnJvcihpY29uTmFtZTogc3RyaW5nKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYFVuYWJsZSB0byBmaW5kIGljb24gd2l0aCB0aGUgbmFtZSBcIiR7aWNvbk5hbWV9XCJgKTtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIHRoZSBjb25zdW1lciBhdHRlbXB0cyB0byB1c2VcbiAqIGA8bWF0LWljb24+YCB3aXRob3V0IGluY2x1ZGluZyBAYW5ndWxhci9jb21tb24vaHR0cC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEljb25Ob0h0dHBQcm92aWRlckVycm9yKCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKCdDb3VsZCBub3QgZmluZCBIdHRwQ2xpZW50IHByb3ZpZGVyIGZvciB1c2Ugd2l0aCBBbmd1bGFyIE1hdGVyaWFsIGljb25zLiAnICtcbiAgICAgICAgICAgICAgICdQbGVhc2UgaW5jbHVkZSB0aGUgSHR0cENsaWVudE1vZHVsZSBmcm9tIEBhbmd1bGFyL2NvbW1vbi9odHRwIGluIHlvdXIgJyArXG4gICAgICAgICAgICAgICAnYXBwIGltcG9ydHMuJyk7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gd2hlbiBhIFVSTCBjb3VsZG4ndCBiZSBzYW5pdGl6ZWQuXG4gKiBAcGFyYW0gdXJsIFVSTCB0aGF0IHdhcyBhdHRlbXB0ZWQgdG8gYmUgc2FuaXRpemVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVVcmxFcnJvcih1cmw6IFNhZmVSZXNvdXJjZVVybCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBUaGUgVVJMIHByb3ZpZGVkIHRvIE1hdEljb25SZWdpc3RyeSB3YXMgbm90IHRydXN0ZWQgYXMgYSByZXNvdXJjZSBVUkwgYCArXG4gICAgICAgICAgICAgICBgdmlhIEFuZ3VsYXIncyBEb21TYW5pdGl6ZXIuIEF0dGVtcHRlZCBVUkwgd2FzIFwiJHt1cmx9XCIuYCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gYSBIVE1MIHN0cmluZyBjb3VsZG4ndCBiZSBzYW5pdGl6ZWQuXG4gKiBAcGFyYW0gbGl0ZXJhbCBIVE1MIHRoYXQgd2FzIGF0dGVtcHRlZCB0byBiZSBzYW5pdGl6ZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZUxpdGVyYWxFcnJvcihsaXRlcmFsOiBTYWZlSHRtbCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBUaGUgbGl0ZXJhbCBwcm92aWRlZCB0byBNYXRJY29uUmVnaXN0cnkgd2FzIG5vdCB0cnVzdGVkIGFzIHNhZmUgSFRNTCBieSBgICtcbiAgICAgICAgICAgICAgIGBBbmd1bGFyJ3MgRG9tU2FuaXRpemVyLiBBdHRlbXB0ZWQgbGl0ZXJhbCB3YXMgXCIke2xpdGVyYWx9XCIuYCk7XG59XG5cbi8qKiBPcHRpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIGhvdyBhbiBpY29uIG9yIHRoZSBpY29ucyBpbiBhbiBpY29uIHNldCBhcmUgcHJlc2VudGVkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJY29uT3B0aW9ucyB7XG4gIC8qKiBWaWV3IGJveCB0byBzZXQgb24gdGhlIGljb24uICovXG4gIHZpZXdCb3g/OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRvIGZldGNoIHRoZSBpY29uIG9yIGljb24gc2V0IHVzaW5nIEhUVFAgY3JlZGVudGlhbHMuICovXG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgYnkgdGhlIGljb24gcmVnaXN0cnkgd2hlbiB0cnlpbmcgdG8gcmVzb2x2ZSB0aGVcbiAqIFVSTCBmcm9tIHdoaWNoIHRvIGZldGNoIGFuIGljb24uIFRoZSByZXR1cm5lZCBVUkwgd2lsbCBiZSB1c2VkIHRvIG1ha2UgYSByZXF1ZXN0IGZvciB0aGUgaWNvbi5cbiAqL1xuZXhwb3J0IHR5cGUgSWNvblJlc29sdmVyID0gKG5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcpID0+XG4gICAgKFNhZmVSZXNvdXJjZVVybCB8IFNhZmVSZXNvdXJjZVVybFdpdGhJY29uT3B0aW9ucyB8IG51bGwpO1xuXG4vKiogT2JqZWN0IHRoYXQgc3BlY2lmaWVzIGEgVVJMIGZyb20gd2hpY2ggdG8gZmV0Y2ggYW4gaWNvbiBhbmQgdGhlIG9wdGlvbnMgdG8gdXNlIGZvciBpdC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZVJlc291cmNlVXJsV2l0aEljb25PcHRpb25zIHtcbiAgdXJsOiBTYWZlUmVzb3VyY2VVcmw7XG4gIG9wdGlvbnM6IEljb25PcHRpb25zO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGFuIGljb24sIGluY2x1ZGluZyB0aGUgVVJMIGFuZCBwb3NzaWJseSB0aGUgY2FjaGVkIFNWRyBlbGVtZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jbGFzcyBTdmdJY29uQ29uZmlnIHtcbiAgc3ZnRWxlbWVudDogU1ZHRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHVybDogU2FmZVJlc291cmNlVXJsLFxuICAgIHB1YmxpYyBzdmdUZXh0OiBUcnVzdGVkSFRNTCB8IG51bGwsXG4gICAgcHVibGljIG9wdGlvbnM/OiBJY29uT3B0aW9ucykge31cbn1cblxuLyoqIEljb24gY29uZmlndXJhdGlvbiB3aG9zZSBjb250ZW50IGhhcyBhbHJlYWR5IGJlZW4gbG9hZGVkLiAqL1xudHlwZSBMb2FkZWRTdmdJY29uQ29uZmlnID0gU3ZnSWNvbkNvbmZpZyAmIHtzdmdUZXh0OiBUcnVzdGVkSFRNTH07XG5cbi8qKlxuICogU2VydmljZSB0byByZWdpc3RlciBhbmQgZGlzcGxheSBpY29ucyB1c2VkIGJ5IHRoZSBgPG1hdC1pY29uPmAgY29tcG9uZW50LlxuICogLSBSZWdpc3RlcnMgaWNvbiBVUkxzIGJ5IG5hbWVzcGFjZSBhbmQgbmFtZS5cbiAqIC0gUmVnaXN0ZXJzIGljb24gc2V0IFVSTHMgYnkgbmFtZXNwYWNlLlxuICogLSBSZWdpc3RlcnMgYWxpYXNlcyBmb3IgQ1NTIGNsYXNzZXMsIGZvciB1c2Ugd2l0aCBpY29uIGZvbnRzLlxuICogLSBMb2FkcyBpY29ucyBmcm9tIFVSTHMgYW5kIGV4dHJhY3RzIGluZGl2aWR1YWwgaWNvbnMgZnJvbSBpY29uIHNldHMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdEljb25SZWdpc3RyeSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKipcbiAgICogVVJMcyBhbmQgY2FjaGVkIFNWRyBlbGVtZW50cyBmb3IgaW5kaXZpZHVhbCBpY29ucy4gS2V5cyBhcmUgb2YgdGhlIGZvcm1hdCBcIltuYW1lc3BhY2VdOltpY29uXVwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3ZnSWNvbkNvbmZpZ3MgPSBuZXcgTWFwPHN0cmluZywgU3ZnSWNvbkNvbmZpZz4oKTtcblxuICAvKipcbiAgICogU3ZnSWNvbkNvbmZpZyBvYmplY3RzIGFuZCBjYWNoZWQgU1ZHIGVsZW1lbnRzIGZvciBpY29uIHNldHMsIGtleWVkIGJ5IG5hbWVzcGFjZS5cbiAgICogTXVsdGlwbGUgaWNvbiBzZXRzIGNhbiBiZSByZWdpc3RlcmVkIHVuZGVyIHRoZSBzYW1lIG5hbWVzcGFjZS5cbiAgICovXG4gIHByaXZhdGUgX2ljb25TZXRDb25maWdzID0gbmV3IE1hcDxzdHJpbmcsIFN2Z0ljb25Db25maWdbXT4oKTtcblxuICAvKiogQ2FjaGUgZm9yIGljb25zIGxvYWRlZCBieSBkaXJlY3QgVVJMcy4gKi9cbiAgcHJpdmF0ZSBfY2FjaGVkSWNvbnNCeVVybCA9IG5ldyBNYXA8c3RyaW5nLCBTVkdFbGVtZW50PigpO1xuXG4gIC8qKiBJbi1wcm9ncmVzcyBpY29uIGZldGNoZXMuIFVzZWQgdG8gY29hbGVzY2UgbXVsdGlwbGUgcmVxdWVzdHMgdG8gdGhlIHNhbWUgVVJMLiAqL1xuICBwcml2YXRlIF9pblByb2dyZXNzVXJsRmV0Y2hlcyA9IG5ldyBNYXA8c3RyaW5nLCBPYnNlcnZhYmxlPFRydXN0ZWRIVE1MPj4oKTtcblxuICAvKiogTWFwIGZyb20gZm9udCBpZGVudGlmaWVycyB0byB0aGVpciBDU1MgY2xhc3MgbmFtZXMuIFVzZWQgZm9yIGljb24gZm9udHMuICovXG4gIHByaXZhdGUgX2ZvbnRDc3NDbGFzc2VzQnlBbGlhcyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbiAgLyoqIFJlZ2lzdGVyZWQgaWNvbiByZXNvbHZlciBmdW5jdGlvbnMuICovXG4gIHByaXZhdGUgX3Jlc29sdmVyczogSWNvblJlc29sdmVyW10gPSBbXTtcblxuICAvKipcbiAgICogVGhlIENTUyBjbGFzcyB0byBhcHBseSB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgaGFzIG5vIGljb24gbmFtZSwgdXJsLCBvciBmb250IHNwZWNpZmllZC5cbiAgICogVGhlIGRlZmF1bHQgJ21hdGVyaWFsLWljb25zJyB2YWx1ZSBhc3N1bWVzIHRoYXQgdGhlIG1hdGVyaWFsIGljb24gZm9udCBoYXMgYmVlbiBsb2FkZWQgYXNcbiAgICogZGVzY3JpYmVkIGF0IGh0dHA6Ly9nb29nbGUuZ2l0aHViLmlvL21hdGVyaWFsLWRlc2lnbi1pY29ucy8jaWNvbi1mb250LWZvci10aGUtd2ViXG4gICAqL1xuICBwcml2YXRlIF9kZWZhdWx0Rm9udFNldENsYXNzID0gJ21hdGVyaWFsLWljb25zJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9odHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgX3Nhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBieSBVUkwgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHVybFxuICAgKi9cbiAgYWRkU3ZnSWNvbihpY29uTmFtZTogc3RyaW5nLCB1cmw6IFNhZmVSZXNvdXJjZVVybCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvbkluTmFtZXNwYWNlKCcnLCBpY29uTmFtZSwgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uLlxuICAgKi9cbiAgYWRkU3ZnSWNvbkxpdGVyYWwoaWNvbk5hbWU6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UoJycsIGljb25OYW1lLCBsaXRlcmFsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBieSBVUkwgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHVybFxuICAgKi9cbiAgYWRkU3ZnSWNvbkluTmFtZXNwYWNlKG5hbWVzcGFjZTogc3RyaW5nLCBpY29uTmFtZTogc3RyaW5nLCB1cmw6IFNhZmVSZXNvdXJjZVVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uQ29uZmlnKG5hbWVzcGFjZSwgaWNvbk5hbWUsIG5ldyBTdmdJY29uQ29uZmlnKHVybCwgbnVsbCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHJlc29sdmVyIGZ1bmN0aW9uIHdpdGggdGhlIHJlZ2lzdHJ5LiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIHdpdGggdGhlXG4gICAqIG5hbWUgYW5kIG5hbWVzcGFjZSBvZiBhbiBpY29uIHdoZW4gdGhlIHJlZ2lzdHJ5IHRyaWVzIHRvIHJlc29sdmUgdGhlIFVSTCBmcm9tIHdoaWNoIHRvIGZldGNoXG4gICAqIHRoZSBpY29uLiBUaGUgcmVzb2x2ZXIgaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGEgYFNhZmVSZXNvdXJjZVVybGAgdGhhdCBwb2ludHMgdG8gdGhlIGljb24sXG4gICAqIGFuIG9iamVjdCB3aXRoIHRoZSBpY29uIFVSTCBhbmQgaWNvbiBvcHRpb25zLCBvciBgbnVsbGAgaWYgdGhlIGljb24gaXMgbm90IHN1cHBvcnRlZC4gUmVzb2x2ZXJzXG4gICAqIHdpbGwgYmUgaW52b2tlZCBpbiB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSBoYXZlIGJlZW4gcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHJlc29sdmVyIFJlc29sdmVyIGZ1bmN0aW9uIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBhZGRTdmdJY29uUmVzb2x2ZXIocmVzb2x2ZXI6IEljb25SZXNvbHZlcik6IHRoaXMge1xuICAgIHRoaXMuX3Jlc29sdmVycy5wdXNoKHJlc29sdmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uLlxuICAgKi9cbiAgYWRkU3ZnSWNvbkxpdGVyYWxJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgaWNvbk5hbWU6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgY29uc3QgY2xlYW5MaXRlcmFsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCBsaXRlcmFsKTtcblxuICAgIC8vIFRPRE86IGFkZCBhbiBuZ0Rldk1vZGUgY2hlY2tcbiAgICBpZiAoIWNsZWFuTGl0ZXJhbCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVMaXRlcmFsRXJyb3IobGl0ZXJhbCk7XG4gICAgfVxuXG4gICAgLy8gU2VjdXJpdHk6IFRoZSBsaXRlcmFsIGlzIHBhc3NlZCBpbiBhcyBTYWZlSHRtbCwgYW5kIGlzIHRodXMgdHJ1c3RlZC5cbiAgICBjb25zdCB0cnVzdGVkTGl0ZXJhbCA9IHRydXN0ZWRIVE1MRnJvbVN0cmluZyhjbGVhbkxpdGVyYWwpO1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uQ29uZmlnKG5hbWVzcGFjZSwgaWNvbk5hbWUsXG4gICAgICAgIG5ldyBTdmdJY29uQ29uZmlnKCcnLCB0cnVzdGVkTGl0ZXJhbCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCBieSBVUkwgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uU2V0KHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UoJycsIHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIGxpdGVyYWwgU1ZHIHNvdXJjZSBvZiB0aGUgaWNvbiBzZXQuXG4gICAqL1xuICBhZGRTdmdJY29uU2V0TGl0ZXJhbChsaXRlcmFsOiBTYWZlSHRtbCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvblNldExpdGVyYWxJbk5hbWVzcGFjZSgnJywgbGl0ZXJhbCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGJ5IFVSTCBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gc2V0LlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UobmFtZXNwYWNlOiBzdHJpbmcsIHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2UsIG5ldyBTdmdJY29uQ29uZmlnKHVybCwgbnVsbCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gc2V0LlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uIHNldC5cbiAgICovXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsSW5OYW1lc3BhY2UobmFtZXNwYWNlOiBzdHJpbmcsIGxpdGVyYWw6IFNhZmVIdG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIGNvbnN0IGNsZWFuTGl0ZXJhbCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgbGl0ZXJhbCk7XG5cbiAgICBpZiAoIWNsZWFuTGl0ZXJhbCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVMaXRlcmFsRXJyb3IobGl0ZXJhbCk7XG4gICAgfVxuXG4gICAgLy8gU2VjdXJpdHk6IFRoZSBsaXRlcmFsIGlzIHBhc3NlZCBpbiBhcyBTYWZlSHRtbCwgYW5kIGlzIHRodXMgdHJ1c3RlZC5cbiAgICBjb25zdCB0cnVzdGVkTGl0ZXJhbCA9IHRydXN0ZWRIVE1MRnJvbVN0cmluZyhjbGVhbkxpdGVyYWwpO1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZSwgbmV3IFN2Z0ljb25Db25maWcoJycsIHRydXN0ZWRMaXRlcmFsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBhbGlhcyBmb3IgYSBDU1MgY2xhc3MgbmFtZSB0byBiZSB1c2VkIGZvciBpY29uIGZvbnRzLiBDcmVhdGluZyBhbiBtYXRJY29uXG4gICAqIGNvbXBvbmVudCB3aXRoIHRoZSBhbGlhcyBhcyB0aGUgZm9udFNldCBpbnB1dCB3aWxsIGNhdXNlIHRoZSBjbGFzcyBuYW1lIHRvIGJlIGFwcGxpZWRcbiAgICogdG8gdGhlIGA8bWF0LWljb24+YCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gYWxpYXMgQWxpYXMgZm9yIHRoZSBmb250LlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIENsYXNzIG5hbWUgb3ZlcnJpZGUgdG8gYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSBhbGlhcy5cbiAgICovXG4gIHJlZ2lzdGVyRm9udENsYXNzQWxpYXMoYWxpYXM6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcgPSBhbGlhcyk6IHRoaXMge1xuICAgIHRoaXMuX2ZvbnRDc3NDbGFzc2VzQnlBbGlhcy5zZXQoYWxpYXMsIGNsYXNzTmFtZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQ1NTIGNsYXNzIG5hbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBhbGlhcyBieSBhIHByZXZpb3VzIGNhbGwgdG9cbiAgICogcmVnaXN0ZXJGb250Q2xhc3NBbGlhcy4gSWYgbm8gQ1NTIGNsYXNzIGhhcyBiZWVuIGFzc29jaWF0ZWQsIHJldHVybnMgdGhlIGFsaWFzIHVubW9kaWZpZWQuXG4gICAqL1xuICBjbGFzc05hbWVGb3JGb250QWxpYXMoYWxpYXM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvbnRDc3NDbGFzc2VzQnlBbGlhcy5nZXQoYWxpYXMpIHx8IGFsaWFzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIENTUyBjbGFzcyBuYW1lIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMgd2hlbiBhbiBgPG1hdC1pY29uPmAgY29tcG9uZW50IGRvZXMgbm90XG4gICAqIGhhdmUgYSBmb250U2V0IGlucHV0IHZhbHVlLCBhbmQgaXMgbm90IGxvYWRpbmcgYW4gaWNvbiBieSBuYW1lIG9yIFVSTC5cbiAgICpcbiAgICogQHBhcmFtIGNsYXNzTmFtZVxuICAgKi9cbiAgc2V0RGVmYXVsdEZvbnRTZXRDbGFzcyhjbGFzc05hbWU6IHN0cmluZyk6IHRoaXMge1xuICAgIHRoaXMuX2RlZmF1bHRGb250U2V0Q2xhc3MgPSBjbGFzc05hbWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQ1NTIGNsYXNzIG5hbWUgdG8gYmUgdXNlZCBmb3IgaWNvbiBmb250cyB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgZG9lcyBub3RcbiAgICogaGF2ZSBhIGZvbnRTZXQgaW5wdXQgdmFsdWUsIGFuZCBpcyBub3QgbG9hZGluZyBhbiBpY29uIGJ5IG5hbWUgb3IgVVJMLlxuICAgKi9cbiAgZ2V0RGVmYXVsdEZvbnRTZXRDbGFzcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0Rm9udFNldENsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHByb2R1Y2VzIHRoZSBpY29uIChhcyBhbiBgPHN2Zz5gIERPTSBlbGVtZW50KSBmcm9tIHRoZSBnaXZlbiBVUkwuXG4gICAqIFRoZSByZXNwb25zZSBmcm9tIHRoZSBVUkwgbWF5IGJlIGNhY2hlZCBzbyB0aGlzIHdpbGwgbm90IGFsd2F5cyBjYXVzZSBhbiBIVFRQIHJlcXVlc3QsIGJ1dFxuICAgKiB0aGUgcHJvZHVjZWQgZWxlbWVudCB3aWxsIGFsd2F5cyBiZSBhIG5ldyBjb3B5IG9mIHRoZSBvcmlnaW5hbGx5IGZldGNoZWQgaWNvbi4gKFRoYXQgaXMsXG4gICAqIGl0IHdpbGwgbm90IGNvbnRhaW4gYW55IG1vZGlmaWNhdGlvbnMgbWFkZSB0byBlbGVtZW50cyBwcmV2aW91c2x5IHJldHVybmVkKS5cbiAgICpcbiAgICogQHBhcmFtIHNhZmVVcmwgVVJMIGZyb20gd2hpY2ggdG8gZmV0Y2ggdGhlIFNWRyBpY29uLlxuICAgKi9cbiAgZ2V0U3ZnSWNvbkZyb21Vcmwoc2FmZVVybDogU2FmZVJlc291cmNlVXJsKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHNhZmVVcmwpO1xuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplVXJsRXJyb3Ioc2FmZVVybCk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FjaGVkSWNvbiA9IHRoaXMuX2NhY2hlZEljb25zQnlVcmwuZ2V0KHVybCk7XG5cbiAgICBpZiAoY2FjaGVkSWNvbikge1xuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjbG9uZVN2ZyhjYWNoZWRJY29uKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2xvYWRTdmdJY29uRnJvbUNvbmZpZyhuZXcgU3ZnSWNvbkNvbmZpZyhzYWZlVXJsLCBudWxsKSkucGlwZShcbiAgICAgIHRhcChzdmcgPT4gdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5zZXQodXJsISwgc3ZnKSksXG4gICAgICBtYXAoc3ZnID0+IGNsb25lU3ZnKHN2ZykpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgcHJvZHVjZXMgdGhlIGljb24gKGFzIGFuIGA8c3ZnPmAgRE9NIGVsZW1lbnQpIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICogYW5kIG5hbWVzcGFjZS4gVGhlIGljb24gbXVzdCBoYXZlIGJlZW4gcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggYWRkSWNvbiBvciBhZGRJY29uU2V0O1xuICAgKiBpZiBub3QsIHRoZSBPYnNlcnZhYmxlIHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGljb24gdG8gYmUgcmV0cmlldmVkLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byBsb29rIGZvciB0aGUgaWNvbi5cbiAgICovXG4gIGdldE5hbWVkU3ZnSWNvbihuYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nID0gJycpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICBjb25zdCBrZXkgPSBpY29uS2V5KG5hbWVzcGFjZSwgbmFtZSk7XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuX3N2Z0ljb25Db25maWdzLmdldChrZXkpO1xuXG4gICAgLy8gUmV0dXJuIChjb3B5IG9mKSBjYWNoZWQgaWNvbiBpZiBwb3NzaWJsZS5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0U3ZnRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSB0cnkgdG8gcmVzb2x2ZSB0aGUgY29uZmlnIGZyb20gb25lIG9mIHRoZSByZXNvbHZlciBmdW5jdGlvbnMuXG4gICAgY29uZmlnID0gdGhpcy5fZ2V0SWNvbkNvbmZpZ0Zyb21SZXNvbHZlcnMobmFtZXNwYWNlLCBuYW1lKTtcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuX3N2Z0ljb25Db25maWdzLnNldChrZXksIGNvbmZpZyk7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0U3ZnRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIC8vIFNlZSBpZiB3ZSBoYXZlIGFueSBpY29uIHNldHMgcmVnaXN0ZXJlZCBmb3IgdGhlIG5hbWVzcGFjZS5cbiAgICBjb25zdCBpY29uU2V0Q29uZmlncyA9IHRoaXMuX2ljb25TZXRDb25maWdzLmdldChuYW1lc3BhY2UpO1xuXG4gICAgaWYgKGljb25TZXRDb25maWdzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0U3ZnRnJvbUljb25TZXRDb25maWdzKG5hbWUsIGljb25TZXRDb25maWdzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93KGdldE1hdEljb25OYW1lTm90Rm91bmRFcnJvcihrZXkpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc29sdmVycyA9IFtdO1xuICAgIHRoaXMuX3N2Z0ljb25Db25maWdzLmNsZWFyKCk7XG4gICAgdGhpcy5faWNvblNldENvbmZpZ3MuY2xlYXIoKTtcbiAgICB0aGlzLl9jYWNoZWRJY29uc0J5VXJsLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY2FjaGVkIGljb24gZm9yIGEgU3ZnSWNvbkNvbmZpZyBpZiBhdmFpbGFibGUsIG9yIGZldGNoZXMgaXQgZnJvbSBpdHMgVVJMIGlmIG5vdC5cbiAgICovXG4gIHByaXZhdGUgX2dldFN2Z0Zyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgaWYgKGNvbmZpZy5zdmdUZXh0KSB7XG4gICAgICAvLyBXZSBhbHJlYWR5IGhhdmUgdGhlIFNWRyBlbGVtZW50IGZvciB0aGlzIGljb24sIHJldHVybiBhIGNvcHkuXG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGNsb25lU3ZnKHRoaXMuX3N2Z0VsZW1lbnRGcm9tQ29uZmlnKGNvbmZpZyBhcyBMb2FkZWRTdmdJY29uQ29uZmlnKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGZXRjaCB0aGUgaWNvbiBmcm9tIHRoZSBjb25maWcncyBVUkwsIGNhY2hlIGl0LCBhbmQgcmV0dXJuIGEgY29weS5cbiAgICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvbkZyb21Db25maWcoY29uZmlnKS5waXBlKG1hcChzdmcgPT4gY2xvbmVTdmcoc3ZnKSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBmaW5kIGFuIGljb24gd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgaW4gYW55IG9mIHRoZSBTVkcgaWNvbiBzZXRzLlxuICAgKiBGaXJzdCBzZWFyY2hlcyB0aGUgYXZhaWxhYmxlIGNhY2hlZCBpY29ucyBmb3IgYSBuZXN0ZWQgZWxlbWVudCB3aXRoIGEgbWF0Y2hpbmcgbmFtZSwgYW5kXG4gICAqIGlmIGZvdW5kIGNvcGllcyB0aGUgZWxlbWVudCB0byBhIG5ldyBgPHN2Zz5gIGVsZW1lbnQuIElmIG5vdCBmb3VuZCwgZmV0Y2hlcyBhbGwgaWNvbiBzZXRzXG4gICAqIHRoYXQgaGF2ZSBub3QgYmVlbiBjYWNoZWQsIGFuZCBzZWFyY2hlcyBhZ2FpbiBhZnRlciBhbGwgZmV0Y2hlcyBhcmUgY29tcGxldGVkLlxuICAgKiBUaGUgcmV0dXJuZWQgT2JzZXJ2YWJsZSBwcm9kdWNlcyB0aGUgU1ZHIGVsZW1lbnQgaWYgcG9zc2libGUsIGFuZCB0aHJvd3NcbiAgICogYW4gZXJyb3IgaWYgbm8gaWNvbiB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBjYW4gYmUgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTdmdGcm9tSWNvblNldENvbmZpZ3MobmFtZTogc3RyaW5nLCBpY29uU2V0Q29uZmlnczogU3ZnSWNvbkNvbmZpZ1tdKTpcbiAgICAgIE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIC8vIEZvciBhbGwgdGhlIGljb24gc2V0IFNWRyBlbGVtZW50cyB3ZSd2ZSBmZXRjaGVkLCBzZWUgaWYgYW55IGNvbnRhaW4gYW4gaWNvbiB3aXRoIHRoZVxuICAgIC8vIHJlcXVlc3RlZCBuYW1lLlxuICAgIGNvbnN0IG5hbWVkSWNvbiA9IHRoaXMuX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KG5hbWUsIGljb25TZXRDb25maWdzKTtcblxuICAgIGlmIChuYW1lZEljb24pIHtcbiAgICAgIC8vIFdlIGNvdWxkIGNhY2hlIG5hbWVkSWNvbiBpbiBfc3ZnSWNvbkNvbmZpZ3MsIGJ1dCBzaW5jZSB3ZSBoYXZlIHRvIG1ha2UgYSBjb3B5IGV2ZXJ5XG4gICAgICAvLyB0aW1lIGFueXdheSwgdGhlcmUncyBwcm9iYWJseSBub3QgbXVjaCBhZHZhbnRhZ2UgY29tcGFyZWQgdG8ganVzdCBhbHdheXMgZXh0cmFjdGluZ1xuICAgICAgLy8gaXQgZnJvbSB0aGUgaWNvbiBzZXQuXG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG5hbWVkSWNvbik7XG4gICAgfVxuXG4gICAgLy8gTm90IGZvdW5kIGluIGFueSBjYWNoZWQgaWNvbiBzZXRzLiBJZiB0aGVyZSBhcmUgaWNvbiBzZXRzIHdpdGggVVJMcyB0aGF0IHdlIGhhdmVuJ3RcbiAgICAvLyBmZXRjaGVkLCBmZXRjaCB0aGVtIG5vdyBhbmQgbG9vayBmb3IgaWNvbk5hbWUgaW4gdGhlIHJlc3VsdHMuXG4gICAgY29uc3QgaWNvblNldEZldGNoUmVxdWVzdHM6IE9ic2VydmFibGU8VHJ1c3RlZEhUTUwgfCBudWxsPltdID0gaWNvblNldENvbmZpZ3NcbiAgICAgIC5maWx0ZXIoaWNvblNldENvbmZpZyA9PiAhaWNvblNldENvbmZpZy5zdmdUZXh0KVxuICAgICAgLm1hcChpY29uU2V0Q29uZmlnID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRTdmdJY29uU2V0RnJvbUNvbmZpZyhpY29uU2V0Q29uZmlnKS5waXBlKFxuICAgICAgICAgIGNhdGNoRXJyb3IoKGVycjogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCBpY29uU2V0Q29uZmlnLnVybCk7XG5cbiAgICAgICAgICAgIC8vIFN3YWxsb3cgZXJyb3JzIGZldGNoaW5nIGluZGl2aWR1YWwgVVJMcyBzbyB0aGVcbiAgICAgICAgICAgIC8vIGNvbWJpbmVkIE9ic2VydmFibGUgd29uJ3QgbmVjZXNzYXJpbHkgZmFpbC5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBMb2FkaW5nIGljb24gc2V0IFVSTDogJHt1cmx9IGZhaWxlZDogJHtlcnIubWVzc2FnZX1gO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKTtcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gRmV0Y2ggYWxsIHRoZSBpY29uIHNldCBVUkxzLiBXaGVuIHRoZSByZXF1ZXN0cyBjb21wbGV0ZSwgZXZlcnkgSWNvblNldCBzaG91bGQgaGF2ZSBhXG4gICAgLy8gY2FjaGVkIFNWRyBlbGVtZW50ICh1bmxlc3MgdGhlIHJlcXVlc3QgZmFpbGVkKSwgYW5kIHdlIGNhbiBjaGVjayBhZ2FpbiBmb3IgdGhlIGljb24uXG4gICAgcmV0dXJuIGZvcmtKb2luKGljb25TZXRGZXRjaFJlcXVlc3RzKS5waXBlKG1hcCgoKSA9PiB7XG4gICAgICBjb25zdCBmb3VuZEljb24gPSB0aGlzLl9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChuYW1lLCBpY29uU2V0Q29uZmlncyk7XG5cbiAgICAgIC8vIFRPRE86IGFkZCBhbiBuZ0Rldk1vZGUgY2hlY2tcbiAgICAgIGlmICghZm91bmRJY29uKSB7XG4gICAgICAgIHRocm93IGdldE1hdEljb25OYW1lTm90Rm91bmRFcnJvcihuYW1lKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kSWNvbjtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgdGhlIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIHRoZSBnaXZlbiBpY29uIHNldHMgZm9yIGEgbmVzdGVkIGljb24gZWxlbWVudCB3aG9zZSBcImlkXCJcbiAgICogdGFnIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBuYW1lLiBJZiBmb3VuZCwgY29waWVzIHRoZSBuZXN0ZWQgZWxlbWVudCB0byBhIG5ldyBTVkcgZWxlbWVudCBhbmRcbiAgICogcmV0dXJucyBpdC4gUmV0dXJucyBudWxsIGlmIG5vIG1hdGNoaW5nIGVsZW1lbnQgaXMgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChpY29uTmFtZTogc3RyaW5nLCBpY29uU2V0Q29uZmlnczogU3ZnSWNvbkNvbmZpZ1tdKTpcbiAgICAgIFNWR0VsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBJdGVyYXRlIGJhY2t3YXJkcywgc28gaWNvbiBzZXRzIGFkZGVkIGxhdGVyIGhhdmUgcHJlY2VkZW5jZS5cbiAgICBmb3IgKGxldCBpID0gaWNvblNldENvbmZpZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGljb25TZXRDb25maWdzW2ldO1xuXG4gICAgICAvLyBQYXJzaW5nIHRoZSBpY29uIHNldCdzIHRleHQgaW50byBhbiBTVkcgZWxlbWVudCBjYW4gYmUgZXhwZW5zaXZlLiBXZSBjYW4gYXZvaWQgc29tZSBvZlxuICAgICAgLy8gdGhlIHBhcnNpbmcgYnkgZG9pbmcgYSBxdWljayBjaGVjayB1c2luZyBgaW5kZXhPZmAgdG8gc2VlIGlmIHRoZXJlJ3MgYW55IGNoYW5jZSBmb3IgdGhlXG4gICAgICAvLyBpY29uIHRvIGJlIGluIHRoZSBzZXQuIFRoaXMgd29uJ3QgYmUgMTAwJSBhY2N1cmF0ZSwgYnV0IGl0IHNob3VsZCBoZWxwIHVzIGF2b2lkIGF0IGxlYXN0XG4gICAgICAvLyBzb21lIG9mIHRoZSBwYXJzaW5nLlxuICAgICAgaWYgKGNvbmZpZy5zdmdUZXh0ICYmIGNvbmZpZy5zdmdUZXh0LnRvU3RyaW5nKCkuaW5kZXhPZihpY29uTmFtZSkgPiAtMSkge1xuICAgICAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbUNvbmZpZyhjb25maWcgYXMgTG9hZGVkU3ZnSWNvbkNvbmZpZyk7XG4gICAgICAgIGNvbnN0IGZvdW5kSWNvbiA9IHRoaXMuX2V4dHJhY3RTdmdJY29uRnJvbVNldChzdmcsIGljb25OYW1lLCBjb25maWcub3B0aW9ucyk7XG4gICAgICAgIGlmIChmb3VuZEljb24pIHtcbiAgICAgICAgICByZXR1cm4gZm91bmRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjb250ZW50IG9mIHRoZSBpY29uIFVSTCBzcGVjaWZpZWQgaW4gdGhlIFN2Z0ljb25Db25maWcgYW5kIGNyZWF0ZXMgYW4gU1ZHIGVsZW1lbnRcbiAgICogZnJvbSBpdC5cbiAgICovXG4gIHByaXZhdGUgX2xvYWRTdmdJY29uRnJvbUNvbmZpZyhjb25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZmV0Y2hJY29uKGNvbmZpZykucGlwZShcbiAgICAgIHRhcChzdmdUZXh0ID0+IGNvbmZpZy5zdmdUZXh0ID0gc3ZnVGV4dCksXG4gICAgICBtYXAoKCkgPT4gdGhpcy5fc3ZnRWxlbWVudEZyb21Db25maWcoY29uZmlnIGFzIExvYWRlZFN2Z0ljb25Db25maWcpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIGNvbnRlbnQgb2YgdGhlIGljb24gc2V0IFVSTCBzcGVjaWZpZWQgaW4gdGhlXG4gICAqIFN2Z0ljb25Db25maWcgYW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9sb2FkU3ZnSWNvblNldEZyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxUcnVzdGVkSFRNTCB8IG51bGw+IHtcbiAgICBpZiAoY29uZmlnLnN2Z1RleHQpIHtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ZldGNoSWNvbihjb25maWcpLnBpcGUodGFwKHN2Z1RleHQgPT4gY29uZmlnLnN2Z1RleHQgPSBzdmdUZXh0KSk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgdGhlIGNhY2hlZCBlbGVtZW50IG9mIHRoZSBnaXZlbiBTdmdJY29uQ29uZmlnIGZvciBhIG5lc3RlZCBpY29uIGVsZW1lbnQgd2hvc2UgXCJpZFwiXG4gICAqIHRhZyBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbmFtZS4gSWYgZm91bmQsIGNvcGllcyB0aGUgbmVzdGVkIGVsZW1lbnQgdG8gYSBuZXcgU1ZHIGVsZW1lbnQgYW5kXG4gICAqIHJldHVybnMgaXQuIFJldHVybnMgbnVsbCBpZiBubyBtYXRjaGluZyBlbGVtZW50IGlzIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZXh0cmFjdFN2Z0ljb25Gcm9tU2V0KGljb25TZXQ6IFNWR0VsZW1lbnQsIGljb25OYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiBTVkdFbGVtZW50IHwgbnVsbCB7XG4gICAgLy8gVXNlIHRoZSBgaWQ9XCJpY29uTmFtZVwiYCBzeW50YXggaW4gb3JkZXIgdG8gZXNjYXBlIHNwZWNpYWxcbiAgICAvLyBjaGFyYWN0ZXJzIGluIHRoZSBJRCAodmVyc3VzIHVzaW5nIHRoZSAjaWNvbk5hbWUgc3ludGF4KS5cbiAgICBjb25zdCBpY29uU291cmNlID0gaWNvblNldC5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2ljb25OYW1lfVwiXWApO1xuXG4gICAgaWYgKCFpY29uU291cmNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDbG9uZSB0aGUgZWxlbWVudCBhbmQgcmVtb3ZlIHRoZSBJRCB0byBwcmV2ZW50IG11bHRpcGxlIGVsZW1lbnRzIGZyb20gYmVpbmcgYWRkZWRcbiAgICAvLyB0byB0aGUgcGFnZSB3aXRoIHRoZSBzYW1lIElELlxuICAgIGNvbnN0IGljb25FbGVtZW50ID0gaWNvblNvdXJjZS5jbG9uZU5vZGUodHJ1ZSkgYXMgRWxlbWVudDtcbiAgICBpY29uRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAvLyBJZiB0aGUgaWNvbiBub2RlIGlzIGl0c2VsZiBhbiA8c3ZnPiBub2RlLCBjbG9uZSBhbmQgcmV0dXJuIGl0IGRpcmVjdGx5LiBJZiBub3QsIHNldCBpdCBhc1xuICAgIC8vIHRoZSBjb250ZW50IG9mIGEgbmV3IDxzdmc+IG5vZGUuXG4gICAgaWYgKGljb25FbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyhpY29uRWxlbWVudCBhcyBTVkdFbGVtZW50LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbm9kZSBpcyBhIDxzeW1ib2w+LCBpdCB3b24ndCBiZSByZW5kZXJlZCBzbyB3ZSBoYXZlIHRvIGNvbnZlcnQgaXQgaW50byA8c3ZnPi4gTm90ZVxuICAgIC8vIHRoYXQgdGhlIHNhbWUgY291bGQgYmUgYWNoaWV2ZWQgYnkgcmVmZXJyaW5nIHRvIGl0IHZpYSA8dXNlIGhyZWY9XCIjaWRcIj4sIGhvd2V2ZXIgdGhlIDx1c2U+XG4gICAgLy8gdGFnIGlzIHByb2JsZW1hdGljIG9uIEZpcmVmb3gsIGJlY2F1c2UgaXQgbmVlZHMgdG8gaW5jbHVkZSB0aGUgY3VycmVudCBwYWdlIHBhdGguXG4gICAgaWYgKGljb25FbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyh0aGlzLl90b1N2Z0VsZW1lbnQoaWNvbkVsZW1lbnQpLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVFbGVtZW50KCdTVkcnKSBkb2Vzbid0IHdvcmsgYXMgZXhwZWN0ZWQ7IHRoZSBET00gZW5kcyB1cCB3aXRoXG4gICAgLy8gdGhlIGNvcnJlY3Qgbm9kZXMsIGJ1dCB0aGUgU1ZHIGNvbnRlbnQgZG9lc24ndCByZW5kZXIuIEluc3RlYWQgd2VcbiAgICAvLyBoYXZlIHRvIGNyZWF0ZSBhbiBlbXB0eSBTVkcgbm9kZSB1c2luZyBpbm5lckhUTUwgYW5kIGFwcGVuZCBpdHMgY29udGVudC5cbiAgICAvLyBFbGVtZW50cyBjcmVhdGVkIHVzaW5nIERPTVBhcnNlci5wYXJzZUZyb21TdHJpbmcgaGF2ZSB0aGUgc2FtZSBwcm9ibGVtLlxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjMwMDMyNzgvc3ZnLWlubmVyaHRtbC1pbi1maXJlZm94LWNhbi1ub3QtZGlzcGxheVxuICAgIGNvbnN0IHN2ZyA9IHRoaXMuX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKHRydXN0ZWRIVE1MRnJvbVN0cmluZygnPHN2Zz48L3N2Zz4nKSk7XG4gICAgLy8gQ2xvbmUgdGhlIG5vZGUgc28gd2UgZG9uJ3QgcmVtb3ZlIGl0IGZyb20gdGhlIHBhcmVudCBpY29uIHNldCBlbGVtZW50LlxuICAgIHN2Zy5hcHBlbmRDaGlsZChpY29uRWxlbWVudCk7XG5cbiAgICByZXR1cm4gdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyhzdmcsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBET00gZWxlbWVudCBmcm9tIHRoZSBnaXZlbiBTVkcgc3RyaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3ZnRWxlbWVudEZyb21TdHJpbmcoc3RyOiBUcnVzdGVkSFRNTCk6IFNWR0VsZW1lbnQge1xuICAgIGNvbnN0IGRpdiA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHIgYXMgdW5rbm93biBhcyBzdHJpbmc7XG4gICAgY29uc3Qgc3ZnID0gZGl2LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpIGFzIFNWR0VsZW1lbnQ7XG5cbiAgICAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgaWYgKCFzdmcpIHtcbiAgICAgIHRocm93IEVycm9yKCc8c3ZnPiB0YWcgbm90IGZvdW5kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbiBlbGVtZW50IGludG8gYW4gU1ZHIG5vZGUgYnkgY2xvbmluZyBhbGwgb2YgaXRzIGNoaWxkcmVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfdG9TdmdFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZyh0cnVzdGVkSFRNTEZyb21TdHJpbmcoJzxzdmc+PC9zdmc+JykpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBDb3B5IG92ZXIgYWxsIHRoZSBhdHRyaWJ1dGVzIGZyb20gdGhlIGBzeW1ib2xgIHRvIHRoZSBuZXcgU1ZHLCBleGNlcHQgdGhlIGlkLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge25hbWUsIHZhbHVlfSA9IGF0dHJpYnV0ZXNbaV07XG5cbiAgICAgIGlmIChuYW1lICE9PSAnaWQnKSB7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZE5vZGVzW2ldLm5vZGVUeXBlID09PSB0aGlzLl9kb2N1bWVudC5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKGVsZW1lbnQuY2hpbGROb2Rlc1tpXS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCBhdHRyaWJ1dGVzIGZvciBhbiBTVkcgZWxlbWVudCB0byBiZSB1c2VkIGFzIGFuIGljb24uXG4gICAqL1xuICBwcml2YXRlIF9zZXRTdmdBdHRyaWJ1dGVzKHN2ZzogU1ZHRWxlbWVudCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogU1ZHRWxlbWVudCB7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnZml0JywgJycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMTAwJScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzYWJsZScsICdmYWxzZScpOyAvLyBEaXNhYmxlIElFMTEgZGVmYXVsdCBiZWhhdmlvciB0byBtYWtlIFNWR3MgZm9jdXNhYmxlLlxuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy52aWV3Qm94KSB7XG4gICAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94Jywgb3B0aW9ucy52aWV3Qm94KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB3aGljaCBwcm9kdWNlcyB0aGUgc3RyaW5nIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBpY29uLiBSZXN1bHRzIG1heSBiZVxuICAgKiBjYWNoZWQsIHNvIGZ1dHVyZSBjYWxscyB3aXRoIHRoZSBzYW1lIFVSTCBtYXkgbm90IGNhdXNlIGFub3RoZXIgSFRUUCByZXF1ZXN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfZmV0Y2hJY29uKGljb25Db25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPFRydXN0ZWRIVE1MPiB7XG4gICAgY29uc3Qge3VybDogc2FmZVVybCwgb3B0aW9uc30gPSBpY29uQ29uZmlnO1xuICAgIGNvbnN0IHdpdGhDcmVkZW50aWFscyA9IG9wdGlvbnM/LndpdGhDcmVkZW50aWFscyA/PyBmYWxzZTtcblxuICAgIGlmICghdGhpcy5faHR0cENsaWVudCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbk5vSHR0cFByb3ZpZGVyRXJyb3IoKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgaWYgKHNhZmVVcmwgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbm5vdCBmZXRjaCBpY29uIGZyb20gVVJMIFwiJHtzYWZlVXJsfVwiLmApO1xuICAgIH1cblxuICAgIGNvbnN0IHVybCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCBzYWZlVXJsKTtcblxuICAgIC8vIFRPRE86IGFkZCBhbiBuZ0Rldk1vZGUgY2hlY2tcbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVVcmxFcnJvcihzYWZlVXJsKTtcbiAgICB9XG5cbiAgICAvLyBTdG9yZSBpbi1wcm9ncmVzcyBmZXRjaGVzIHRvIGF2b2lkIHNlbmRpbmcgYSBkdXBsaWNhdGUgcmVxdWVzdCBmb3IgYSBVUkwgd2hlbiB0aGVyZSBpc1xuICAgIC8vIGFscmVhZHkgYSByZXF1ZXN0IGluIHByb2dyZXNzIGZvciB0aGF0IFVSTC4gSXQncyBuZWNlc3NhcnkgdG8gY2FsbCBzaGFyZSgpIG9uIHRoZVxuICAgIC8vIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgaHR0cC5nZXQoKSBzbyB0aGF0IG11bHRpcGxlIHN1YnNjcmliZXJzIGRvbid0IGNhdXNlIG11bHRpcGxlIFhIUnMuXG4gICAgY29uc3QgaW5Qcm9ncmVzc0ZldGNoID0gdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuZ2V0KHVybCk7XG5cbiAgICBpZiAoaW5Qcm9ncmVzc0ZldGNoKSB7XG4gICAgICByZXR1cm4gaW5Qcm9ncmVzc0ZldGNoO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcSA9IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHVybCwge3Jlc3BvbnNlVHlwZTogJ3RleHQnLCB3aXRoQ3JlZGVudGlhbHN9KS5waXBlKFxuICAgICAgbWFwKHN2ZyA9PiB7XG4gICAgICAgIC8vIFNlY3VyaXR5OiBUaGlzIFNWRyBpcyBmZXRjaGVkIGZyb20gYSBTYWZlUmVzb3VyY2VVcmwsIGFuZCBpcyB0aHVzXG4gICAgICAgIC8vIHRydXN0ZWQgSFRNTC5cbiAgICAgICAgcmV0dXJuIHRydXN0ZWRIVE1MRnJvbVN0cmluZyhzdmcpO1xuICAgICAgfSksXG4gICAgICBmaW5hbGl6ZSgoKSA9PiB0aGlzLl9pblByb2dyZXNzVXJsRmV0Y2hlcy5kZWxldGUodXJsKSksXG4gICAgICBzaGFyZSgpLFxuICAgICk7XG5cbiAgICB0aGlzLl9pblByb2dyZXNzVXJsRmV0Y2hlcy5zZXQodXJsLCByZXEpO1xuICAgIHJldHVybiByZXE7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gY29uZmlnIGJ5IG5hbWUgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBpY29uIGNvbmZpZy5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGNvbmZpZy5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHByaXZhdGUgX2FkZFN2Z0ljb25Db25maWcobmFtZXNwYWNlOiBzdHJpbmcsIGljb25OYW1lOiBzdHJpbmcsIGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IHRoaXMge1xuICAgIHRoaXMuX3N2Z0ljb25Db25maWdzLnNldChpY29uS2V5KG5hbWVzcGFjZSwgaWNvbk5hbWUpLCBjb25maWcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCBjb25maWcgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBpY29uIGNvbmZpZy5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHByaXZhdGUgX2FkZFN2Z0ljb25TZXRDb25maWcobmFtZXNwYWNlOiBzdHJpbmcsIGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IHRoaXMge1xuICAgIGNvbnN0IGNvbmZpZ05hbWVzcGFjZSA9IHRoaXMuX2ljb25TZXRDb25maWdzLmdldChuYW1lc3BhY2UpO1xuXG4gICAgaWYgKGNvbmZpZ05hbWVzcGFjZSkge1xuICAgICAgY29uZmlnTmFtZXNwYWNlLnB1c2goY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faWNvblNldENvbmZpZ3Muc2V0KG5hbWVzcGFjZSwgW2NvbmZpZ10pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFBhcnNlcyBhIGNvbmZpZydzIHRleHQgaW50byBhbiBTVkcgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfc3ZnRWxlbWVudEZyb21Db25maWcoY29uZmlnOiBMb2FkZWRTdmdJY29uQ29uZmlnKTogU1ZHRWxlbWVudCB7XG4gICAgaWYgKCFjb25maWcuc3ZnRWxlbWVudCkge1xuICAgICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcoY29uZmlnLnN2Z1RleHQpO1xuICAgICAgdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyhzdmcsIGNvbmZpZy5vcHRpb25zKTtcbiAgICAgIGNvbmZpZy5zdmdFbGVtZW50ID0gc3ZnO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWcuc3ZnRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBUcmllcyB0byBjcmVhdGUgYW4gaWNvbiBjb25maWcgdGhyb3VnaCB0aGUgcmVnaXN0ZXJlZCByZXNvbHZlciBmdW5jdGlvbnMuICovXG4gIHByaXZhdGUgX2dldEljb25Db25maWdGcm9tUmVzb2x2ZXJzKG5hbWVzcGFjZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBTdmdJY29uQ29uZmlnIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Jlc29sdmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcmVzb2x2ZXJzW2ldKG5hbWUsIG5hbWVzcGFjZSk7XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIGlzU2FmZVVybFdpdGhPcHRpb25zKHJlc3VsdCkgP1xuICAgICAgICAgIG5ldyBTdmdJY29uQ29uZmlnKHJlc3VsdC51cmwsIG51bGwsIHJlc3VsdC5vcHRpb25zKSA6XG4gICAgICAgICAgbmV3IFN2Z0ljb25Db25maWcocmVzdWx0LCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gSUNPTl9SRUdJU1RSWV9QUk9WSURFUl9GQUNUT1JZKFxuICBwYXJlbnRSZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LFxuICBodHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxuICBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gIGRvY3VtZW50PzogYW55KSB7XG4gIHJldHVybiBwYXJlbnRSZWdpc3RyeSB8fCBuZXcgTWF0SWNvblJlZ2lzdHJ5KGh0dHBDbGllbnQsIHNhbml0aXplciwgZG9jdW1lbnQsIGVycm9ySGFuZGxlcik7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgSUNPTl9SRUdJU1RSWV9QUk9WSURFUiA9IHtcbiAgLy8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhbiBNYXRJY29uUmVnaXN0cnkgYXZhaWxhYmxlLCB1c2UgdGhhdC4gT3RoZXJ3aXNlLCBwcm92aWRlIGEgbmV3IG9uZS5cbiAgcHJvdmlkZTogTWF0SWNvblJlZ2lzdHJ5LFxuICBkZXBzOiBbXG4gICAgW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0SWNvblJlZ2lzdHJ5XSxcbiAgICBbbmV3IE9wdGlvbmFsKCksIEh0dHBDbGllbnRdLFxuICAgIERvbVNhbml0aXplcixcbiAgICBFcnJvckhhbmRsZXIsXG4gICAgW25ldyBPcHRpb25hbCgpLCBET0NVTUVOVCBhcyBJbmplY3Rpb25Ub2tlbjxhbnk+XSxcbiAgXSxcbiAgdXNlRmFjdG9yeTogSUNPTl9SRUdJU1RSWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqIENsb25lcyBhbiBTVkdFbGVtZW50IHdoaWxlIHByZXNlcnZpbmcgdHlwZSBpbmZvcm1hdGlvbi4gKi9cbmZ1bmN0aW9uIGNsb25lU3ZnKHN2ZzogU1ZHRWxlbWVudCk6IFNWR0VsZW1lbnQge1xuICByZXR1cm4gc3ZnLmNsb25lTm9kZSh0cnVlKSBhcyBTVkdFbGVtZW50O1xufVxuXG4vKiogUmV0dXJucyB0aGUgY2FjaGUga2V5IHRvIHVzZSBmb3IgYW4gaWNvbiBuYW1lc3BhY2UgYW5kIG5hbWUuICovXG5mdW5jdGlvbiBpY29uS2V5KG5hbWVzcGFjZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5hbWVzcGFjZSArICc6JyArIG5hbWU7XG59XG5cbmZ1bmN0aW9uIGlzU2FmZVVybFdpdGhPcHRpb25zKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBTYWZlUmVzb3VyY2VVcmxXaXRoSWNvbk9wdGlvbnMge1xuICByZXR1cm4gISEodmFsdWUudXJsICYmIHZhbHVlLm9wdGlvbnMpO1xufVxuIl19