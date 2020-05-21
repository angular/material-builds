import { __decorate, __metadata, __param } from "tslib";
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
let MatIconRegistry = /** @class */ (() => {
    let MatIconRegistry = class MatIconRegistry {
        constructor(_httpClient, _sanitizer, document, 
        // @breaking-change 9.0.0 _errorHandler parameter to be made required
        _errorHandler) {
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
                    // @breaking-change 9.0.0 _errorHandler parameter to be made required
                    if (this._errorHandler) {
                        this._errorHandler.handleError(new Error(errorMessage));
                    }
                    else {
                        console.error(errorMessage);
                    }
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
    };
    MatIconRegistry.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatIconRegistry_Factory() { return new MatIconRegistry(i0.ɵɵinject(i1.HttpClient, 8), i0.ɵɵinject(i2.DomSanitizer), i0.ɵɵinject(i3.DOCUMENT, 8), i0.ɵɵinject(i0.ErrorHandler, 8)); }, token: MatIconRegistry, providedIn: "root" });
    MatIconRegistry = __decorate([
        Injectable({ providedIn: 'root' }),
        __param(0, Optional()),
        __param(2, Optional()), __param(2, Inject(DOCUMENT)),
        __param(3, Optional()),
        __metadata("design:paramtypes", [HttpClient,
            DomSanitizer, Object, ErrorHandler])
    ], MatIconRegistry);
    return MatIconRegistry;
})();
export { MatIconRegistry };
/** @docs-private */
export function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, httpClient, sanitizer, document, errorHandler) {
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
        [new Optional(), ErrorHandler],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsVUFBVSxFQUFvQixNQUFNLHNCQUFzQixDQUFDO0FBQ25FLE9BQU8sRUFDTCxZQUFZLEVBQ1osTUFBTSxFQUNOLFVBQVUsRUFFVixRQUFRLEVBQ1IsZUFBZSxFQUNmLFFBQVEsR0FFVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsWUFBWSxFQUE0QixNQUFNLDJCQUEyQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxRQUFRLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxVQUFVLElBQUksZUFBZSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBR3JFOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsMkJBQTJCLENBQUMsUUFBZ0I7SUFDMUQsT0FBTyxLQUFLLENBQUMsc0NBQXNDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUdEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsNkJBQTZCO0lBQzNDLE9BQU8sS0FBSyxDQUFDLDBFQUEwRTtRQUMxRSx3RUFBd0U7UUFDeEUsY0FBYyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUdEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsa0NBQWtDLENBQUMsR0FBb0I7SUFDckUsT0FBTyxLQUFLLENBQUMsd0VBQXdFO1FBQ3hFLGtEQUFrRCxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gs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RCxtRUFBbUU7QUFDbkUsU0FBUyxPQUFPLENBQUMsU0FBaUIsRUFBRSxJQUFZO0lBQzlDLE9BQU8sU0FBUyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwRXJyb3JSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtcbiAgRXJyb3JIYW5kbGVyLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIEluamVjdGlvblRva2VuLFxuICBPcHRpb25hbCxcbiAgU2VjdXJpdHlDb250ZXh0LFxuICBTa2lwU2VsZixcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RG9tU2FuaXRpemVyLCBTYWZlUmVzb3VyY2VVcmwsIFNhZmVIdG1sfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7Zm9ya0pvaW4sIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiwgdGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3d9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjYXRjaEVycm9yLCBmaW5hbGl6ZSwgbWFwLCBzaGFyZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gaW4gdGhlIGNhc2Ugd2hlbiBhdHRlbXB0aW5nIHRvXG4gKiBsb2FkIGFuIGljb24gd2l0aCBhIG5hbWUgdGhhdCBjYW5ub3QgYmUgZm91bmQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3IoaWNvbk5hbWU6IHN0cmluZyk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKGBVbmFibGUgdG8gZmluZCBpY29uIHdpdGggdGhlIG5hbWUgXCIke2ljb25OYW1lfVwiYCk7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gd2hlbiB0aGUgY29uc3VtZXIgYXR0ZW1wdHMgdG8gdXNlXG4gKiBgPG1hdC1pY29uPmAgd2l0aG91dCBpbmNsdWRpbmcgQGFuZ3VsYXIvY29tbW9uL2h0dHAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uTm9IdHRwUHJvdmlkZXJFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcignQ291bGQgbm90IGZpbmQgSHR0cENsaWVudCBwcm92aWRlciBmb3IgdXNlIHdpdGggQW5ndWxhciBNYXRlcmlhbCBpY29ucy4gJyArXG4gICAgICAgICAgICAgICAnUGxlYXNlIGluY2x1ZGUgdGhlIEh0dHBDbGllbnRNb2R1bGUgZnJvbSBAYW5ndWxhci9jb21tb24vaHR0cCBpbiB5b3VyICcgK1xuICAgICAgICAgICAgICAgJ2FwcCBpbXBvcnRzLicpO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gYSBVUkwgY291bGRuJ3QgYmUgc2FuaXRpemVkLlxuICogQHBhcmFtIHVybCBVUkwgdGhhdCB3YXMgYXR0ZW1wdGVkIHRvIGJlIHNhbml0aXplZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplVXJsRXJyb3IodXJsOiBTYWZlUmVzb3VyY2VVcmwpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihgVGhlIFVSTCBwcm92aWRlZCB0byBNYXRJY29uUmVnaXN0cnkgd2FzIG5vdCB0cnVzdGVkIGFzIGEgcmVzb3VyY2UgVVJMIGAgK1xuICAgICAgICAgICAgICAgYHZpYSBBbmd1bGFyJ3MgRG9tU2FuaXRpemVyLiBBdHRlbXB0ZWQgVVJMIHdhcyBcIiR7dXJsfVwiLmApO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGEgSFRNTCBzdHJpbmcgY291bGRuJ3QgYmUgc2FuaXRpemVkLlxuICogQHBhcmFtIGxpdGVyYWwgSFRNTCB0aGF0IHdhcyBhdHRlbXB0ZWQgdG8gYmUgc2FuaXRpemVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVMaXRlcmFsRXJyb3IobGl0ZXJhbDogU2FmZUh0bWwpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihgVGhlIGxpdGVyYWwgcHJvdmlkZWQgdG8gTWF0SWNvblJlZ2lzdHJ5IHdhcyBub3QgdHJ1c3RlZCBhcyBzYWZlIEhUTUwgYnkgYCArXG4gICAgICAgICAgICAgICBgQW5ndWxhcidzIERvbVNhbml0aXplci4gQXR0ZW1wdGVkIGxpdGVyYWwgd2FzIFwiJHtsaXRlcmFsfVwiLmApO1xufVxuXG4vKiogT3B0aW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSBob3cgYW4gaWNvbiBvciB0aGUgaWNvbnMgaW4gYW4gaWNvbiBzZXQgYXJlIHByZXNlbnRlZC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSWNvbk9wdGlvbnMge1xuICAvKiogVmlldyBib3ggdG8gc2V0IG9uIHRoZSBpY29uLiAqL1xuICB2aWV3Qm94Pzogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0byBmZXRjaCB0aGUgaWNvbiBvciBpY29uIHNldCB1c2luZyBIVFRQIGNyZWRlbnRpYWxzLiAqL1xuICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGFuIGljb24sIGluY2x1ZGluZyB0aGUgVVJMIGFuZCBwb3NzaWJseSB0aGUgY2FjaGVkIFNWRyBlbGVtZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jbGFzcyBTdmdJY29uQ29uZmlnIHtcbiAgdXJsOiBTYWZlUmVzb3VyY2VVcmwgfCBudWxsO1xuICBzdmdFbGVtZW50OiBTVkdFbGVtZW50IHwgbnVsbDtcblxuICBjb25zdHJ1Y3Rvcih1cmw6IFNhZmVSZXNvdXJjZVVybCwgb3B0aW9ucz86IEljb25PcHRpb25zKTtcbiAgY29uc3RydWN0b3Ioc3ZnRWxlbWVudDogU1ZHRWxlbWVudCwgb3B0aW9ucz86IEljb25PcHRpb25zKTtcbiAgY29uc3RydWN0b3IoZGF0YTogU2FmZVJlc291cmNlVXJsIHwgU1ZHRWxlbWVudCwgcHVibGljIG9wdGlvbnM/OiBJY29uT3B0aW9ucykge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4ndCB1c2UgYGluc3RhbmNlb2YgU1ZHRWxlbWVudGAgaGVyZSxcbiAgICAvLyBiZWNhdXNlIGl0J2xsIGJyZWFrIGR1cmluZyBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuXG4gICAgaWYgKCEhKGRhdGEgYXMgYW55KS5ub2RlTmFtZSkge1xuICAgICAgdGhpcy5zdmdFbGVtZW50ID0gZGF0YSBhcyBTVkdFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IGRhdGEgYXMgU2FmZVJlc291cmNlVXJsO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNlcnZpY2UgdG8gcmVnaXN0ZXIgYW5kIGRpc3BsYXkgaWNvbnMgdXNlZCBieSB0aGUgYDxtYXQtaWNvbj5gIGNvbXBvbmVudC5cbiAqIC0gUmVnaXN0ZXJzIGljb24gVVJMcyBieSBuYW1lc3BhY2UgYW5kIG5hbWUuXG4gKiAtIFJlZ2lzdGVycyBpY29uIHNldCBVUkxzIGJ5IG5hbWVzcGFjZS5cbiAqIC0gUmVnaXN0ZXJzIGFsaWFzZXMgZm9yIENTUyBjbGFzc2VzLCBmb3IgdXNlIHdpdGggaWNvbiBmb250cy5cbiAqIC0gTG9hZHMgaWNvbnMgZnJvbSBVUkxzIGFuZCBleHRyYWN0cyBpbmRpdmlkdWFsIGljb25zIGZyb20gaWNvbiBzZXRzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRJY29uUmVnaXN0cnkgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqXG4gICAqIFVSTHMgYW5kIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIGluZGl2aWR1YWwgaWNvbnMuIEtleXMgYXJlIG9mIHRoZSBmb3JtYXQgXCJbbmFtZXNwYWNlXTpbaWNvbl1cIi5cbiAgICovXG4gIHByaXZhdGUgX3N2Z0ljb25Db25maWdzID0gbmV3IE1hcDxzdHJpbmcsIFN2Z0ljb25Db25maWc+KCk7XG5cbiAgLyoqXG4gICAqIFN2Z0ljb25Db25maWcgb2JqZWN0cyBhbmQgY2FjaGVkIFNWRyBlbGVtZW50cyBmb3IgaWNvbiBzZXRzLCBrZXllZCBieSBuYW1lc3BhY2UuXG4gICAqIE11bHRpcGxlIGljb24gc2V0cyBjYW4gYmUgcmVnaXN0ZXJlZCB1bmRlciB0aGUgc2FtZSBuYW1lc3BhY2UuXG4gICAqL1xuICBwcml2YXRlIF9pY29uU2V0Q29uZmlncyA9IG5ldyBNYXA8c3RyaW5nLCBTdmdJY29uQ29uZmlnW10+KCk7XG5cbiAgLyoqIENhY2hlIGZvciBpY29ucyBsb2FkZWQgYnkgZGlyZWN0IFVSTHMuICovXG4gIHByaXZhdGUgX2NhY2hlZEljb25zQnlVcmwgPSBuZXcgTWFwPHN0cmluZywgU1ZHRWxlbWVudD4oKTtcblxuICAvKiogSW4tcHJvZ3Jlc3MgaWNvbiBmZXRjaGVzLiBVc2VkIHRvIGNvYWxlc2NlIG11bHRpcGxlIHJlcXVlc3RzIHRvIHRoZSBzYW1lIFVSTC4gKi9cbiAgcHJpdmF0ZSBfaW5Qcm9ncmVzc1VybEZldGNoZXMgPSBuZXcgTWFwPHN0cmluZywgT2JzZXJ2YWJsZTxzdHJpbmc+PigpO1xuXG4gIC8qKiBNYXAgZnJvbSBmb250IGlkZW50aWZpZXJzIHRvIHRoZWlyIENTUyBjbGFzcyBuYW1lcy4gVXNlZCBmb3IgaWNvbiBmb250cy4gKi9cbiAgcHJpdmF0ZSBfZm9udENzc0NsYXNzZXNCeUFsaWFzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICAvKipcbiAgICogVGhlIENTUyBjbGFzcyB0byBhcHBseSB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgaGFzIG5vIGljb24gbmFtZSwgdXJsLCBvciBmb250IHNwZWNpZmllZC5cbiAgICogVGhlIGRlZmF1bHQgJ21hdGVyaWFsLWljb25zJyB2YWx1ZSBhc3N1bWVzIHRoYXQgdGhlIG1hdGVyaWFsIGljb24gZm9udCBoYXMgYmVlbiBsb2FkZWQgYXNcbiAgICogZGVzY3JpYmVkIGF0IGh0dHA6Ly9nb29nbGUuZ2l0aHViLmlvL21hdGVyaWFsLWRlc2lnbi1pY29ucy8jaWNvbi1mb250LWZvci10aGUtd2ViXG4gICAqL1xuICBwcml2YXRlIF9kZWZhdWx0Rm9udFNldENsYXNzID0gJ21hdGVyaWFsLWljb25zJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9odHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgX3Nhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBfZXJyb3JIYW5kbGVyIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByZWFkb25seSBfZXJyb3JIYW5kbGVyPzogRXJyb3JIYW5kbGVyKSB7XG4gICAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gYnkgVVJMIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb24oaWNvbk5hbWU6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25Jbk5hbWVzcGFjZSgnJywgaWNvbk5hbWUsIHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIGxpdGVyYWwgU1ZHIHNvdXJjZSBvZiB0aGUgaWNvbi5cbiAgICovXG4gIGFkZFN2Z0ljb25MaXRlcmFsKGljb25OYW1lOiBzdHJpbmcsIGxpdGVyYWw6IFNhZmVIdG1sLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uTGl0ZXJhbEluTmFtZXNwYWNlKCcnLCBpY29uTmFtZSwgbGl0ZXJhbCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gYnkgVVJMIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgaWNvbk5hbWU6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2UsIGljb25OYW1lLCBuZXcgU3ZnSWNvbkNvbmZpZyh1cmwsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uLlxuICAgKi9cbiAgYWRkU3ZnSWNvbkxpdGVyYWxJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgaWNvbk5hbWU6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgY29uc3Qgc2FuaXRpemVkTGl0ZXJhbCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgbGl0ZXJhbCk7XG5cbiAgICBpZiAoIXNhbml0aXplZExpdGVyYWwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHN2Z0VsZW1lbnQgPSB0aGlzLl9jcmVhdGVTdmdFbGVtZW50Rm9yU2luZ2xlSWNvbihzYW5pdGl6ZWRMaXRlcmFsLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2UsIGljb25OYW1lLCBuZXcgU3ZnSWNvbkNvbmZpZyhzdmdFbGVtZW50LCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGJ5IFVSTCBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXQodXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLmFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZSgnJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uIHNldC5cbiAgICovXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsKGxpdGVyYWw6IFNhZmVIdG1sLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uU2V0TGl0ZXJhbEluTmFtZXNwYWNlKCcnLCBsaXRlcmFsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgYnkgVVJMIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSB1cmxcbiAgICovXG4gIGFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgdXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLl9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZSwgbmV3IFN2Z0ljb25Db25maWcodXJsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBzZXQuXG4gICAqIEBwYXJhbSBsaXRlcmFsIFNWRyBzb3VyY2Ugb2YgdGhlIGljb24gc2V0LlxuICAgKi9cbiAgYWRkU3ZnSWNvblNldExpdGVyYWxJbk5hbWVzcGFjZShuYW1lc3BhY2U6IHN0cmluZywgbGl0ZXJhbDogU2FmZUh0bWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgY29uc3Qgc2FuaXRpemVkTGl0ZXJhbCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgbGl0ZXJhbCk7XG5cbiAgICBpZiAoIXNhbml0aXplZExpdGVyYWwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHN2Z0VsZW1lbnQgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZyhzYW5pdGl6ZWRMaXRlcmFsKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2UsIG5ldyBTdmdJY29uQ29uZmlnKHN2Z0VsZW1lbnQsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIGFsaWFzIGZvciBhIENTUyBjbGFzcyBuYW1lIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMuIENyZWF0aW5nIGFuIG1hdEljb25cbiAgICogY29tcG9uZW50IHdpdGggdGhlIGFsaWFzIGFzIHRoZSBmb250U2V0IGlucHV0IHdpbGwgY2F1c2UgdGhlIGNsYXNzIG5hbWUgdG8gYmUgYXBwbGllZFxuICAgKiB0byB0aGUgYDxtYXQtaWNvbj5gIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBhbGlhcyBBbGlhcyBmb3IgdGhlIGZvbnQuXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgQ2xhc3MgbmFtZSBvdmVycmlkZSB0byBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGFsaWFzLlxuICAgKi9cbiAgcmVnaXN0ZXJGb250Q2xhc3NBbGlhcyhhbGlhczogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZyA9IGFsaWFzKTogdGhpcyB7XG4gICAgdGhpcy5fZm9udENzc0NsYXNzZXNCeUFsaWFzLnNldChhbGlhcywgY2xhc3NOYW1lKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3MgbmFtZSBhc3NvY2lhdGVkIHdpdGggdGhlIGFsaWFzIGJ5IGEgcHJldmlvdXMgY2FsbCB0b1xuICAgKiByZWdpc3RlckZvbnRDbGFzc0FsaWFzLiBJZiBubyBDU1MgY2xhc3MgaGFzIGJlZW4gYXNzb2NpYXRlZCwgcmV0dXJucyB0aGUgYWxpYXMgdW5tb2RpZmllZC5cbiAgICovXG4gIGNsYXNzTmFtZUZvckZvbnRBbGlhcyhhbGlhczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZm9udENzc0NsYXNzZXNCeUFsaWFzLmdldChhbGlhcykgfHwgYWxpYXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgQ1NTIGNsYXNzIG5hbWUgdG8gYmUgdXNlZCBmb3IgaWNvbiBmb250cyB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgZG9lcyBub3RcbiAgICogaGF2ZSBhIGZvbnRTZXQgaW5wdXQgdmFsdWUsIGFuZCBpcyBub3QgbG9hZGluZyBhbiBpY29uIGJ5IG5hbWUgb3IgVVJMLlxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAqL1xuICBzZXREZWZhdWx0Rm9udFNldENsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy5fZGVmYXVsdEZvbnRTZXRDbGFzcyA9IGNsYXNzTmFtZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3MgbmFtZSB0byBiZSB1c2VkIGZvciBpY29uIGZvbnRzIHdoZW4gYW4gYDxtYXQtaWNvbj5gIGNvbXBvbmVudCBkb2VzIG5vdFxuICAgKiBoYXZlIGEgZm9udFNldCBpbnB1dCB2YWx1ZSwgYW5kIGlzIG5vdCBsb2FkaW5nIGFuIGljb24gYnkgbmFtZSBvciBVUkwuXG4gICAqL1xuICBnZXREZWZhdWx0Rm9udFNldENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRGb250U2V0Q2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgcHJvZHVjZXMgdGhlIGljb24gKGFzIGFuIGA8c3ZnPmAgRE9NIGVsZW1lbnQpIGZyb20gdGhlIGdpdmVuIFVSTC5cbiAgICogVGhlIHJlc3BvbnNlIGZyb20gdGhlIFVSTCBtYXkgYmUgY2FjaGVkIHNvIHRoaXMgd2lsbCBub3QgYWx3YXlzIGNhdXNlIGFuIEhUVFAgcmVxdWVzdCwgYnV0XG4gICAqIHRoZSBwcm9kdWNlZCBlbGVtZW50IHdpbGwgYWx3YXlzIGJlIGEgbmV3IGNvcHkgb2YgdGhlIG9yaWdpbmFsbHkgZmV0Y2hlZCBpY29uLiAoVGhhdCBpcyxcbiAgICogaXQgd2lsbCBub3QgY29udGFpbiBhbnkgbW9kaWZpY2F0aW9ucyBtYWRlIHRvIGVsZW1lbnRzIHByZXZpb3VzbHkgcmV0dXJuZWQpLlxuICAgKlxuICAgKiBAcGFyYW0gc2FmZVVybCBVUkwgZnJvbSB3aGljaCB0byBmZXRjaCB0aGUgU1ZHIGljb24uXG4gICAqL1xuICBnZXRTdmdJY29uRnJvbVVybChzYWZlVXJsOiBTYWZlUmVzb3VyY2VVcmwpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlJFU09VUkNFX1VSTCwgc2FmZVVybCk7XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVVcmxFcnJvcihzYWZlVXJsKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWNoZWRJY29uID0gdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5nZXQodXJsKTtcblxuICAgIGlmIChjYWNoZWRJY29uKSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGNsb25lU3ZnKGNhY2hlZEljb24pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25Gcm9tQ29uZmlnKG5ldyBTdmdJY29uQ29uZmlnKHNhZmVVcmwpKS5waXBlKFxuICAgICAgdGFwKHN2ZyA9PiB0aGlzLl9jYWNoZWRJY29uc0J5VXJsLnNldCh1cmwhLCBzdmcpKSxcbiAgICAgIG1hcChzdmcgPT4gY2xvbmVTdmcoc3ZnKSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBwcm9kdWNlcyB0aGUgaWNvbiAoYXMgYW4gYDxzdmc+YCBET00gZWxlbWVudCkgd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKiBhbmQgbmFtZXNwYWNlLiBUaGUgaWNvbiBtdXN0IGhhdmUgYmVlbiBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCBhZGRJY29uIG9yIGFkZEljb25TZXQ7XG4gICAqIGlmIG5vdCwgdGhlIE9ic2VydmFibGUgd2lsbCB0aHJvdyBhbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgaWNvbiB0byBiZSByZXRyaWV2ZWQuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRvIGxvb2sgZm9yIHRoZSBpY29uLlxuICAgKi9cbiAgZ2V0TmFtZWRTdmdJY29uKG5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcgPSAnJyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIC8vIFJldHVybiAoY29weSBvZikgY2FjaGVkIGljb24gaWYgcG9zc2libGUuXG4gICAgY29uc3Qga2V5ID0gaWNvbktleShuYW1lc3BhY2UsIG5hbWUpO1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX3N2Z0ljb25Db25maWdzLmdldChrZXkpO1xuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21Db25maWcoY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBTZWUgaWYgd2UgaGF2ZSBhbnkgaWNvbiBzZXRzIHJlZ2lzdGVyZWQgZm9yIHRoZSBuYW1lc3BhY2UuXG4gICAgY29uc3QgaWNvblNldENvbmZpZ3MgPSB0aGlzLl9pY29uU2V0Q29uZmlncy5nZXQobmFtZXNwYWNlKTtcblxuICAgIGlmIChpY29uU2V0Q29uZmlncykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldFN2Z0Zyb21JY29uU2V0Q29uZmlncyhuYW1lLCBpY29uU2V0Q29uZmlncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUaHJvdyhnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3Ioa2V5KSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgIHRoaXMuX3N2Z0ljb25Db25maWdzLmNsZWFyKCk7XG4gICB0aGlzLl9pY29uU2V0Q29uZmlncy5jbGVhcigpO1xuICAgdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNhY2hlZCBpY29uIGZvciBhIFN2Z0ljb25Db25maWcgaWYgYXZhaWxhYmxlLCBvciBmZXRjaGVzIGl0IGZyb20gaXRzIFVSTCBpZiBub3QuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTdmdGcm9tQ29uZmlnKGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIGlmIChjb25maWcuc3ZnRWxlbWVudCkge1xuICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIHRoZSBTVkcgZWxlbWVudCBmb3IgdGhpcyBpY29uLCByZXR1cm4gYSBjb3B5LlxuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjbG9uZVN2Zyhjb25maWcuc3ZnRWxlbWVudCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGZXRjaCB0aGUgaWNvbiBmcm9tIHRoZSBjb25maWcncyBVUkwsIGNhY2hlIGl0LCBhbmQgcmV0dXJuIGEgY29weS5cbiAgICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvbkZyb21Db25maWcoY29uZmlnKS5waXBlKFxuICAgICAgICB0YXAoc3ZnID0+IGNvbmZpZy5zdmdFbGVtZW50ID0gc3ZnKSxcbiAgICAgICAgbWFwKHN2ZyA9PiBjbG9uZVN2ZyhzdmcpKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIGZpbmQgYW4gaWNvbiB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBpbiBhbnkgb2YgdGhlIFNWRyBpY29uIHNldHMuXG4gICAqIEZpcnN0IHNlYXJjaGVzIHRoZSBhdmFpbGFibGUgY2FjaGVkIGljb25zIGZvciBhIG5lc3RlZCBlbGVtZW50IHdpdGggYSBtYXRjaGluZyBuYW1lLCBhbmRcbiAgICogaWYgZm91bmQgY29waWVzIHRoZSBlbGVtZW50IHRvIGEgbmV3IGA8c3ZnPmAgZWxlbWVudC4gSWYgbm90IGZvdW5kLCBmZXRjaGVzIGFsbCBpY29uIHNldHNcbiAgICogdGhhdCBoYXZlIG5vdCBiZWVuIGNhY2hlZCwgYW5kIHNlYXJjaGVzIGFnYWluIGFmdGVyIGFsbCBmZXRjaGVzIGFyZSBjb21wbGV0ZWQuXG4gICAqIFRoZSByZXR1cm5lZCBPYnNlcnZhYmxlIHByb2R1Y2VzIHRoZSBTVkcgZWxlbWVudCBpZiBwb3NzaWJsZSwgYW5kIHRocm93c1xuICAgKiBhbiBlcnJvciBpZiBubyBpY29uIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGNhbiBiZSBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2dldFN2Z0Zyb21JY29uU2V0Q29uZmlncyhuYW1lOiBzdHJpbmcsIGljb25TZXRDb25maWdzOiBTdmdJY29uQ29uZmlnW10pOlxuICAgICAgT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgLy8gRm9yIGFsbCB0aGUgaWNvbiBzZXQgU1ZHIGVsZW1lbnRzIHdlJ3ZlIGZldGNoZWQsIHNlZSBpZiBhbnkgY29udGFpbiBhbiBpY29uIHdpdGggdGhlXG4gICAgLy8gcmVxdWVzdGVkIG5hbWUuXG4gICAgY29uc3QgbmFtZWRJY29uID0gdGhpcy5fZXh0cmFjdEljb25XaXRoTmFtZUZyb21BbnlTZXQobmFtZSwgaWNvblNldENvbmZpZ3MpO1xuXG4gICAgaWYgKG5hbWVkSWNvbikge1xuICAgICAgLy8gV2UgY291bGQgY2FjaGUgbmFtZWRJY29uIGluIF9zdmdJY29uQ29uZmlncywgYnV0IHNpbmNlIHdlIGhhdmUgdG8gbWFrZSBhIGNvcHkgZXZlcnlcbiAgICAgIC8vIHRpbWUgYW55d2F5LCB0aGVyZSdzIHByb2JhYmx5IG5vdCBtdWNoIGFkdmFudGFnZSBjb21wYXJlZCB0byBqdXN0IGFsd2F5cyBleHRyYWN0aW5nXG4gICAgICAvLyBpdCBmcm9tIHRoZSBpY29uIHNldC5cbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobmFtZWRJY29uKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgZm91bmQgaW4gYW55IGNhY2hlZCBpY29uIHNldHMuIElmIHRoZXJlIGFyZSBpY29uIHNldHMgd2l0aCBVUkxzIHRoYXQgd2UgaGF2ZW4ndFxuICAgIC8vIGZldGNoZWQsIGZldGNoIHRoZW0gbm93IGFuZCBsb29rIGZvciBpY29uTmFtZSBpbiB0aGUgcmVzdWx0cy5cbiAgICBjb25zdCBpY29uU2V0RmV0Y2hSZXF1ZXN0czogT2JzZXJ2YWJsZTxTVkdFbGVtZW50IHwgbnVsbD5bXSA9IGljb25TZXRDb25maWdzXG4gICAgICAuZmlsdGVyKGljb25TZXRDb25maWcgPT4gIWljb25TZXRDb25maWcuc3ZnRWxlbWVudClcbiAgICAgIC5tYXAoaWNvblNldENvbmZpZyA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkU3ZnSWNvblNldEZyb21Db25maWcoaWNvblNldENvbmZpZykucGlwZShcbiAgICAgICAgICBjYXRjaEVycm9yKChlcnI6IEh0dHBFcnJvclJlc3BvbnNlKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50IHwgbnVsbD4gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIGljb25TZXRDb25maWcudXJsKTtcblxuICAgICAgICAgICAgLy8gU3dhbGxvdyBlcnJvcnMgZmV0Y2hpbmcgaW5kaXZpZHVhbCBVUkxzIHNvIHRoZVxuICAgICAgICAgICAgLy8gY29tYmluZWQgT2JzZXJ2YWJsZSB3b24ndCBuZWNlc3NhcmlseSBmYWlsLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYExvYWRpbmcgaWNvbiBzZXQgVVJMOiAke3VybH0gZmFpbGVkOiAke2Vyci5tZXNzYWdlfWA7XG4gICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIF9lcnJvckhhbmRsZXIgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWRcbiAgICAgICAgICAgIGlmICh0aGlzLl9lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gRmV0Y2ggYWxsIHRoZSBpY29uIHNldCBVUkxzLiBXaGVuIHRoZSByZXF1ZXN0cyBjb21wbGV0ZSwgZXZlcnkgSWNvblNldCBzaG91bGQgaGF2ZSBhXG4gICAgLy8gY2FjaGVkIFNWRyBlbGVtZW50ICh1bmxlc3MgdGhlIHJlcXVlc3QgZmFpbGVkKSwgYW5kIHdlIGNhbiBjaGVjayBhZ2FpbiBmb3IgdGhlIGljb24uXG4gICAgcmV0dXJuIGZvcmtKb2luKGljb25TZXRGZXRjaFJlcXVlc3RzKS5waXBlKG1hcCgoKSA9PiB7XG4gICAgICBjb25zdCBmb3VuZEljb24gPSB0aGlzLl9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChuYW1lLCBpY29uU2V0Q29uZmlncyk7XG5cbiAgICAgIGlmICghZm91bmRJY29uKSB7XG4gICAgICAgIHRocm93IGdldE1hdEljb25OYW1lTm90Rm91bmRFcnJvcihuYW1lKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kSWNvbjtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgdGhlIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIHRoZSBnaXZlbiBpY29uIHNldHMgZm9yIGEgbmVzdGVkIGljb24gZWxlbWVudCB3aG9zZSBcImlkXCJcbiAgICogdGFnIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBuYW1lLiBJZiBmb3VuZCwgY29waWVzIHRoZSBuZXN0ZWQgZWxlbWVudCB0byBhIG5ldyBTVkcgZWxlbWVudCBhbmRcbiAgICogcmV0dXJucyBpdC4gUmV0dXJucyBudWxsIGlmIG5vIG1hdGNoaW5nIGVsZW1lbnQgaXMgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9leHRyYWN0SWNvbldpdGhOYW1lRnJvbUFueVNldChpY29uTmFtZTogc3RyaW5nLCBpY29uU2V0Q29uZmlnczogU3ZnSWNvbkNvbmZpZ1tdKTpcbiAgICAgIFNWR0VsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBJdGVyYXRlIGJhY2t3YXJkcywgc28gaWNvbiBzZXRzIGFkZGVkIGxhdGVyIGhhdmUgcHJlY2VkZW5jZS5cbiAgICBmb3IgKGxldCBpID0gaWNvblNldENvbmZpZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGljb25TZXRDb25maWdzW2ldO1xuICAgICAgaWYgKGNvbmZpZy5zdmdFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGZvdW5kSWNvbiA9IHRoaXMuX2V4dHJhY3RTdmdJY29uRnJvbVNldChjb25maWcuc3ZnRWxlbWVudCwgaWNvbk5hbWUsIGNvbmZpZy5vcHRpb25zKTtcbiAgICAgICAgaWYgKGZvdW5kSWNvbikge1xuICAgICAgICAgIHJldHVybiBmb3VuZEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIGNvbnRlbnQgb2YgdGhlIGljb24gVVJMIHNwZWNpZmllZCBpbiB0aGUgU3ZnSWNvbkNvbmZpZyBhbmQgY3JlYXRlcyBhbiBTVkcgZWxlbWVudFxuICAgKiBmcm9tIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBfbG9hZFN2Z0ljb25Gcm9tQ29uZmlnKGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIHJldHVybiB0aGlzLl9mZXRjaEljb24oY29uZmlnKVxuICAgICAgICAucGlwZShtYXAoc3ZnVGV4dCA9PiB0aGlzLl9jcmVhdGVTdmdFbGVtZW50Rm9yU2luZ2xlSWNvbihzdmdUZXh0LCBjb25maWcub3B0aW9ucykpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgY29udGVudCBvZiB0aGUgaWNvbiBzZXQgVVJMIHNwZWNpZmllZCBpbiB0aGUgU3ZnSWNvbkNvbmZpZyBhbmQgY3JlYXRlcyBhbiBTVkcgZWxlbWVudFxuICAgKiBmcm9tIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBfbG9hZFN2Z0ljb25TZXRGcm9tQ29uZmlnKGNvbmZpZzogU3ZnSWNvbkNvbmZpZyk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIC8vIElmIHRoZSBTVkcgZm9yIHRoaXMgaWNvbiBzZXQgaGFzIGFscmVhZHkgYmVlbiBwYXJzZWQsIGRvIG5vdGhpbmcuXG4gICAgaWYgKGNvbmZpZy5zdmdFbGVtZW50KSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGNvbmZpZy5zdmdFbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmV0Y2hJY29uKGNvbmZpZykucGlwZShtYXAoc3ZnVGV4dCA9PiB7XG4gICAgICAvLyBJdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBpY29uIHNldCB3YXMgcGFyc2VkIGFuZCBjYWNoZWQgYnkgYW4gZWFybGllciByZXF1ZXN0LCBzbyBwYXJzaW5nXG4gICAgICAvLyBvbmx5IG5lZWRzIHRvIG9jY3VyIGlmIHRoZSBjYWNoZSBpcyB5ZXQgdW5zZXQuXG4gICAgICBpZiAoIWNvbmZpZy5zdmdFbGVtZW50KSB7XG4gICAgICAgIGNvbmZpZy5zdmdFbGVtZW50ID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcoc3ZnVGV4dCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb25maWcuc3ZnRWxlbWVudDtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50IGZyb20gdGhlIGdpdmVuIFNWRyBzdHJpbmcsIGFuZCBhZGRzIGRlZmF1bHQgYXR0cmlidXRlcy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZVN2Z0VsZW1lbnRGb3JTaW5nbGVJY29uKHJlc3BvbnNlVGV4dDogc3RyaW5nLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZyhyZXNwb25zZVRleHQpO1xuICAgIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXMoc3ZnLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIHRoZSBjYWNoZWQgZWxlbWVudCBvZiB0aGUgZ2l2ZW4gU3ZnSWNvbkNvbmZpZyBmb3IgYSBuZXN0ZWQgaWNvbiBlbGVtZW50IHdob3NlIFwiaWRcIlxuICAgKiB0YWcgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIG5hbWUuIElmIGZvdW5kLCBjb3BpZXMgdGhlIG5lc3RlZCBlbGVtZW50IHRvIGEgbmV3IFNWRyBlbGVtZW50IGFuZFxuICAgKiByZXR1cm5zIGl0LiBSZXR1cm5zIG51bGwgaWYgbm8gbWF0Y2hpbmcgZWxlbWVudCBpcyBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgX2V4dHJhY3RTdmdJY29uRnJvbVNldChpY29uU2V0OiBTVkdFbGVtZW50LCBpY29uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogU1ZHRWxlbWVudCB8IG51bGwge1xuICAgIC8vIFVzZSB0aGUgYGlkPVwiaWNvbk5hbWVcImAgc3ludGF4IGluIG9yZGVyIHRvIGVzY2FwZSBzcGVjaWFsXG4gICAgLy8gY2hhcmFjdGVycyBpbiB0aGUgSUQgKHZlcnN1cyB1c2luZyB0aGUgI2ljb25OYW1lIHN5bnRheCkuXG4gICAgY29uc3QgaWNvblNvdXJjZSA9IGljb25TZXQucXVlcnlTZWxlY3RvcihgW2lkPVwiJHtpY29uTmFtZX1cIl1gKTtcblxuICAgIGlmICghaWNvblNvdXJjZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2xvbmUgdGhlIGVsZW1lbnQgYW5kIHJlbW92ZSB0aGUgSUQgdG8gcHJldmVudCBtdWx0aXBsZSBlbGVtZW50cyBmcm9tIGJlaW5nIGFkZGVkXG4gICAgLy8gdG8gdGhlIHBhZ2Ugd2l0aCB0aGUgc2FtZSBJRC5cbiAgICBjb25zdCBpY29uRWxlbWVudCA9IGljb25Tb3VyY2UuY2xvbmVOb2RlKHRydWUpIGFzIEVsZW1lbnQ7XG4gICAgaWNvbkVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuXG4gICAgLy8gSWYgdGhlIGljb24gbm9kZSBpcyBpdHNlbGYgYW4gPHN2Zz4gbm9kZSwgY2xvbmUgYW5kIHJldHVybiBpdCBkaXJlY3RseS4gSWYgbm90LCBzZXQgaXQgYXNcbiAgICAvLyB0aGUgY29udGVudCBvZiBhIG5ldyA8c3ZnPiBub2RlLlxuICAgIGlmIChpY29uRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXMoaWNvbkVsZW1lbnQgYXMgU1ZHRWxlbWVudCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG5vZGUgaXMgYSA8c3ltYm9sPiwgaXQgd29uJ3QgYmUgcmVuZGVyZWQgc28gd2UgaGF2ZSB0byBjb252ZXJ0IGl0IGludG8gPHN2Zz4uIE5vdGVcbiAgICAvLyB0aGF0IHRoZSBzYW1lIGNvdWxkIGJlIGFjaGlldmVkIGJ5IHJlZmVycmluZyB0byBpdCB2aWEgPHVzZSBocmVmPVwiI2lkXCI+LCBob3dldmVyIHRoZSA8dXNlPlxuICAgIC8vIHRhZyBpcyBwcm9ibGVtYXRpYyBvbiBGaXJlZm94LCBiZWNhdXNlIGl0IG5lZWRzIHRvIGluY2x1ZGUgdGhlIGN1cnJlbnQgcGFnZSBwYXRoLlxuICAgIGlmIChpY29uRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFN2Z0F0dHJpYnV0ZXModGhpcy5fdG9TdmdFbGVtZW50KGljb25FbGVtZW50KSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlRWxlbWVudCgnU1ZHJykgZG9lc24ndCB3b3JrIGFzIGV4cGVjdGVkOyB0aGUgRE9NIGVuZHMgdXAgd2l0aFxuICAgIC8vIHRoZSBjb3JyZWN0IG5vZGVzLCBidXQgdGhlIFNWRyBjb250ZW50IGRvZXNuJ3QgcmVuZGVyLiBJbnN0ZWFkIHdlXG4gICAgLy8gaGF2ZSB0byBjcmVhdGUgYW4gZW1wdHkgU1ZHIG5vZGUgdXNpbmcgaW5uZXJIVE1MIGFuZCBhcHBlbmQgaXRzIGNvbnRlbnQuXG4gICAgLy8gRWxlbWVudHMgY3JlYXRlZCB1c2luZyBET01QYXJzZXIucGFyc2VGcm9tU3RyaW5nIGhhdmUgdGhlIHNhbWUgcHJvYmxlbS5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIzMDAzMjc4L3N2Zy1pbm5lcmh0bWwtaW4tZmlyZWZveC1jYW4tbm90LWRpc3BsYXlcbiAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZygnPHN2Zz48L3N2Zz4nKTtcbiAgICAvLyBDbG9uZSB0aGUgbm9kZSBzbyB3ZSBkb24ndCByZW1vdmUgaXQgZnJvbSB0aGUgcGFyZW50IGljb24gc2V0IGVsZW1lbnQuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGljb25FbGVtZW50KTtcblxuICAgIHJldHVybiB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKHN2Zywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50IGZyb20gdGhlIGdpdmVuIFNWRyBzdHJpbmcuXG4gICAqL1xuICBwcml2YXRlIF9zdmdFbGVtZW50RnJvbVN0cmluZyhzdHI6IHN0cmluZyk6IFNWR0VsZW1lbnQge1xuICAgIGNvbnN0IGRpdiA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHI7XG4gICAgY29uc3Qgc3ZnID0gZGl2LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpIGFzIFNWR0VsZW1lbnQ7XG5cbiAgICBpZiAoIXN2Zykge1xuICAgICAgdGhyb3cgRXJyb3IoJzxzdmc+IHRhZyBub3QgZm91bmQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFuIGVsZW1lbnQgaW50byBhbiBTVkcgbm9kZSBieSBjbG9uaW5nIGFsbCBvZiBpdHMgY2hpbGRyZW4uXG4gICAqL1xuICBwcml2YXRlIF90b1N2Z0VsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IFNWR0VsZW1lbnQge1xuICAgIGNvbnN0IHN2ZyA9IHRoaXMuX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKCc8c3ZnPjwvc3ZnPicpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBDb3B5IG92ZXIgYWxsIHRoZSBhdHRyaWJ1dGVzIGZyb20gdGhlIGBzeW1ib2xgIHRvIHRoZSBuZXcgU1ZHLCBleGNlcHQgdGhlIGlkLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge25hbWUsIHZhbHVlfSA9IGF0dHJpYnV0ZXNbaV07XG5cbiAgICAgIGlmIChuYW1lICE9PSAnaWQnKSB7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZE5vZGVzW2ldLm5vZGVUeXBlID09PSB0aGlzLl9kb2N1bWVudC5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKGVsZW1lbnQuY2hpbGROb2Rlc1tpXS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCBhdHRyaWJ1dGVzIGZvciBhbiBTVkcgZWxlbWVudCB0byBiZSB1c2VkIGFzIGFuIGljb24uXG4gICAqL1xuICBwcml2YXRlIF9zZXRTdmdBdHRyaWJ1dGVzKHN2ZzogU1ZHRWxlbWVudCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogU1ZHRWxlbWVudCB7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnZml0JywgJycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMTAwJScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzYWJsZScsICdmYWxzZScpOyAvLyBEaXNhYmxlIElFMTEgZGVmYXVsdCBiZWhhdmlvciB0byBtYWtlIFNWR3MgZm9jdXNhYmxlLlxuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy52aWV3Qm94KSB7XG4gICAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94Jywgb3B0aW9ucy52aWV3Qm94KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB3aGljaCBwcm9kdWNlcyB0aGUgc3RyaW5nIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBpY29uLiBSZXN1bHRzIG1heSBiZVxuICAgKiBjYWNoZWQsIHNvIGZ1dHVyZSBjYWxscyB3aXRoIHRoZSBzYW1lIFVSTCBtYXkgbm90IGNhdXNlIGFub3RoZXIgSFRUUCByZXF1ZXN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfZmV0Y2hJY29uKGljb25Db25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIGNvbnN0IHt1cmw6IHNhZmVVcmwsIG9wdGlvbnN9ID0gaWNvbkNvbmZpZztcbiAgICBjb25zdCB3aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zPy53aXRoQ3JlZGVudGlhbHMgPz8gZmFsc2U7XG5cbiAgICBpZiAoIXRoaXMuX2h0dHBDbGllbnQpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25Ob0h0dHBQcm92aWRlckVycm9yKCk7XG4gICAgfVxuXG4gICAgaWYgKHNhZmVVcmwgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbm5vdCBmZXRjaCBpY29uIGZyb20gVVJMIFwiJHtzYWZlVXJsfVwiLmApO1xuICAgIH1cblxuICAgIGNvbnN0IHVybCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCBzYWZlVXJsKTtcblxuICAgIGlmICghdXJsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHNhZmVVcmwpO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIGluLXByb2dyZXNzIGZldGNoZXMgdG8gYXZvaWQgc2VuZGluZyBhIGR1cGxpY2F0ZSByZXF1ZXN0IGZvciBhIFVSTCB3aGVuIHRoZXJlIGlzXG4gICAgLy8gYWxyZWFkeSBhIHJlcXVlc3QgaW4gcHJvZ3Jlc3MgZm9yIHRoYXQgVVJMLiBJdCdzIG5lY2Vzc2FyeSB0byBjYWxsIHNoYXJlKCkgb24gdGhlXG4gICAgLy8gT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBodHRwLmdldCgpIHNvIHRoYXQgbXVsdGlwbGUgc3Vic2NyaWJlcnMgZG9uJ3QgY2F1c2UgbXVsdGlwbGUgWEhScy5cbiAgICBjb25zdCBpblByb2dyZXNzRmV0Y2ggPSB0aGlzLl9pblByb2dyZXNzVXJsRmV0Y2hlcy5nZXQodXJsKTtcblxuICAgIGlmIChpblByb2dyZXNzRmV0Y2gpIHtcbiAgICAgIHJldHVybiBpblByb2dyZXNzRmV0Y2g7XG4gICAgfVxuXG4gICAgLy8gVE9ETyhqZWxib3Vybik6IGZvciBzb21lIHJlYXNvbiwgdGhlIGBmaW5hbGl6ZWAgb3BlcmF0b3IgXCJsb3Nlc1wiIHRoZSBnZW5lcmljIHR5cGUgb24gdGhlXG4gICAgLy8gT2JzZXJ2YWJsZS4gRmlndXJlIG91dCB3aHkgYW5kIGZpeCBpdC5cbiAgICBjb25zdCByZXEgPSB0aGlzLl9odHRwQ2xpZW50LmdldCh1cmwsIHtyZXNwb25zZVR5cGU6ICd0ZXh0Jywgd2l0aENyZWRlbnRpYWxzfSkucGlwZShcbiAgICAgIGZpbmFsaXplKCgpID0+IHRoaXMuX2luUHJvZ3Jlc3NVcmxGZXRjaGVzLmRlbGV0ZSh1cmwpKSxcbiAgICAgIHNoYXJlKCksXG4gICAgKTtcblxuICAgIHRoaXMuX2luUHJvZ3Jlc3NVcmxGZXRjaGVzLnNldCh1cmwsIHJlcSk7XG4gICAgcmV0dXJuIHJlcTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBjb25maWcgYnkgbmFtZSBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gY29uZmlnLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0byByZWdpc3RlciB0aGUgY29uZmlnLlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfYWRkU3ZnSWNvbkNvbmZpZyhuYW1lc3BhY2U6IHN0cmluZywgaWNvbk5hbWU6IHN0cmluZywgY29uZmlnOiBTdmdJY29uQ29uZmlnKTogdGhpcyB7XG4gICAgdGhpcy5fc3ZnSWNvbkNvbmZpZ3Muc2V0KGljb25LZXkobmFtZXNwYWNlLCBpY29uTmFtZSksIGNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGNvbmZpZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gY29uZmlnLlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2U6IHN0cmluZywgY29uZmlnOiBTdmdJY29uQ29uZmlnKTogdGhpcyB7XG4gICAgY29uc3QgY29uZmlnTmFtZXNwYWNlID0gdGhpcy5faWNvblNldENvbmZpZ3MuZ2V0KG5hbWVzcGFjZSk7XG5cbiAgICBpZiAoY29uZmlnTmFtZXNwYWNlKSB7XG4gICAgICBjb25maWdOYW1lc3BhY2UucHVzaChjb25maWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pY29uU2V0Q29uZmlncy5zZXQobmFtZXNwYWNlLCBbY29uZmlnXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBJQ09OX1JFR0lTVFJZX1BST1ZJREVSX0ZBQ1RPUlkoXG4gIHBhcmVudFJlZ2lzdHJ5OiBNYXRJY29uUmVnaXN0cnksXG4gIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQsXG4gIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICBkb2N1bWVudD86IGFueSxcbiAgZXJyb3JIYW5kbGVyPzogRXJyb3JIYW5kbGVyKSB7XG4gIHJldHVybiBwYXJlbnRSZWdpc3RyeSB8fCBuZXcgTWF0SWNvblJlZ2lzdHJ5KGh0dHBDbGllbnQsIHNhbml0aXplciwgZG9jdW1lbnQsIGVycm9ySGFuZGxlcik7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgSUNPTl9SRUdJU1RSWV9QUk9WSURFUiA9IHtcbiAgLy8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhbiBNYXRJY29uUmVnaXN0cnkgYXZhaWxhYmxlLCB1c2UgdGhhdC4gT3RoZXJ3aXNlLCBwcm92aWRlIGEgbmV3IG9uZS5cbiAgcHJvdmlkZTogTWF0SWNvblJlZ2lzdHJ5LFxuICBkZXBzOiBbXG4gICAgW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTWF0SWNvblJlZ2lzdHJ5XSxcbiAgICBbbmV3IE9wdGlvbmFsKCksIEh0dHBDbGllbnRdLFxuICAgIERvbVNhbml0aXplcixcbiAgICBbbmV3IE9wdGlvbmFsKCksIEVycm9ySGFuZGxlcl0sXG4gICAgW25ldyBPcHRpb25hbCgpLCBET0NVTUVOVCBhcyBJbmplY3Rpb25Ub2tlbjxhbnk+XSxcbiAgXSxcbiAgdXNlRmFjdG9yeTogSUNPTl9SRUdJU1RSWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqIENsb25lcyBhbiBTVkdFbGVtZW50IHdoaWxlIHByZXNlcnZpbmcgdHlwZSBpbmZvcm1hdGlvbi4gKi9cbmZ1bmN0aW9uIGNsb25lU3ZnKHN2ZzogU1ZHRWxlbWVudCk6IFNWR0VsZW1lbnQge1xuICByZXR1cm4gc3ZnLmNsb25lTm9kZSh0cnVlKSBhcyBTVkdFbGVtZW50O1xufVxuXG4vKiogUmV0dXJucyB0aGUgY2FjaGUga2V5IHRvIHVzZSBmb3IgYW4gaWNvbiBuYW1lc3BhY2UgYW5kIG5hbWUuICovXG5mdW5jdGlvbiBpY29uS2V5KG5hbWVzcGFjZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5hbWVzcGFjZSArICc6JyArIG5hbWU7XG59XG4iXX0=