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
         * The CSS classes to apply when an `<mat-icon>` component has no icon name, url, or font
         * specified. The default 'material-icons' value assumes that the material icon font has been
         * loaded as described at https://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = ['material-icons', 'mat-ligature-font'];
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
     * Defines an alias for CSS class names to be used for icon fonts. Creating an matIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the `<mat-icon>` element.
     *
     * If the registered font is a ligature font, then don't forget to also include the special
     * class `mat-ligature-font` to allow the usage via attribute. So register like this:
     *
     * ```ts
     * iconRegistry.registerFontClassAlias('f1', 'font1 mat-ligature-font');
     * ```
     *
     * And use like this:
     *
     * ```html
     * <mat-icon fontSet="f1" fontIcon="home"></mat-icon>
     * ```
     *
     * @param alias Alias for the font.
     * @param classNames Class names override to be used instead of the alias.
     */
    registerFontClassAlias(alias, classNames = alias) {
        this._fontCssClassesByAlias.set(alias, classNames);
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
     * Sets the CSS classes to be used for icon fonts when an `<mat-icon>` component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    setDefaultFontSetClass(...classNames) {
        this._defaultFontSetClass = classNames;
        return this;
    }
    /**
     * Returns the CSS classes to be used for icon fonts when an `<mat-icon>` component does not
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
        return this._fetchIcon(config).pipe(tap(svgText => (config.svgText = svgText)), map(() => this._svgElementFromConfig(config)));
    }
    /**
     * Loads the content of the icon set URL specified in the
     * SvgIconConfig and attaches it to the config.
     */
    _loadSvgIconSetFromConfig(config) {
        if (config.svgText) {
            return observableOf(null);
        }
        return this._fetchIcon(config).pipe(tap(svgText => (config.svgText = svgText)));
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
                return isSafeUrlWithOptions(result)
                    ? new SvgIconConfig(result.url, null, result.options)
                    : new SvgIconConfig(result, null);
            }
        }
        return undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatIconRegistry, deps: [{ token: i1.HttpClient, optional: true }, { token: i2.DomSanitizer }, { token: DOCUMENT, optional: true }, { token: i0.ErrorHandler }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatIconRegistry, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatIconRegistry, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient, decorators: [{
                    type: Optional
                }] }, { type: i2.DomSanitizer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ErrorHandler }] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQW9CLE1BQU0sc0JBQXNCLENBQUM7QUFDbkUsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUdWLFFBQVEsRUFDUixlQUFlLEVBQ2YsUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxZQUFZLEVBQTRCLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFFBQVEsRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0YsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRSxPQUFPLEVBQWMscUJBQXFCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUVuRTs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQixDQUFDLFFBQWdCO0lBQzFELE9BQU8sS0FBSyxDQUFDLHNDQUFzQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLDZCQUE2QjtJQUMzQyxPQUFPLEtBQUssQ0FDViwwRUFBMEU7UUFDeEUsd0VBQXdFO1FBQ3hFLGNBQWMsQ0FDakIsQ0FBQztBQUNKLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGtDQUFrQyxDQUFDLEdBQW9CO0lBQ3JFLE9BQU8sS0FBSyxDQUNWLHdFQUF3RTtRQUN0RSxrREFBa0QsR0FBRyxJ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QUUsSUFBWTtJQUM5QyxPQUFPLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEtBQVU7SUFDdEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBFcnJvclJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBFcnJvckhhbmRsZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgU2tpcFNlbGYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEb21TYW5pdGl6ZXIsIFNhZmVIdG1sLCBTYWZlUmVzb3VyY2VVcmx9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtmb3JrSm9pbiwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd30gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIGZpbmFsaXplLCBtYXAsIHNoYXJlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VHJ1c3RlZEhUTUwsIHRydXN0ZWRIVE1MRnJvbVN0cmluZ30gZnJvbSAnLi90cnVzdGVkLXR5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gaW4gdGhlIGNhc2Ugd2hlbiBhdHRlbXB0aW5nIHRvXG4gKiBsb2FkIGFuIGljb24gd2l0aCBhIG5hbWUgdGhhdCBjYW5ub3QgYmUgZm91bmQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3IoaWNvbk5hbWU6IHN0cmluZyk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBVbmFibGUgdG8gZmluZCBpY29uIHdpdGggdGhlIG5hbWUgXCIke2ljb25OYW1lfVwiYCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gdGhlIGNvbnN1bWVyIGF0dGVtcHRzIHRvIHVzZVxuICogYDxtYXQtaWNvbj5gIHdpdGhvdXQgaW5jbHVkaW5nIEBhbmd1bGFyL2NvbW1vbi9odHRwLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbk5vSHR0cFByb3ZpZGVyRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoXG4gICAgJ0NvdWxkIG5vdCBmaW5kIEh0dHBDbGllbnQgcHJvdmlkZXIgZm9yIHVzZSB3aXRoIEFuZ3VsYXIgTWF0ZXJpYWwgaWNvbnMuICcgK1xuICAgICAgJ1BsZWFzZSBpbmNsdWRlIHRoZSBIdHRwQ2xpZW50TW9kdWxlIGZyb20gQGFuZ3VsYXIvY29tbW9uL2h0dHAgaW4geW91ciAnICtcbiAgICAgICdhcHAgaW1wb3J0cy4nLFxuICApO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGEgVVJMIGNvdWxkbid0IGJlIHNhbml0aXplZC5cbiAqIEBwYXJhbSB1cmwgVVJMIHRoYXQgd2FzIGF0dGVtcHRlZCB0byBiZSBzYW5pdGl6ZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHVybDogU2FmZVJlc291cmNlVXJsKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoXG4gICAgYFRoZSBVUkwgcHJvdmlkZWQgdG8gTWF0SWNvblJlZ2lzdHJ5IHdhcyBub3QgdHJ1c3RlZCBhcyBhIHJlc291cmNlIFVSTCBgICtcbiAgICAgIGB2aWEgQW5ndWxhcidzIERvbVNhbml0aXplci4gQXR0ZW1wdGVkIFVSTCB3YXMgXCIke3VybH1cIi5gLFxuICApO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGEgSFRNTCBzdHJpbmcgY291bGRuJ3QgYmUgc2FuaXRpemVkLlxuICogQHBhcmFtIGxpdGVyYWwgSFRNTCB0aGF0IHdhcyBhdHRlbXB0ZWQgdG8gYmUgc2FuaXRpemVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVMaXRlcmFsRXJyb3IobGl0ZXJhbDogU2FmZUh0bWwpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihcbiAgICBgVGhlIGxpdGVyYWwgcHJvdmlkZWQgdG8gTWF0SWNvblJlZ2lzdHJ5IHdhcyBub3QgdHJ1c3RlZCBhcyBzYWZlIEhUTUwgYnkgYCArXG4gICAgICBgQW5ndWxhcidzIERvbVNhbml0aXplci4gQXR0ZW1wdGVkIGxpdGVyYWwgd2FzIFwiJHtsaXRlcmFsfVwiLmAsXG4gICk7XG59XG5cbi8qKiBPcHRpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIGhvdyBhbiBpY29uIG9yIHRoZSBpY29ucyBpbiBhbiBpY29uIHNldCBhcmUgcHJlc2VudGVkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJY29uT3B0aW9ucyB7XG4gIC8qKiBWaWV3IGJveCB0byBzZXQgb24gdGhlIGljb24uICovXG4gIHZpZXdCb3g/OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRvIGZldGNoIHRoZSBpY29uIG9yIGljb24gc2V0IHVzaW5nIEhUVFAgY3JlZGVudGlhbHMuICovXG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgYnkgdGhlIGljb24gcmVnaXN0cnkgd2hlbiB0cnlpbmcgdG8gcmVzb2x2ZSB0aGVcbiAqIFVSTCBmcm9tIHdoaWNoIHRvIGZldGNoIGFuIGljb24uIFRoZSByZXR1cm5lZCBVUkwgd2lsbCBiZSB1c2VkIHRvIG1ha2UgYSByZXF1ZXN0IGZvciB0aGUgaWNvbi5cbiAqL1xuZXhwb3J0IHR5cGUgSWNvblJlc29sdmVyID0gKFxuICBuYW1lOiBzdHJpbmcsXG4gIG5hbWVzcGFjZTogc3RyaW5nLFxuKSA9PiBTYWZlUmVzb3VyY2VVcmwgfCBTYWZlUmVzb3VyY2VVcmxXaXRoSWNvbk9wdGlvbnMgfCBudWxsO1xuXG4vKiogT2JqZWN0IHRoYXQgc3BlY2lmaWVzIGEgVVJMIGZyb20gd2hpY2ggdG8gZmV0Y2ggYW4gaWNvbiBhbmQgdGhlIG9wdGlvbnMgdG8gdXNlIGZvciBpdC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZVJlc291cmNlVXJsV2l0aEljb25PcHRpb25zIHtcbiAgdXJsOiBTYWZlUmVzb3VyY2VVcmw7XG4gIG9wdGlvbnM6IEljb25PcHRpb25zO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGFuIGljb24sIGluY2x1ZGluZyB0aGUgVVJMIGFuZCBwb3NzaWJseSB0aGUgY2FjaGVkIFNWRyBlbGVtZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jbGFzcyBTdmdJY29uQ29uZmlnIHtcbiAgc3ZnRWxlbWVudDogU1ZHRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHVybDogU2FmZVJlc291cmNlVXJsLFxuICAgIHB1YmxpYyBzdmdUZXh0OiBUcnVzdGVkSFRNTCB8IG51bGwsXG4gICAgcHVibGljIG9wdGlvbnM/OiBJY29uT3B0aW9ucyxcbiAgKSB7fVxufVxuXG4vKiogSWNvbiBjb25maWd1cmF0aW9uIHdob3NlIGNvbnRlbnQgaGFzIGFscmVhZHkgYmVlbiBsb2FkZWQuICovXG50eXBlIExvYWRlZFN2Z0ljb25Db25maWcgPSBTdmdJY29uQ29uZmlnICYge3N2Z1RleHQ6IFRydXN0ZWRIVE1MfTtcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIHJlZ2lzdGVyIGFuZCBkaXNwbGF5IGljb25zIHVzZWQgYnkgdGhlIGA8bWF0LWljb24+YCBjb21wb25lbnQuXG4gKiAtIFJlZ2lzdGVycyBpY29uIFVSTHMgYnkgbmFtZXNwYWNlIGFuZCBuYW1lLlxuICogLSBSZWdpc3RlcnMgaWNvbiBzZXQgVVJMcyBieSBuYW1lc3BhY2UuXG4gKiAtIFJlZ2lzdGVycyBhbGlhc2VzIGZvciBDU1MgY2xhc3NlcywgZm9yIHVzZSB3aXRoIGljb24gZm9udHMuXG4gKiAtIExvYWRzIGljb25zIGZyb20gVVJMcyBhbmQgZXh0cmFjdHMgaW5kaXZpZHVhbCBpY29ucyBmcm9tIGljb24gc2V0cy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0SWNvblJlZ2lzdHJ5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBVUkxzIGFuZCBjYWNoZWQgU1ZHIGVsZW1lbnRzIGZvciBpbmRpdmlkdWFsIGljb25zLiBLZXlzIGFyZSBvZiB0aGUgZm9ybWF0IFwiW25hbWVzcGFjZV06W2ljb25dXCIuXG4gICAqL1xuICBwcml2YXRlIF9zdmdJY29uQ29uZmlncyA9IG5ldyBNYXA8c3RyaW5nLCBTdmdJY29uQ29uZmlnPigpO1xuXG4gIC8qKlxuICAgKiBTdmdJY29uQ29uZmlnIG9iamVjdHMgYW5kIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIGljb24gc2V0cywga2V5ZWQgYnkgbmFtZXNwYWNlLlxuICAgKiBNdWx0aXBsZSBpY29uIHNldHMgY2FuIGJlIHJlZ2lzdGVyZWQgdW5kZXIgdGhlIHNhbWUgbmFtZXNwYWNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaWNvblNldENvbmZpZ3MgPSBuZXcgTWFwPHN0cmluZywgU3ZnSWNvbkNvbmZpZ1tdPigpO1xuXG4gIC8qKiBDYWNoZSBmb3IgaWNvbnMgbG9hZGVkIGJ5IGRpcmVjdCBVUkxzLiAqL1xuICBwcml2YXRlIF9jYWNoZWRJY29uc0J5VXJsID0gbmV3IE1hcDxzdHJpbmcsIFNWR0VsZW1lbnQ+KCk7XG5cbiAgLyoqIEluLXByb2dyZXNzIGljb24gZmV0Y2hlcy4gVXNlZCB0byBjb2FsZXNjZSBtdWx0aXBsZSByZXF1ZXN0cyB0byB0aGUgc2FtZSBVUkwuICovXG4gIHByaXZhdGUgX2luUHJvZ3Jlc3NVcmxGZXRjaGVzID0gbmV3IE1hcDxzdHJpbmcsIE9ic2VydmFibGU8VHJ1c3RlZEhUTUw+PigpO1xuXG4gIC8qKiBNYXAgZnJvbSBmb250IGlkZW50aWZpZXJzIHRvIHRoZWlyIENTUyBjbGFzcyBuYW1lcy4gVXNlZCBmb3IgaWNvbiBmb250cy4gKi9cbiAgcHJpdmF0ZSBfZm9udENzc0NsYXNzZXNCeUFsaWFzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICAvKiogUmVnaXN0ZXJlZCBpY29uIHJlc29sdmVyIGZ1bmN0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfcmVzb2x2ZXJzOiBJY29uUmVzb2x2ZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzZXMgdG8gYXBwbHkgd2hlbiBhbiBgPG1hdC1pY29uPmAgY29tcG9uZW50IGhhcyBubyBpY29uIG5hbWUsIHVybCwgb3IgZm9udFxuICAgKiBzcGVjaWZpZWQuIFRoZSBkZWZhdWx0ICdtYXRlcmlhbC1pY29ucycgdmFsdWUgYXNzdW1lcyB0aGF0IHRoZSBtYXRlcmlhbCBpY29uIGZvbnQgaGFzIGJlZW5cbiAgICogbG9hZGVkIGFzIGRlc2NyaWJlZCBhdCBodHRwczovL2dvb2dsZS5naXRodWIuaW8vbWF0ZXJpYWwtZGVzaWduLWljb25zLyNpY29uLWZvbnQtZm9yLXRoZS13ZWJcbiAgICovXG4gIHByaXZhdGUgX2RlZmF1bHRGb250U2V0Q2xhc3MgPSBbJ21hdGVyaWFsLWljb25zJywgJ21hdC1saWdhdHVyZS1mb250J107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIF9zYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2Vycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICApIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIGJ5IFVSTCBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uKGljb25OYW1lOiBzdHJpbmcsIHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uSW5OYW1lc3BhY2UoJycsIGljb25OYW1lLCB1cmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBsaXRlcmFsIFNWRyBzb3VyY2Ugb2YgdGhlIGljb24uXG4gICAqL1xuICBhZGRTdmdJY29uTGl0ZXJhbChpY29uTmFtZTogc3RyaW5nLCBsaXRlcmFsOiBTYWZlSHRtbCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvbkxpdGVyYWxJbk5hbWVzcGFjZSgnJywgaWNvbk5hbWUsIGxpdGVyYWwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIGJ5IFVSTCBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uSW5OYW1lc3BhY2UoXG4gICAgbmFtZXNwYWNlOiBzdHJpbmcsXG4gICAgaWNvbk5hbWU6IHN0cmluZyxcbiAgICB1cmw6IFNhZmVSZXNvdXJjZVVybCxcbiAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMsXG4gICk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uQ29uZmlnKG5hbWVzcGFjZSwgaWNvbk5hbWUsIG5ldyBTdmdJY29uQ29uZmlnKHVybCwgbnVsbCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHJlc29sdmVyIGZ1bmN0aW9uIHdpdGggdGhlIHJlZ2lzdHJ5LiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIHdpdGggdGhlXG4gICAqIG5hbWUgYW5kIG5hbWVzcGFjZSBvZiBhbiBpY29uIHdoZW4gdGhlIHJlZ2lzdHJ5IHRyaWVzIHRvIHJlc29sdmUgdGhlIFVSTCBmcm9tIHdoaWNoIHRvIGZldGNoXG4gICAqIHRoZSBpY29uLiBUaGUgcmVzb2x2ZXIgaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGEgYFNhZmVSZXNvdXJjZVVybGAgdGhhdCBwb2ludHMgdG8gdGhlIGljb24sXG4gICAqIGFuIG9iamVjdCB3aXRoIHRoZSBpY29uIFVSTCBhbmQgaWNvbiBvcHRpb25zLCBvciBgbnVsbGAgaWYgdGhlIGljb24gaXMgbm90IHN1cHBvcnRlZC4gUmVzb2x2ZXJzXG4gICAqIHdpbGwgYmUgaW52b2tlZCBpbiB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSBoYXZlIGJlZW4gcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHJlc29sdmVyIFJlc29sdmVyIGZ1bmN0aW9uIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBhZGRTdmdJY29uUmVzb2x2ZXIocmVzb2x2ZXI6IEljb25SZXNvbHZlcik6IHRoaXMge1xuICAgIHRoaXMuX3Jlc29sdmVycy5wdXNoKHJlc29sdmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uLlxuICAgKi9cbiAgYWRkU3ZnSWNvbkxpdGVyYWxJbk5hbWVzcGFjZShcbiAgICBuYW1lc3BhY2U6IHN0cmluZyxcbiAgICBpY29uTmFtZTogc3RyaW5nLFxuICAgIGxpdGVyYWw6IFNhZmVIdG1sLFxuICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyxcbiAgKTogdGhpcyB7XG4gICAgY29uc3QgY2xlYW5MaXRlcmFsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCBsaXRlcmFsKTtcblxuICAgIC8vIFRPRE86IGFkZCBhbiBuZ0Rldk1vZGUgY2hlY2tcbiAgICBpZiAoIWNsZWFuTGl0ZXJhbCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVMaXRlcmFsRXJyb3IobGl0ZXJhbCk7XG4gICAgfVxuXG4gICAgLy8gU2VjdXJpdHk6IFRoZSBsaXRlcmFsIGlzIHBhc3NlZCBpbiBhcyBTYWZlSHRtbCwgYW5kIGlzIHRodXMgdHJ1c3RlZC5cbiAgICBjb25zdCB0cnVzdGVkTGl0ZXJhbCA9IHRydXN0ZWRIVE1MRnJvbVN0cmluZyhjbGVhbkxpdGVyYWwpO1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uQ29uZmlnKFxuICAgICAgbmFtZXNwYWNlLFxuICAgICAgaWNvbk5hbWUsXG4gICAgICBuZXcgU3ZnSWNvbkNvbmZpZygnJywgdHJ1c3RlZExpdGVyYWwsIG9wdGlvbnMpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGJ5IFVSTCBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXQodXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZSgnJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uIHNldC5cbiAgICovXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsKGxpdGVyYWw6IFNhZmVIdG1sLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uU2V0TGl0ZXJhbEluTmFtZXNwYWNlKCcnLCBsaXRlcmFsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgYnkgVVJMIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZSwgbmV3IFN2Z0ljb25Db25maWcodXJsLCBudWxsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSBsaXRlcmFsIFNWRyBzb3VyY2Ugb2YgdGhlIGljb24gc2V0LlxuICAgKi9cbiAgYWRkU3ZnSWNvblNldExpdGVyYWxJbk5hbWVzcGFjZShcbiAgICBuYW1lc3BhY2U6IHN0cmluZyxcbiAgICBsaXRlcmFsOiBTYWZlSHRtbCxcbiAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMsXG4gICk6IHRoaXMge1xuICAgIGNvbnN0IGNsZWFuTGl0ZXJhbCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgbGl0ZXJhbCk7XG5cbiAgICBpZiAoIWNsZWFuTGl0ZXJhbCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVMaXRlcmFsRXJyb3IobGl0ZXJhbCk7XG4gICAgfVxuXG4gICAgLy8gU2VjdXJpdHk6IFRoZSBsaXRlcmFsIGlzIHBhc3NlZCBpbiBhcyBTYWZlSHRtbCwgYW5kIGlzIHRodXMgdHJ1c3RlZC5cbiAgICBjb25zdCB0cnVzdGVkTGl0ZXJhbCA9IHRydXN0ZWRIVE1MRnJvbVN0cmluZyhjbGVhbkxpdGVyYWwpO1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZSwgbmV3IFN2Z0ljb25Db25maWcoJycsIHRydXN0ZWRMaXRlcmFsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBhbGlhcyBmb3IgQ1NTIGNsYXNzIG5hbWVzIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMuIENyZWF0aW5nIGFuIG1hdEljb25cbiAgICogY29tcG9uZW50IHdpdGggdGhlIGFsaWFzIGFzIHRoZSBmb250U2V0IGlucHV0IHdpbGwgY2F1c2UgdGhlIGNsYXNzIG5hbWUgdG8gYmUgYXBwbGllZFxuICAgKiB0byB0aGUgYDxtYXQtaWNvbj5gIGVsZW1lbnQuXG4gICAqXG4gICAqIElmIHRoZSByZWdpc3RlcmVkIGZvbnQgaXMgYSBsaWdhdHVyZSBmb250LCB0aGVuIGRvbid0IGZvcmdldCB0byBhbHNvIGluY2x1ZGUgdGhlIHNwZWNpYWxcbiAgICogY2xhc3MgYG1hdC1saWdhdHVyZS1mb250YCB0byBhbGxvdyB0aGUgdXNhZ2UgdmlhIGF0dHJpYnV0ZS4gU28gcmVnaXN0ZXIgbGlrZSB0aGlzOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBpY29uUmVnaXN0cnkucmVnaXN0ZXJGb250Q2xhc3NBbGlhcygnZjEnLCAnZm9udDEgbWF0LWxpZ2F0dXJlLWZvbnQnKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEFuZCB1c2UgbGlrZSB0aGlzOlxuICAgKlxuICAgKiBgYGBodG1sXG4gICAqIDxtYXQtaWNvbiBmb250U2V0PVwiZjFcIiBmb250SWNvbj1cImhvbWVcIj48L21hdC1pY29uPlxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGFsaWFzIEFsaWFzIGZvciB0aGUgZm9udC5cbiAgICogQHBhcmFtIGNsYXNzTmFtZXMgQ2xhc3MgbmFtZXMgb3ZlcnJpZGUgdG8gYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSBhbGlhcy5cbiAgICovXG4gIHJlZ2lzdGVyRm9udENsYXNzQWxpYXMoYWxpYXM6IHN0cmluZywgY2xhc3NOYW1lczogc3RyaW5nID0gYWxpYXMpOiB0aGlzIHtcbiAgICB0aGlzLl9mb250Q3NzQ2xhc3Nlc0J5QWxpYXMuc2V0KGFsaWFzLCBjbGFzc05hbWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3MgbmFtZSBhc3NvY2lhdGVkIHdpdGggdGhlIGFsaWFzIGJ5IGEgcHJldmlvdXMgY2FsbCB0b1xuICAgKiByZWdpc3RlckZvbnRDbGFzc0FsaWFzLiBJZiBubyBDU1MgY2xhc3MgaGFzIGJlZW4gYXNzb2NpYXRlZCwgcmV0dXJucyB0aGUgYWxpYXMgdW5tb2RpZmllZC5cbiAgICovXG4gIGNsYXNzTmFtZUZvckZvbnRBbGlhcyhhbGlhczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZm9udENzc0NsYXNzZXNCeUFsaWFzLmdldChhbGlhcykgfHwgYWxpYXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgQ1NTIGNsYXNzZXMgdG8gYmUgdXNlZCBmb3IgaWNvbiBmb250cyB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgZG9lcyBub3RcbiAgICogaGF2ZSBhIGZvbnRTZXQgaW5wdXQgdmFsdWUsIGFuZCBpcyBub3QgbG9hZGluZyBhbiBpY29uIGJ5IG5hbWUgb3IgVVJMLlxuICAgKi9cbiAgc2V0RGVmYXVsdEZvbnRTZXRDbGFzcyguLi5jbGFzc05hbWVzOiBzdHJpbmdbXSk6IHRoaXMge1xuICAgIHRoaXMuX2RlZmF1bHRGb250U2V0Q2xhc3MgPSBjbGFzc05hbWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIENTUyBjbGFzc2VzIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMgd2hlbiBhbiBgPG1hdC1pY29uPmAgY29tcG9uZW50IGRvZXMgbm90XG4gICAqIGhhdmUgYSBmb250U2V0IGlucHV0IHZhbHVlLCBhbmQgaXMgbm90IGxvYWRpbmcgYW4gaWNvbiBieSBuYW1lIG9yIFVSTC5cbiAgICovXG4gIGdldERlZmF1bHRGb250U2V0Q2xhc3MoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0Rm9udFNldENsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHByb2R1Y2VzIHRoZSBpY29uIChhcyBhbiBgPHN2Zz5gIERPTSBlbGVtZW50KSBmcm9tIHRoZSBnaXZlbiBVUkwuXG4gICAqIFRoZSByZXNwb25zZSBmcm9tIHRoZSBVUkwgbWF5IGJlIGNhY2hlZCBzbyB0aGlzIHdpbGwgbm90IGFsd2F5cyBjYXVzZSBhbiBIVFRQIHJlcXVlc3QsIGJ1dFxuICAgKiB0aGUgcHJvZHVjZWQgZWxlbWVudCB3aWxsIGFsd2F5cyBiZSBhIG5ldyBjb3B5IG9mIHRoZSBvcmlnaW5hbGx5IGZldGNoZWQgaWNvbi4gKFRoYXQgaXMsXG4gICAqIGl0IHdpbGwgbm90IGNvbnRhaW4gYW55IG1vZGlmaWNhdGlvbnMgbWFkZSB0byBlbGVtZW50cyBwcmV2aW91c2x5IHJldHVybmVkKS5cbiAgICpcbiAgICogQHBhcmFtIHNhZmVVcmwgVVJMIGZyb20gd2hpY2ggdG8gZmV0Y2ggdGhlIFNWRyBpY29uLlxuICAgKi9cbiAgZ2V0U3ZnSWNvbkZyb21Vcmwoc2FmZVVybDogU2FmZVJlc291cmNlVXJsKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHNhZmVVcmwpO1xuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplVXJsRXJyb3Ioc2FmZVVybCk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FjaGVkSWNvbiA9IHRoaXMuX2NhY2hlZEljb25zQnlVcmwuZ2V0KHVybCk7XG5cbiAgICBpZiAoY2FjaGVkSWNvbikge1xuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjbG9uZVN2ZyhjYWNoZWRJY29uKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2xvYWRTdmdJY29uRnJvbUNvbmZpZyhuZXcgU3ZnSWNvbkNvbmZpZyhzYWZlVXJsLCBudWxsKSkucGlwZShcbiAgICAgIHRhcChzdmcgPT4gdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5zZXQodXJsISwgc3ZnKSksXG4gICAgICBtYXAoc3ZnID0+IGNsb25lU3ZnKHN2ZykpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgcHJvZHVjZXMgdGhlIGljb24gKGFzIGFuIGA8c3ZnPmAgRE9NIGVsZW1lbnQpIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICogYW5kIG5hbWVzcGFjZS4gVGhlIGljb24gbXVzdCBoYXZlIGJlZW4gcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggYWRkSWNvbiBvciBhZGRJY29uU2V0O1xuICAgKiBpZiBub3QsIHRoZSBPYnNlcnZhYmxlIHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGljb24gdG8gYmUgcmV0cmlldmVkLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byBsb29rIGZvciB0aGUgaWNvbi5cbiAgICovXG4gIGdldE5hbWVkU3ZnSWNvbihuYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nID0gJycpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICBjb25zdCBrZXkgPSBpY29uS2V5KG5hbWVzcGFjZSwgbmFtZSk7XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuX3N2Z0ljb25Db25maWdzLmdldChrZXkpO1xuXG4gICAgLy8gUmV0dXJuIChjb3B5IG9mKSBjYWNoZWQgaWNvbiBpZiBwb3NzaWJsZS5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0U3ZnRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSB0cnkgdG8gcmVzb2x2ZSB0aGUgY29uZmlnIGZyb20gb25lIG9mIHRoZSByZXNvbHZlciBmdW5jdGlvbnMuXG4gICAgY29uZmlnID0gdGhpcy5fZ2V0SWNvbkNvbmZpZ0Zyb21SZXNvbHZlcnMobmFtZXNwYWNlLCBuYW1lKTtcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuX3N2Z0ljb25Db25maWdzLnNldChrZXksIGNvbmZpZyk7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0U3ZnRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIC8vIFNlZSBpZiB3ZSBoYXZlIGFueSBpY29uIHNldHMgcmVnaXN0ZXJlZCBmb3IgdGhlIG5hbWVzcGFjZS5cbiAgICBjb25zdCBpY29uU2V0Q29uZmlncyA9IHRoaXMuX2ljb25TZXRDb25maWdzLmdldChuYW1lc3BhY2UpO1xuXG4gICAgaWYgKGljb25TZXRDb25maWdzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0U3ZnRnJvbUljb25TZXRDb25maWdzKG5hbWUsIGljb25TZXRDb25maWdzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93KGdldE1hdEljb25OYW1lTm90Rm91bmRFcnJvcihrZXkpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc29sdmVycyA9IFtdO1xuICAgIHRoaXMuX3N2Z0ljb25Db25maWdzLmNsZWFyKCk7XG4gICAgdGhpcy5faWNvblNldENvbmZpZ3MuY2xlYXIoKTtcbiAgICB0aGlzLl9jYWNoZWRJY29uc0J5VXJsLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY2FjaGVkIGljb24gZm9yIGEgU3ZnSWNvbkNvbmZpZyBpZiBhdmFpbGFibGUsIG9yIGZldGNoZXMgaXQgZnJvbSBpdHMgVVJMIGlmIG5vdC5cbiAgICovXG4gIHByaXZhdGUgX2dldFN2Z0Zyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgaWYgKGNvbmZpZy5zdmdUZXh0KSB7XG4gICAgICAvLyBXZSBhbHJlYWR5IGhhdmUgdGhlIFNWRyBlbGVtZW50IGZvciB0aGlzIGljb24sIHJldHVybiBhIGNvcHkuXG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGNsb25lU3ZnKHRoaXMuX3N2Z0VsZW1lbnRGcm9tQ29uZmlnKGNvbmZpZyBhcyBMb2FkZWRTdmdJY29uQ29uZmlnKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGZXRjaCB0aGUgaWNvbiBmcm9tIHRoZSBjb25maWcncyBVUkwsIGNhY2hlIGl0LCBhbmQgcmV0dXJuIGEgY29weS5cbiAgICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvbkZyb21Db25maWcoY29uZmlnKS5waXBlKG1hcChzdmcgPT4gY2xvbmVTdmcoc3ZnKSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBmaW5kIGFuIGljb24gd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgaW4gYW55IG9mIHRoZSBTVkcgaWNvbiBzZXRzLlxuICAgKiBGaXJzdCBzZWFyY2hlcyB0aGUgYXZhaWxhYmxlIGNhY2hlZCBpY29ucyBmb3IgYSBuZXN0ZWQgZWxlbWVudCB3aXRoIGEgbWF0Y2hpbmcgbmFtZSwgYW5kXG4gICAqIGlmIGZvdW5kIGNvcGllcyB0aGUgZWxlbWVudCB0byBhIG5ldyBgPHN2Zz5gIGVsZW1lbnQuIElmIG5vdCBmb3VuZCwgZmV0Y2hlcyBhbGwgaWNvbiBzZXRzXG4gICAqIHRoYXQgaGF2ZSBub3QgYmVlbiBjYWNoZWQsIGFuZCBzZWFyY2hlcyBhZ2FpbiBhZnRlciBhbGwgZmV0Y2hlcyBhcmUgY29tcGxldGVkLlxuICAgKiBUaGUgcmV0dXJuZWQgT2JzZXJ2YWJsZSBwcm9kdWNlcyB0aGUgU1ZHIGVsZW1lbnQgaWYgcG9zc2libGUsIGFuZCB0aHJvd3NcbiAgICogYW4gZXJyb3IgaWYgbm8gaWNvbiB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBjYW4gYmUgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTdmdGcm9tSWNvblNldENvbmZpZ3MoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGljb25TZXRDb25maWdzOiBTdmdJY29uQ29uZmlnW10sXG4gICk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIC8vIEZvciBhbGwgdGhlIGljb24gc2V0IFNWRyBlbGVtZW50cyB3ZSd2ZSBmZXRjaGVkLCBzZWUgaWYgYW55IGNvbnRhaW4gYW4gaWNvbiB3aXRoIHRoZVxuICAgIC8vIHJlcXVlc3RlZCBuYW1lLlxuICAgIGNvbnN0IG5hbWVkSWNvbiA9IHRoaXMuX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KG5hbWUsIGljb25TZXRDb25maWdzKTtcblxuICAgIGlmIChuYW1lZEljb24pIHtcbiAgICAgIC8vIFdlIGNvdWxkIGNhY2hlIG5hbWVkSWNvbiBpbiBfc3ZnSWNvbkNvbmZpZ3MsIGJ1dCBzaW5jZSB3ZSBoYXZlIHRvIG1ha2UgYSBjb3B5IGV2ZXJ5XG4gICAgICAvLyB0aW1lIGFueXdheSwgdGhlcmUncyBwcm9iYWJseSBub3QgbXVjaCBhZHZhbnRhZ2UgY29tcGFyZWQgdG8ganVzdCBhbHdheXMgZXh0cmFjdGluZ1xuICAgICAgLy8gaXQgZnJvbSB0aGUgaWNvbiBzZXQuXG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG5hbWVkSWNvbik7XG4gICAgfVxuXG4gICAgLy8gTm90IGZvdW5kIGluIGFueSBjYWNoZWQgaWNvbiBzZXRzLiBJZiB0aGVyZSBhcmUgaWNvbiBzZXRzIHdpdGggVVJMcyB0aGF0IHdlIGhhdmVuJ3RcbiAgICAvLyBmZXRjaGVkLCBmZXRjaCB0aGVtIG5vdyBhbmQgbG9vayBmb3IgaWNvbk5hbWUgaW4gdGhlIHJlc3VsdHMuXG4gICAgY29uc3QgaWNvblNldEZldGNoUmVxdWVzdHM6IE9ic2VydmFibGU8VHJ1c3RlZEhUTUwgfCBudWxsPltdID0gaWNvblNldENvbmZpZ3NcbiAgICAgIC5maWx0ZXIoaWNvblNldENvbmZpZyA9PiAhaWNvblNldENvbmZpZy5zdmdUZXh0KVxuICAgICAgLm1hcChpY29uU2V0Q29uZmlnID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRTdmdJY29uU2V0RnJvbUNvbmZpZyhpY29uU2V0Q29uZmlnKS5waXBlKFxuICAgICAgICAgIGNhdGNoRXJyb3IoKGVycjogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCBpY29uU2V0Q29uZmlnLnVybCk7XG5cbiAgICAgICAgICAgIC8vIFN3YWxsb3cgZXJyb3JzIGZldGNoaW5nIGluZGl2aWR1YWwgVVJMcyBzbyB0aGVcbiAgICAgICAgICAgIC8vIGNvbWJpbmVkIE9ic2VydmFibGUgd29uJ3QgbmVjZXNzYXJpbHkgZmFpbC5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBMb2FkaW5nIGljb24gc2V0IFVSTDogJHt1cmx9IGZhaWxlZDogJHtlcnIubWVzc2FnZX1gO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKTtcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIC8vIEZldGNoIGFsbCB0aGUgaWNvbiBzZXQgVVJMcy4gV2hlbiB0aGUgcmVxdWVzdHMgY29tcGxldGUsIGV2ZXJ5IEljb25TZXQgc2hvdWxkIGhhdmUgYVxuICAgIC8vIGNhY2hlZCBTVkcgZWxlbWVudCAodW5sZXNzIHRoZSByZXF1ZXN0IGZhaWxlZCksIGFuZCB3ZSBjYW4gY2hlY2sgYWdhaW4gZm9yIHRoZSBpY29uLlxuICAgIHJldHVybiBmb3JrSm9pbihpY29uU2V0RmV0Y2hSZXF1ZXN0cykucGlwZShcbiAgICAgIG1hcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvdW5kSWNvbiA9IHRoaXMuX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KG5hbWUsIGljb25TZXRDb25maWdzKTtcblxuICAgICAgICAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgICAgIGlmICghZm91bmRJY29uKSB7XG4gICAgICAgICAgdGhyb3cgZ2V0TWF0SWNvbk5hbWVOb3RGb3VuZEVycm9yKG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvdW5kSWNvbjtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgdGhlIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIHRoZSBnaXZlbiBpY29uIHNldHMgZm9yIGEgbmVzdGVkIGljb24gZWxlbWVudCB3aG9zZSBcImlkXCJcbiAgICogdGFnIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBuYW1lLiBJZiBmb3VuZCwgY29waWVzIHRoZSBuZXN0ZWQgZWxlbWVudCB0byBhIG5ldyBTVkcgZWxlbWVudCBhbmRcbiAgICogcmV0dXJucyBpdC4gUmV0dXJucyBudWxsIGlmIG5vIG1hdGNoaW5nIGVsZW1lbnQgaXMgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChcbiAgICBpY29uTmFtZTogc3RyaW5nLFxuICAgIGljb25TZXRDb25maWdzOiBTdmdJY29uQ29uZmlnW10sXG4gICk6IFNWR0VsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBJdGVyYXRlIGJhY2t3YXJkcywgc28gaWNvbiBzZXRzIGFkZGVkIGxhdGVyIGhhdmUgcHJlY2VkZW5jZS5cbiAgICBmb3IgKGxldCBpID0gaWNvblNldENvbmZpZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGljb25TZXRDb25maWdzW2ldO1xuXG4gICAgICAvLyBQYXJzaW5nIHRoZSBpY29uIHNldCdzIHRleHQgaW50byBhbiBTVkcgZWxlbWVudCBjYW4gYmUgZXhwZW5zaXZlLiBXZSBjYW4gYXZvaWQgc29tZSBvZlxuICAgICAgLy8gdGhlIHBhcnNpbmcgYnkgZG9pbmcgYSBxdWljayBjaGVjayB1c2luZyBgaW5kZXhPZmAgdG8gc2VlIGlmIHRoZXJlJ3MgYW55IGNoYW5jZSBmb3IgdGhlXG4gICAgICAvLyBpY29uIHRvIGJlIGluIHRoZSBzZXQuIFRoaXMgd29uJ3QgYmUgMTAwJSBhY2N1cmF0ZSwgYnV0IGl0IHNob3VsZCBoZWxwIHVzIGF2b2lkIGF0IGxlYXN0XG4gICAgICAvLyBzb21lIG9mIHRoZSBwYXJzaW5nLlxuICAgICAgaWYgKGNvbmZpZy5zdmdUZXh0ICYmIGNvbmZpZy5zdmdUZXh0LnRvU3RyaW5nKCkuaW5kZXhPZihpY29uTmFtZSkgPiAtMSkge1xuICAgICAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbUNvbmZpZyhjb25maWcgYXMgTG9hZGVkU3ZnSWNvbkNvbmZpZyk7XG4gICAgICAgIGNvbnN0IGZvdW5kSWNvbiA9IHRoaXMuX2V4dHJhY3RTdmdJY29uRnJvbVNldChzdmcsIGljb25OYW1lLCBjb25maWcub3B0aW9ucyk7XG4gICAgICAgIGlmIChmb3VuZEljb24pIHtcbiAgICAgICAgICByZXR1cm4gZm91bmRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjb250ZW50IG9mIHRoZSBpY29uIFVSTCBzcGVjaWZpZWQgaW4gdGhlIFN2Z0ljb25Db25maWcgYW5kIGNyZWF0ZXMgYW4gU1ZHIGVsZW1lbnRcbiAgICogZnJvbSBpdC5cbiAgICovXG4gIHByaXZhdGUgX2xvYWRTdmdJY29uRnJvbUNvbmZpZyhjb25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZmV0Y2hJY29uKGNvbmZpZykucGlwZShcbiAgICAgIHRhcChzdmdUZXh0ID0+IChjb25maWcuc3ZnVGV4dCA9IHN2Z1RleHQpKSxcbiAgICAgIG1hcCgoKSA9PiB0aGlzLl9zdmdFbGVtZW50RnJvbUNvbmZpZyhjb25maWcgYXMgTG9hZGVkU3ZnSWNvbkNvbmZpZykpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIGNvbnRlbnQgb2YgdGhlIGljb24gc2V0IFVSTCBzcGVjaWZpZWQgaW4gdGhlXG4gICAqIFN2Z0ljb25Db25maWcgYW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9sb2FkU3ZnSWNvblNldEZyb21Db25maWcoY29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxUcnVzdGVkSFRNTCB8IG51bGw+IHtcbiAgICBpZiAoY29uZmlnLnN2Z1RleHQpIHtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ZldGNoSWNvbihjb25maWcpLnBpcGUodGFwKHN2Z1RleHQgPT4gKGNvbmZpZy5zdmdUZXh0ID0gc3ZnVGV4dCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyB0aGUgY2FjaGVkIGVsZW1lbnQgb2YgdGhlIGdpdmVuIFN2Z0ljb25Db25maWcgZm9yIGEgbmVzdGVkIGljb24gZWxlbWVudCB3aG9zZSBcImlkXCJcbiAgICogdGFnIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBuYW1lLiBJZiBmb3VuZCwgY29waWVzIHRoZSBuZXN0ZWQgZWxlbWVudCB0byBhIG5ldyBTVkcgZWxlbWVudCBhbmRcbiAgICogcmV0dXJucyBpdC4gUmV0dXJucyBudWxsIGlmIG5vIG1hdGNoaW5nIGVsZW1lbnQgaXMgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9leHRyYWN0U3ZnSWNvbkZyb21TZXQoXG4gICAgaWNvblNldDogU1ZHRWxlbWVudCxcbiAgICBpY29uTmFtZTogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyxcbiAgKTogU1ZHRWxlbWVudCB8IG51bGwge1xuICAgIC8vIFVzZSB0aGUgYGlkPVwiaWNvbk5hbWVcImAgc3ludGF4IGluIG9yZGVyIHRvIGVzY2FwZSBzcGVjaWFsXG4gICAgLy8gY2hhcmFjdGVycyBpbiB0aGUgSUQgKHZlcnN1cyB1c2luZyB0aGUgI2ljb25OYW1lIHN5bnRheCkuXG4gICAgY29uc3QgaWNvblNvdXJjZSA9IGljb25TZXQucXVlcnlTZWxlY3RvcihgW2lkPVwiJHtpY29uTmFtZX1cIl1gKTtcblxuICAgIGlmICghaWNvblNvdXJjZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xvbmUgdGhlIGVsZW1lbnQgYW5kIHJlbW92ZSB0aGUgSUQgdG8gcHJldmVudCBtdWx0aXBsZSBlbGVtZW50cyBmcm9tIGJlaW5nIGFkZGVkXG4gICAgLy8gdG8gdGhlIHBhZ2Ugd2l0aCB0aGUgc2FtZSBJRC5cbiAgICBjb25zdCBpY29uRWxlbWVudCA9IGljb25Tb3VyY2UuY2xvbmVOb2RlKHRydWUpIGFzIEVsZW1lbnQ7XG4gICAgaWNvbkVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuXG4gICAgLy8gSWYgdGhlIGljb24gbm9kZSBpcyBpdHNlbGYgYW4gPHN2Zz4gbm9kZSwgY2xvbmUgYW5kIHJldHVybiBpdCBkaXJlY3RseS4gSWYgbm90LCBzZXQgaXQgYXNcbiAgICAvLyB0aGUgY29udGVudCBvZiBhIG5ldyA8c3ZnPiBub2RlLlxuICAgIGlmIChpY29uRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXMoaWNvbkVsZW1lbnQgYXMgU1ZHRWxlbWVudCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG5vZGUgaXMgYSA8c3ltYm9sPiwgaXQgd29uJ3QgYmUgcmVuZGVyZWQgc28gd2UgaGF2ZSB0byBjb252ZXJ0IGl0IGludG8gPHN2Zz4uIE5vdGVcbiAgICAvLyB0aGF0IHRoZSBzYW1lIGNvdWxkIGJlIGFjaGlldmVkIGJ5IHJlZmVycmluZyB0byBpdCB2aWEgPHVzZSBocmVmPVwiI2lkXCI+LCBob3dldmVyIHRoZSA8dXNlPlxuICAgIC8vIHRhZyBpcyBwcm9ibGVtYXRpYyBvbiBGaXJlZm94LCBiZWNhdXNlIGl0IG5lZWRzIHRvIGluY2x1ZGUgdGhlIGN1cnJlbnQgcGFnZSBwYXRoLlxuICAgIGlmIChpY29uRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXModGhpcy5fdG9TdmdFbGVtZW50KGljb25FbGVtZW50KSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlRWxlbWVudCgnU1ZHJykgZG9lc24ndCB3b3JrIGFzIGV4cGVjdGVkOyB0aGUgRE9NIGVuZHMgdXAgd2l0aFxuICAgIC8vIHRoZSBjb3JyZWN0IG5vZGVzLCBidXQgdGhlIFNWRyBjb250ZW50IGRvZXNuJ3QgcmVuZGVyLiBJbnN0ZWFkIHdlXG4gICAgLy8gaGF2ZSB0byBjcmVhdGUgYW4gZW1wdHkgU1ZHIG5vZGUgdXNpbmcgaW5uZXJIVE1MIGFuZCBhcHBlbmQgaXRzIGNvbnRlbnQuXG4gICAgLy8gRWxlbWVudHMgY3JlYXRlZCB1c2luZyBET01QYXJzZXIucGFyc2VGcm9tU3RyaW5nIGhhdmUgdGhlIHNhbWUgcHJvYmxlbS5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIzMDAzMjc4L3N2Zy1pbm5lcmh0bWwtaW4tZmlyZWZveC1jYW4tbm90LWRpc3BsYXlcbiAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZyh0cnVzdGVkSFRNTEZyb21TdHJpbmcoJzxzdmc+PC9zdmc+JykpO1xuICAgIC8vIENsb25lIHRoZSBub2RlIHNvIHdlIGRvbid0IHJlbW92ZSBpdCBmcm9tIHRoZSBwYXJlbnQgaWNvbiBzZXQgZWxlbWVudC5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoaWNvbkVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXMoc3ZnLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgRE9NIGVsZW1lbnQgZnJvbSB0aGUgZ2l2ZW4gU1ZHIHN0cmluZy5cbiAgICovXG4gIHByaXZhdGUgX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKHN0cjogVHJ1c3RlZEhUTUwpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBkaXYgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyIGFzIHVua25vd24gYXMgc3RyaW5nO1xuICAgIGNvbnN0IHN2ZyA9IGRpdi5xdWVyeVNlbGVjdG9yKCdzdmcnKSBhcyBTVkdFbGVtZW50O1xuXG4gICAgLy8gVE9ETzogYWRkIGFuIG5nRGV2TW9kZSBjaGVja1xuICAgIGlmICghc3ZnKSB7XG4gICAgICB0aHJvdyBFcnJvcignPHN2Zz4gdGFnIG5vdCBmb3VuZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYW4gZWxlbWVudCBpbnRvIGFuIFNWRyBub2RlIGJ5IGNsb25pbmcgYWxsIG9mIGl0cyBjaGlsZHJlbi5cbiAgICovXG4gIHByaXZhdGUgX3RvU3ZnRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcodHJ1c3RlZEhUTUxGcm9tU3RyaW5nKCc8c3ZnPjwvc3ZnPicpKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzO1xuXG4gICAgLy8gQ29weSBvdmVyIGFsbCB0aGUgYXR0cmlidXRlcyBmcm9tIHRoZSBgc3ltYm9sYCB0byB0aGUgbmV3IFNWRywgZXhjZXB0IHRoZSBpZC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHtuYW1lLCB2YWx1ZX0gPSBhdHRyaWJ1dGVzW2ldO1xuXG4gICAgICBpZiAobmFtZSAhPT0gJ2lkJykge1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGROb2Rlc1tpXS5ub2RlVHlwZSA9PT0gdGhpcy5fZG9jdW1lbnQuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChlbGVtZW50LmNoaWxkTm9kZXNbaV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgYXR0cmlidXRlcyBmb3IgYW4gU1ZHIGVsZW1lbnQgdG8gYmUgdXNlZCBhcyBhbiBpY29uLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0U3ZnQXR0cmlidXRlcyhzdmc6IFNWR0VsZW1lbnQsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IFNWR0VsZW1lbnQge1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpdCcsICcnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdmb2N1c2FibGUnLCAnZmFsc2UnKTsgLy8gRGlzYWJsZSBJRTExIGRlZmF1bHQgYmVoYXZpb3IgdG8gbWFrZSBTVkdzIGZvY3VzYWJsZS5cblxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudmlld0JveCkge1xuICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIG9wdGlvbnMudmlld0JveCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgd2hpY2ggcHJvZHVjZXMgdGhlIHN0cmluZyBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gaWNvbi4gUmVzdWx0cyBtYXkgYmVcbiAgICogY2FjaGVkLCBzbyBmdXR1cmUgY2FsbHMgd2l0aCB0aGUgc2FtZSBVUkwgbWF5IG5vdCBjYXVzZSBhbm90aGVyIEhUVFAgcmVxdWVzdC5cbiAgICovXG4gIHByaXZhdGUgX2ZldGNoSWNvbihpY29uQ29uZmlnOiBTdmdJY29uQ29uZmlnKTogT2JzZXJ2YWJsZTxUcnVzdGVkSFRNTD4ge1xuICAgIGNvbnN0IHt1cmw6IHNhZmVVcmwsIG9wdGlvbnN9ID0gaWNvbkNvbmZpZztcbiAgICBjb25zdCB3aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zPy53aXRoQ3JlZGVudGlhbHMgPz8gZmFsc2U7XG5cbiAgICBpZiAoIXRoaXMuX2h0dHBDbGllbnQpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25Ob0h0dHBQcm92aWRlckVycm9yKCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogYWRkIGFuIG5nRGV2TW9kZSBjaGVja1xuICAgIGlmIChzYWZlVXJsID09IG51bGwpIHtcbiAgICAgIHRocm93IEVycm9yKGBDYW5ub3QgZmV0Y2ggaWNvbiBmcm9tIFVSTCBcIiR7c2FmZVVybH1cIi5gKTtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlJFU09VUkNFX1VSTCwgc2FmZVVybCk7XG5cbiAgICAvLyBUT0RPOiBhZGQgYW4gbmdEZXZNb2RlIGNoZWNrXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplVXJsRXJyb3Ioc2FmZVVybCk7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgaW4tcHJvZ3Jlc3MgZmV0Y2hlcyB0byBhdm9pZCBzZW5kaW5nIGEgZHVwbGljYXRlIHJlcXVlc3QgZm9yIGEgVVJMIHdoZW4gdGhlcmUgaXNcbiAgICAvLyBhbHJlYWR5IGEgcmVxdWVzdCBpbiBwcm9ncmVzcyBmb3IgdGhhdCBVUkwuIEl0J3MgbmVjZXNzYXJ5IHRvIGNhbGwgc2hhcmUoKSBvbiB0aGVcbiAgICAvLyBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGh0dHAuZ2V0KCkgc28gdGhhdCBtdWx0aXBsZSBzdWJzY3JpYmVycyBkb24ndCBjYXVzZSBtdWx0aXBsZSBYSFJzLlxuICAgIGNvbnN0IGluUHJvZ3Jlc3NGZXRjaCA9IHRoaXMuX2luUHJvZ3Jlc3NVcmxGZXRjaGVzLmdldCh1cmwpO1xuXG4gICAgaWYgKGluUHJvZ3Jlc3NGZXRjaCkge1xuICAgICAgcmV0dXJuIGluUHJvZ3Jlc3NGZXRjaDtcbiAgICB9XG5cbiAgICBjb25zdCByZXEgPSB0aGlzLl9odHRwQ2xpZW50LmdldCh1cmwsIHtyZXNwb25zZVR5cGU6ICd0ZXh0Jywgd2l0aENyZWRlbnRpYWxzfSkucGlwZShcbiAgICAgIG1hcChzdmcgPT4ge1xuICAgICAgICAvLyBTZWN1cml0eTogVGhpcyBTVkcgaXMgZmV0Y2hlZCBmcm9tIGEgU2FmZVJlc291cmNlVXJsLCBhbmQgaXMgdGh1c1xuICAgICAgICAvLyB0cnVzdGVkIEhUTUwuXG4gICAgICAgIHJldHVybiB0cnVzdGVkSFRNTEZyb21TdHJpbmcoc3ZnKTtcbiAgICAgIH0pLFxuICAgICAgZmluYWxpemUoKCkgPT4gdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuZGVsZXRlKHVybCkpLFxuICAgICAgc2hhcmUoKSxcbiAgICApO1xuXG4gICAgdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuc2V0KHVybCwgcmVxKTtcbiAgICByZXR1cm4gcmVxO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIGNvbmZpZyBieSBuYW1lIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBjb25maWcuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBjb25maWcuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBwcml2YXRlIF9hZGRTdmdJY29uQ29uZmlnKG5hbWVzcGFjZTogc3RyaW5nLCBpY29uTmFtZTogc3RyaW5nLCBjb25maWc6IFN2Z0ljb25Db25maWcpOiB0aGlzIHtcbiAgICB0aGlzLl9zdmdJY29uQ29uZmlncy5zZXQoaWNvbktleShuYW1lc3BhY2UsIGljb25OYW1lKSwgY29uZmlnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgY29uZmlnIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBjb25maWcuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBwcml2YXRlIF9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZTogc3RyaW5nLCBjb25maWc6IFN2Z0ljb25Db25maWcpOiB0aGlzIHtcbiAgICBjb25zdCBjb25maWdOYW1lc3BhY2UgPSB0aGlzLl9pY29uU2V0Q29uZmlncy5nZXQobmFtZXNwYWNlKTtcblxuICAgIGlmIChjb25maWdOYW1lc3BhY2UpIHtcbiAgICAgIGNvbmZpZ05hbWVzcGFjZS5wdXNoKGNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ljb25TZXRDb25maWdzLnNldChuYW1lc3BhY2UsIFtjb25maWddKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBQYXJzZXMgYSBjb25maWcncyB0ZXh0IGludG8gYW4gU1ZHIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3N2Z0VsZW1lbnRGcm9tQ29uZmlnKGNvbmZpZzogTG9hZGVkU3ZnSWNvbkNvbmZpZyk6IFNWR0VsZW1lbnQge1xuICAgIGlmICghY29uZmlnLnN2Z0VsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKGNvbmZpZy5zdmdUZXh0KTtcbiAgICAgIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXMoc3ZnLCBjb25maWcub3B0aW9ucyk7XG4gICAgICBjb25maWcuc3ZnRWxlbWVudCA9IHN2ZztcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnLnN2Z0VsZW1lbnQ7XG4gIH1cblxuICAvKiogVHJpZXMgdG8gY3JlYXRlIGFuIGljb24gY29uZmlnIHRocm91Z2ggdGhlIHJlZ2lzdGVyZWQgcmVzb2x2ZXIgZnVuY3Rpb25zLiAqL1xuICBwcml2YXRlIF9nZXRJY29uQ29uZmlnRnJvbVJlc29sdmVycyhuYW1lc3BhY2U6IHN0cmluZywgbmFtZTogc3RyaW5nKTogU3ZnSWNvbkNvbmZpZyB8IHVuZGVmaW5lZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9yZXNvbHZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3Jlc29sdmVyc1tpXShuYW1lLCBuYW1lc3BhY2UpO1xuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiBpc1NhZmVVcmxXaXRoT3B0aW9ucyhyZXN1bHQpXG4gICAgICAgICAgPyBuZXcgU3ZnSWNvbkNvbmZpZyhyZXN1bHQudXJsLCBudWxsLCByZXN1bHQub3B0aW9ucylcbiAgICAgICAgICA6IG5ldyBTdmdJY29uQ29uZmlnKHJlc3VsdCwgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIElDT05fUkVHSVNUUllfUFJPVklERVJfRkFDVE9SWShcbiAgcGFyZW50UmVnaXN0cnk6IE1hdEljb25SZWdpc3RyeSxcbiAgaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBkb2N1bWVudD86IGFueSxcbikge1xuICByZXR1cm4gcGFyZW50UmVnaXN0cnkgfHwgbmV3IE1hdEljb25SZWdpc3RyeShodHRwQ2xpZW50LCBzYW5pdGl6ZXIsIGRvY3VtZW50LCBlcnJvckhhbmRsZXIpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IElDT05fUkVHSVNUUllfUFJPVklERVIgPSB7XG4gIC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYW4gTWF0SWNvblJlZ2lzdHJ5IGF2YWlsYWJsZSwgdXNlIHRoYXQuIE90aGVyd2lzZSwgcHJvdmlkZSBhIG5ldyBvbmUuXG4gIHByb3ZpZGU6IE1hdEljb25SZWdpc3RyeSxcbiAgZGVwczogW1xuICAgIFtuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdEljb25SZWdpc3RyeV0sXG4gICAgW25ldyBPcHRpb25hbCgpLCBIdHRwQ2xpZW50XSxcbiAgICBEb21TYW5pdGl6ZXIsXG4gICAgRXJyb3JIYW5kbGVyLFxuICAgIFtuZXcgT3B0aW9uYWwoKSwgRE9DVU1FTlQgYXMgSW5qZWN0aW9uVG9rZW48YW55Pl0sXG4gIF0sXG4gIHVzZUZhY3Rvcnk6IElDT05fUkVHSVNUUllfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cbi8qKiBDbG9uZXMgYW4gU1ZHRWxlbWVudCB3aGlsZSBwcmVzZXJ2aW5nIHR5cGUgaW5mb3JtYXRpb24uICovXG5mdW5jdGlvbiBjbG9uZVN2Zyhzdmc6IFNWR0VsZW1lbnQpOiBTVkdFbGVtZW50IHtcbiAgcmV0dXJuIHN2Zy5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHRWxlbWVudDtcbn1cblxuLyoqIFJldHVybnMgdGhlIGNhY2hlIGtleSB0byB1c2UgZm9yIGFuIGljb24gbmFtZXNwYWNlIGFuZCBuYW1lLiAqL1xuZnVuY3Rpb24gaWNvbktleShuYW1lc3BhY2U6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBuYW1lc3BhY2UgKyAnOicgKyBuYW1lO1xufVxuXG5mdW5jdGlvbiBpc1NhZmVVcmxXaXRoT3B0aW9ucyh2YWx1ZTogYW55KTogdmFsdWUgaXMgU2FmZVJlc291cmNlVXJsV2l0aEljb25PcHRpb25zIHtcbiAgcmV0dXJuICEhKHZhbHVlLnVybCAmJiB2YWx1ZS5vcHRpb25zKTtcbn1cbiJdfQ==