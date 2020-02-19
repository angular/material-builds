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
    return Error("Unable to find icon with the name \"" + iconName + "\"");
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
    return Error("The URL provided to MatIconRegistry was not trusted as a resource URL " +
        ("via Angular's DomSanitizer. Attempted URL was \"" + url + "\"."));
}
/**
 * Returns an exception to be thrown when a HTML string couldn't be sanitized.
 * @param literal HTML that was attempted to be sanitized.
 * @docs-private
 */
export function getMatIconFailedToSanitizeLiteralError(literal) {
    return Error("The literal provided to MatIconRegistry was not trusted as safe HTML by " +
        ("Angular's DomSanitizer. Attempted literal was \"" + literal + "\"."));
}
/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 * @docs-private
 */
var SvgIconConfig = /** @class */ (function () {
    function SvgIconConfig(data, options) {
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
    return SvgIconConfig;
}());
/**
 * Service to register and display icons used by the `<mat-icon>` component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
var MatIconRegistry = /** @class */ (function () {
    function MatIconRegistry(_httpClient, _sanitizer, document, 
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
    MatIconRegistry.prototype.addSvgIcon = function (iconName, url, options) {
        return this.addSvgIconInNamespace('', iconName, url, options);
    };
    /**
     * Registers an icon using an HTML string in the default namespace.
     * @param iconName Name under which the icon should be registered.
     * @param literal SVG source of the icon.
     */
    MatIconRegistry.prototype.addSvgIconLiteral = function (iconName, literal, options) {
        return this.addSvgIconLiteralInNamespace('', iconName, literal, options);
    };
    /**
     * Registers an icon by URL in the specified namespace.
     * @param namespace Namespace in which the icon should be registered.
     * @param iconName Name under which the icon should be registered.
     * @param url
     */
    MatIconRegistry.prototype.addSvgIconInNamespace = function (namespace, iconName, url, options) {
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(url, options));
    };
    /**
     * Registers an icon using an HTML string in the specified namespace.
     * @param namespace Namespace in which the icon should be registered.
     * @param iconName Name under which the icon should be registered.
     * @param literal SVG source of the icon.
     */
    MatIconRegistry.prototype.addSvgIconLiteralInNamespace = function (namespace, iconName, literal, options) {
        var sanitizedLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        if (!sanitizedLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        var svgElement = this._createSvgElementForSingleIcon(sanitizedLiteral, options);
        return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(svgElement, options));
    };
    /**
     * Registers an icon set by URL in the default namespace.
     * @param url
     */
    MatIconRegistry.prototype.addSvgIconSet = function (url, options) {
        return this.addSvgIconSetInNamespace('', url, options);
    };
    /**
     * Registers an icon set using an HTML string in the default namespace.
     * @param literal SVG source of the icon set.
     */
    MatIconRegistry.prototype.addSvgIconSetLiteral = function (literal, options) {
        return this.addSvgIconSetLiteralInNamespace('', literal, options);
    };
    /**
     * Registers an icon set by URL in the specified namespace.
     * @param namespace Namespace in which to register the icon set.
     * @param url
     */
    MatIconRegistry.prototype.addSvgIconSetInNamespace = function (namespace, url, options) {
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig(url, options));
    };
    /**
     * Registers an icon set using an HTML string in the specified namespace.
     * @param namespace Namespace in which to register the icon set.
     * @param literal SVG source of the icon set.
     */
    MatIconRegistry.prototype.addSvgIconSetLiteralInNamespace = function (namespace, literal, options) {
        var sanitizedLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
        if (!sanitizedLiteral) {
            throw getMatIconFailedToSanitizeLiteralError(literal);
        }
        var svgElement = this._svgElementFromString(sanitizedLiteral);
        return this._addSvgIconSetConfig(namespace, new SvgIconConfig(svgElement, options));
    };
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an matIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the `<mat-icon>` element.
     *
     * @param alias Alias for the font.
     * @param className Class name override to be used instead of the alias.
     */
    MatIconRegistry.prototype.registerFontClassAlias = function (alias, className) {
        if (className === void 0) { className = alias; }
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    };
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     */
    MatIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    };
    /**
     * Sets the CSS class name to be used for icon fonts when an `<mat-icon>` component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     *
     * @param className
     */
    MatIconRegistry.prototype.setDefaultFontSetClass = function (className) {
        this._defaultFontSetClass = className;
        return this;
    };
    /**
     * Returns the CSS class name to be used for icon fonts when an `<mat-icon>` component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    MatIconRegistry.prototype.getDefaultFontSetClass = function () {
        return this._defaultFontSetClass;
    };
    /**
     * Returns an Observable that produces the icon (as an `<svg>` DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     *
     * @param safeUrl URL from which to fetch the SVG icon.
     */
    MatIconRegistry.prototype.getSvgIconFromUrl = function (safeUrl) {
        var _this = this;
        var url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMatIconFailedToSanitizeUrlError(safeUrl);
        }
        var cachedIcon = this._cachedIconsByUrl.get(url);
        if (cachedIcon) {
            return observableOf(cloneSvg(cachedIcon));
        }
        return this._loadSvgIconFromConfig(new SvgIconConfig(safeUrl)).pipe(tap(function (svg) { return _this._cachedIconsByUrl.set(url, svg); }), map(function (svg) { return cloneSvg(svg); }));
    };
    /**
     * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an error.
     *
     * @param name Name of the icon to be retrieved.
     * @param namespace Namespace in which to look for the icon.
     */
    MatIconRegistry.prototype.getNamedSvgIcon = function (name, namespace) {
        if (namespace === void 0) { namespace = ''; }
        // Return (copy of) cached icon if possible.
        var key = iconKey(namespace, name);
        var config = this._svgIconConfigs.get(key);
        if (config) {
            return this._getSvgFromConfig(config);
        }
        // See if we have any icon sets registered for the namespace.
        var iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return observableThrow(getMatIconNameNotFoundError(key));
    };
    MatIconRegistry.prototype.ngOnDestroy = function () {
        this._svgIconConfigs.clear();
        this._iconSetConfigs.clear();
        this._cachedIconsByUrl.clear();
    };
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     */
    MatIconRegistry.prototype._getSvgFromConfig = function (config) {
        if (config.svgElement) {
            // We already have the SVG element for this icon, return a copy.
            return observableOf(cloneSvg(config.svgElement));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return this._loadSvgIconFromConfig(config).pipe(tap(function (svg) { return config.svgElement = svg; }), map(function (svg) { return cloneSvg(svg); }));
        }
    };
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new `<svg>` element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * an error if no icon with the specified name can be found.
     */
    MatIconRegistry.prototype._getSvgFromIconSetConfigs = function (name, iconSetConfigs) {
        var _this = this;
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        var namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return observableOf(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        var iconSetFetchRequests = iconSetConfigs
            .filter(function (iconSetConfig) { return !iconSetConfig.svgElement; })
            .map(function (iconSetConfig) {
            return _this._loadSvgIconSetFromConfig(iconSetConfig).pipe(catchError(function (err) {
                var url = _this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, iconSetConfig.url);
                // Swallow errors fetching individual URLs so the
                // combined Observable won't necessarily fail.
                var errorMessage = "Loading icon set URL: " + url + " failed: " + err.message;
                // @breaking-change 9.0.0 _errorHandler parameter to be made required
                if (_this._errorHandler) {
                    _this._errorHandler.handleError(new Error(errorMessage));
                }
                else {
                    console.error(errorMessage);
                }
                return observableOf(null);
            }));
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return forkJoin(iconSetFetchRequests).pipe(map(function () {
            var foundIcon = _this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            if (!foundIcon) {
                throw getMatIconNameNotFoundError(name);
            }
            return foundIcon;
        }));
    };
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MatIconRegistry.prototype._extractIconWithNameFromAnySet = function (iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (var i = iconSetConfigs.length - 1; i >= 0; i--) {
            var config = iconSetConfigs[i];
            if (config.svgElement) {
                var foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName, config.options);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    };
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MatIconRegistry.prototype._loadSvgIconFromConfig = function (config) {
        var _this = this;
        return this._fetchUrl(config.url)
            .pipe(map(function (svgText) { return _this._createSvgElementForSingleIcon(svgText, config.options); }));
    };
    /**
     * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MatIconRegistry.prototype._loadSvgIconSetFromConfig = function (config) {
        var _this = this;
        // If the SVG for this icon set has already been parsed, do nothing.
        if (config.svgElement) {
            return observableOf(config.svgElement);
        }
        return this._fetchUrl(config.url).pipe(map(function (svgText) {
            // It is possible that the icon set was parsed and cached by an earlier request, so parsing
            // only needs to occur if the cache is yet unset.
            if (!config.svgElement) {
                config.svgElement = _this._svgElementFromString(svgText);
            }
            return config.svgElement;
        }));
    };
    /**
     * Creates a DOM element from the given SVG string, and adds default attributes.
     */
    MatIconRegistry.prototype._createSvgElementForSingleIcon = function (responseText, options) {
        var svg = this._svgElementFromString(responseText);
        this._setSvgAttributes(svg, options);
        return svg;
    };
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MatIconRegistry.prototype._extractSvgIconFromSet = function (iconSet, iconName, options) {
        // Use the `id="iconName"` syntax in order to escape special
        // characters in the ID (versus using the #iconName syntax).
        var iconSource = iconSet.querySelector("[id=\"" + iconName + "\"]");
        if (!iconSource) {
            return null;
        }
        // Clone the element and remove the ID to prevent multiple elements from being added
        // to the page with the same ID.
        var iconElement = iconSource.cloneNode(true);
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
        var svg = this._svgElementFromString('<svg></svg>');
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconElement);
        return this._setSvgAttributes(svg, options);
    };
    /**
     * Creates a DOM element from the given SVG string.
     */
    MatIconRegistry.prototype._svgElementFromString = function (str) {
        var div = this._document.createElement('DIV');
        div.innerHTML = str;
        var svg = div.querySelector('svg');
        if (!svg) {
            throw Error('<svg> tag not found');
        }
        return svg;
    };
    /**
     * Converts an element into an SVG node by cloning all of its children.
     */
    MatIconRegistry.prototype._toSvgElement = function (element) {
        var svg = this._svgElementFromString('<svg></svg>');
        var attributes = element.attributes;
        // Copy over all the attributes from the `symbol` to the new SVG, except the id.
        for (var i = 0; i < attributes.length; i++) {
            var _a = attributes[i], name_1 = _a.name, value = _a.value;
            if (name_1 !== 'id') {
                svg.setAttribute(name_1, value);
            }
        }
        for (var i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType === this._document.ELEMENT_NODE) {
                svg.appendChild(element.childNodes[i].cloneNode(true));
            }
        }
        return svg;
    };
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     */
    MatIconRegistry.prototype._setSvgAttributes = function (svg, options) {
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        if (options && options.viewBox) {
            svg.setAttribute('viewBox', options.viewBox);
        }
        return svg;
    };
    /**
     * Returns an Observable which produces the string contents of the given URL. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     */
    MatIconRegistry.prototype._fetchUrl = function (safeUrl) {
        var _this = this;
        if (!this._httpClient) {
            throw getMatIconNoHttpProviderError();
        }
        if (safeUrl == null) {
            throw Error("Cannot fetch icon from URL \"" + safeUrl + "\".");
        }
        var url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMatIconFailedToSanitizeUrlError(safeUrl);
        }
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        var inProgressFetch = this._inProgressUrlFetches.get(url);
        if (inProgressFetch) {
            return inProgressFetch;
        }
        // TODO(jelbourn): for some reason, the `finalize` operator "loses" the generic type on the
        // Observable. Figure out why and fix it.
        var req = this._httpClient.get(url, { responseType: 'text' }).pipe(finalize(function () { return _this._inProgressUrlFetches.delete(url); }), share());
        this._inProgressUrlFetches.set(url, req);
        return req;
    };
    /**
     * Registers an icon config by name in the specified namespace.
     * @param namespace Namespace in which to register the icon config.
     * @param iconName Name under which to register the config.
     * @param config Config to be registered.
     */
    MatIconRegistry.prototype._addSvgIconConfig = function (namespace, iconName, config) {
        this._svgIconConfigs.set(iconKey(namespace, iconName), config);
        return this;
    };
    /**
     * Registers an icon set config in the specified namespace.
     * @param namespace Namespace in which to register the icon config.
     * @param config Config to be registered.
     */
    MatIconRegistry.prototype._addSvgIconSetConfig = function (namespace, config) {
        var configNamespace = this._iconSetConfigs.get(namespace);
        if (configNamespace) {
            configNamespace.push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    };
    MatIconRegistry.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    MatIconRegistry.ctorParameters = function () { return [
        { type: HttpClient, decorators: [{ type: Optional }] },
        { type: DomSanitizer },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
        { type: ErrorHandler, decorators: [{ type: Optional }] }
    ]; };
    MatIconRegistry.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatIconRegistry_Factory() { return new MatIconRegistry(i0.ɵɵinject(i1.HttpClient, 8), i0.ɵɵinject(i2.DomSanitizer), i0.ɵɵinject(i3.DOCUMENT, 8), i0.ɵɵinject(i0.ErrorHandler, 8)); }, token: MatIconRegistry, providedIn: "root" });
    return MatIconRegistry;
}());
export { MatIconRegistry };
/** @docs-private */
export function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, httpClient, sanitizer, document, errorHandler) {
    return parentRegistry || new MatIconRegistry(httpClient, sanitizer, document, errorHandler);
}
/** @docs-private */
export var ICON_REGISTRY_PROVIDER = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pY29uL2ljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQW9CLE1BQU0sc0JBQXNCLENBQUM7QUFDbkUsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUVWLFFBQVEsRUFDUixlQUFlLEVBQ2YsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxZQUFZLEVBQTRCLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFFBQVEsRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0YsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFHckU7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSwyQkFBMkIsQ0FBQyxRQUFnQjtJQUMxRCxPQUFPLEtBQUssQ0FBQyx5Q0FBc0MsUUFBUSxPQUFHLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBR0Q7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSw2QkFBNkI7SUFDM0MsT0FBTyxLQUFLLENBQUMsMEVBQTBFO1FBQzFFLHdFQUF3RTtRQUN4RSxjQUFjLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBR0Q7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxHQUFvQjtJQUNyRSxPQUFPLEtBQUssQ0FBQyx3RUFBd0U7U0FDeEUscURBQWtELEdBQUcsUUFBSSxDQUFBLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FB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QUFlO0lBQy9CLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQWUsQ0FBQztBQUMzQyxDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLFNBQVMsT0FBTyxDQUFDLFNBQWlCLEVBQUUsSUFBWTtJQUM5QyxPQUFPLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cEVycm9yUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7XG4gIEVycm9ySGFuZGxlcixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgT3B0aW9uYWwsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgU2tpcFNlbGYsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsLCBTYWZlSHRtbH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQge2ZvcmtKb2luLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93fSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZmluYWxpemUsIG1hcCwgc2hhcmUsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIGluIHRoZSBjYXNlIHdoZW4gYXR0ZW1wdGluZyB0b1xuICogbG9hZCBhbiBpY29uIHdpdGggYSBuYW1lIHRoYXQgY2Fubm90IGJlIGZvdW5kLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbk5hbWVOb3RGb3VuZEVycm9yKGljb25OYW1lOiBzdHJpbmcpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihgVW5hYmxlIHRvIGZpbmQgaWNvbiB3aXRoIHRoZSBuYW1lIFwiJHtpY29uTmFtZX1cImApO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIHdoZW4gdGhlIGNvbnN1bWVyIGF0dGVtcHRzIHRvIHVzZVxuICogYDxtYXQtaWNvbj5gIHdpdGhvdXQgaW5jbHVkaW5nIEBhbmd1bGFyL2NvbW1vbi9odHRwLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0SWNvbk5vSHR0cFByb3ZpZGVyRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIEh0dHBDbGllbnQgcHJvdmlkZXIgZm9yIHVzZSB3aXRoIEFuZ3VsYXIgTWF0ZXJpYWwgaWNvbnMuICcgK1xuICAgICAgICAgICAgICAgJ1BsZWFzZSBpbmNsdWRlIHRoZSBIdHRwQ2xpZW50TW9kdWxlIGZyb20gQGFuZ3VsYXIvY29tbW9uL2h0dHAgaW4geW91ciAnICtcbiAgICAgICAgICAgICAgICdhcHAgaW1wb3J0cy4nKTtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biB3aGVuIGEgVVJMIGNvdWxkbid0IGJlIHNhbml0aXplZC5cbiAqIEBwYXJhbSB1cmwgVVJMIHRoYXQgd2FzIGF0dGVtcHRlZCB0byBiZSBzYW5pdGl6ZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZVVybEVycm9yKHVybDogU2FmZVJlc291cmNlVXJsKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYFRoZSBVUkwgcHJvdmlkZWQgdG8gTWF0SWNvblJlZ2lzdHJ5IHdhcyBub3QgdHJ1c3RlZCBhcyBhIHJlc291cmNlIFVSTCBgICtcbiAgICAgICAgICAgICAgIGB2aWEgQW5ndWxhcidzIERvbVNhbml0aXplci4gQXR0ZW1wdGVkIFVSTCB3YXMgXCIke3VybH1cIi5gKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gd2hlbiBhIEhUTUwgc3RyaW5nIGNvdWxkbid0IGJlIHNhbml0aXplZC5cbiAqIEBwYXJhbSBsaXRlcmFsIEhUTUwgdGhhdCB3YXMgYXR0ZW1wdGVkIHRvIGJlIHNhbml0aXplZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplTGl0ZXJhbEVycm9yKGxpdGVyYWw6IFNhZmVIdG1sKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoYFRoZSBsaXRlcmFsIHByb3ZpZGVkIHRvIE1hdEljb25SZWdpc3RyeSB3YXMgbm90IHRydXN0ZWQgYXMgc2FmZSBIVE1MIGJ5IGAgK1xuICAgICAgICAgICAgICAgYEFuZ3VsYXIncyBEb21TYW5pdGl6ZXIuIEF0dGVtcHRlZCBsaXRlcmFsIHdhcyBcIiR7bGl0ZXJhbH1cIi5gKTtcbn1cblxuLyoqIE9wdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgaG93IGFuIGljb24gb3IgdGhlIGljb25zIGluIGFuIGljb24gc2V0IGFyZSBwcmVzZW50ZWQuICovXG5leHBvcnQgaW50ZXJmYWNlIEljb25PcHRpb25zIHtcbiAgLyoqIFZpZXcgYm94IHRvIHNldCBvbiB0aGUgaWNvbi4gKi9cbiAgdmlld0JveD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBhbiBpY29uLCBpbmNsdWRpbmcgdGhlIFVSTCBhbmQgcG9zc2libHkgdGhlIGNhY2hlZCBTVkcgZWxlbWVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY2xhc3MgU3ZnSWNvbkNvbmZpZyB7XG4gIHVybDogU2FmZVJlc291cmNlVXJsIHwgbnVsbDtcbiAgc3ZnRWxlbWVudDogU1ZHRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IodXJsOiBTYWZlUmVzb3VyY2VVcmwsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk7XG4gIGNvbnN0cnVjdG9yKHN2Z0VsZW1lbnQ6IFNWR0VsZW1lbnQsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk7XG4gIGNvbnN0cnVjdG9yKGRhdGE6IFNhZmVSZXNvdXJjZVVybCB8IFNWR0VsZW1lbnQsIHB1YmxpYyBvcHRpb25zPzogSWNvbk9wdGlvbnMpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgY2FuJ3QgdXNlIGBpbnN0YW5jZW9mIFNWR0VsZW1lbnRgIGhlcmUsXG4gICAgLy8gYmVjYXVzZSBpdCdsbCBicmVhayBkdXJpbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgIGlmICghIShkYXRhIGFzIGFueSkubm9kZU5hbWUpIHtcbiAgICAgIHRoaXMuc3ZnRWxlbWVudCA9IGRhdGEgYXMgU1ZHRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBkYXRhIGFzIFNhZmVSZXNvdXJjZVVybDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXJ2aWNlIHRvIHJlZ2lzdGVyIGFuZCBkaXNwbGF5IGljb25zIHVzZWQgYnkgdGhlIGA8bWF0LWljb24+YCBjb21wb25lbnQuXG4gKiAtIFJlZ2lzdGVycyBpY29uIFVSTHMgYnkgbmFtZXNwYWNlIGFuZCBuYW1lLlxuICogLSBSZWdpc3RlcnMgaWNvbiBzZXQgVVJMcyBieSBuYW1lc3BhY2UuXG4gKiAtIFJlZ2lzdGVycyBhbGlhc2VzIGZvciBDU1MgY2xhc3NlcywgZm9yIHVzZSB3aXRoIGljb24gZm9udHMuXG4gKiAtIExvYWRzIGljb25zIGZyb20gVVJMcyBhbmQgZXh0cmFjdHMgaW5kaXZpZHVhbCBpY29ucyBmcm9tIGljb24gc2V0cy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0SWNvblJlZ2lzdHJ5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBVUkxzIGFuZCBjYWNoZWQgU1ZHIGVsZW1lbnRzIGZvciBpbmRpdmlkdWFsIGljb25zLiBLZXlzIGFyZSBvZiB0aGUgZm9ybWF0IFwiW25hbWVzcGFjZV06W2ljb25dXCIuXG4gICAqL1xuICBwcml2YXRlIF9zdmdJY29uQ29uZmlncyA9IG5ldyBNYXA8c3RyaW5nLCBTdmdJY29uQ29uZmlnPigpO1xuXG4gIC8qKlxuICAgKiBTdmdJY29uQ29uZmlnIG9iamVjdHMgYW5kIGNhY2hlZCBTVkcgZWxlbWVudHMgZm9yIGljb24gc2V0cywga2V5ZWQgYnkgbmFtZXNwYWNlLlxuICAgKiBNdWx0aXBsZSBpY29uIHNldHMgY2FuIGJlIHJlZ2lzdGVyZWQgdW5kZXIgdGhlIHNhbWUgbmFtZXNwYWNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaWNvblNldENvbmZpZ3MgPSBuZXcgTWFwPHN0cmluZywgU3ZnSWNvbkNvbmZpZ1tdPigpO1xuXG4gIC8qKiBDYWNoZSBmb3IgaWNvbnMgbG9hZGVkIGJ5IGRpcmVjdCBVUkxzLiAqL1xuICBwcml2YXRlIF9jYWNoZWRJY29uc0J5VXJsID0gbmV3IE1hcDxzdHJpbmcsIFNWR0VsZW1lbnQ+KCk7XG5cbiAgLyoqIEluLXByb2dyZXNzIGljb24gZmV0Y2hlcy4gVXNlZCB0byBjb2FsZXNjZSBtdWx0aXBsZSByZXF1ZXN0cyB0byB0aGUgc2FtZSBVUkwuICovXG4gIHByaXZhdGUgX2luUHJvZ3Jlc3NVcmxGZXRjaGVzID0gbmV3IE1hcDxzdHJpbmcsIE9ic2VydmFibGU8c3RyaW5nPj4oKTtcblxuICAvKiogTWFwIGZyb20gZm9udCBpZGVudGlmaWVycyB0byB0aGVpciBDU1MgY2xhc3MgbmFtZXMuIFVzZWQgZm9yIGljb24gZm9udHMuICovXG4gIHByaXZhdGUgX2ZvbnRDc3NDbGFzc2VzQnlBbGlhcyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBDU1MgY2xhc3MgdG8gYXBwbHkgd2hlbiBhbiBgPG1hdC1pY29uPmAgY29tcG9uZW50IGhhcyBubyBpY29uIG5hbWUsIHVybCwgb3IgZm9udCBzcGVjaWZpZWQuXG4gICAqIFRoZSBkZWZhdWx0ICdtYXRlcmlhbC1pY29ucycgdmFsdWUgYXNzdW1lcyB0aGF0IHRoZSBtYXRlcmlhbCBpY29uIGZvbnQgaGFzIGJlZW4gbG9hZGVkIGFzXG4gICAqIGRlc2NyaWJlZCBhdCBodHRwOi8vZ29vZ2xlLmdpdGh1Yi5pby9tYXRlcmlhbC1kZXNpZ24taWNvbnMvI2ljb24tZm9udC1mb3ItdGhlLXdlYlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVmYXVsdEZvbnRTZXRDbGFzcyA9ICdtYXRlcmlhbC1pY29ucyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIF9zYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgX2Vycm9ySGFuZGxlciBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgcmVhZG9ubHkgX2Vycm9ySGFuZGxlcj86IEVycm9ySGFuZGxlcikge1xuICAgICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIGJ5IFVSTCBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uKGljb25OYW1lOiBzdHJpbmcsIHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uSW5OYW1lc3BhY2UoJycsIGljb25OYW1lLCB1cmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIGljb25OYW1lIE5hbWUgdW5kZXIgd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBsaXRlcmFsIFNWRyBzb3VyY2Ugb2YgdGhlIGljb24uXG4gICAqL1xuICBhZGRTdmdJY29uTGl0ZXJhbChpY29uTmFtZTogc3RyaW5nLCBsaXRlcmFsOiBTYWZlSHRtbCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvbkxpdGVyYWxJbk5hbWVzcGFjZSgnJywgaWNvbk5hbWUsIGxpdGVyYWwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIGJ5IFVSTCBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdGhlIGljb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uSW5OYW1lc3BhY2UobmFtZXNwYWNlOiBzdHJpbmcsIGljb25OYW1lOiBzdHJpbmcsIHVybDogU2FmZVJlc291cmNlVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFN2Z0ljb25Db25maWcobmFtZXNwYWNlLCBpY29uTmFtZSwgbmV3IFN2Z0ljb25Db25maWcodXJsLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gdXNpbmcgYW4gSFRNTCBzdHJpbmcgaW4gdGhlIHNwZWNpZmllZCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSBuYW1lc3BhY2UgTmFtZXNwYWNlIGluIHdoaWNoIHRoZSBpY29uIHNob3VsZCBiZSByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0gaWNvbk5hbWUgTmFtZSB1bmRlciB3aGljaCB0aGUgaWNvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIGxpdGVyYWwgU1ZHIHNvdXJjZSBvZiB0aGUgaWNvbi5cbiAgICovXG4gIGFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UobmFtZXNwYWNlOiBzdHJpbmcsIGljb25OYW1lOiBzdHJpbmcsIGxpdGVyYWw6IFNhZmVIdG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIGNvbnN0IHNhbml0aXplZExpdGVyYWwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIGxpdGVyYWwpO1xuXG4gICAgaWYgKCFzYW5pdGl6ZWRMaXRlcmFsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZUxpdGVyYWxFcnJvcihsaXRlcmFsKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdmdFbGVtZW50ID0gdGhpcy5fY3JlYXRlU3ZnRWxlbWVudEZvclNpbmdsZUljb24oc2FuaXRpemVkTGl0ZXJhbCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFN2Z0ljb25Db25maWcobmFtZXNwYWNlLCBpY29uTmFtZSwgbmV3IFN2Z0ljb25Db25maWcoc3ZnRWxlbWVudCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCBieSBVUkwgaW4gdGhlIGRlZmF1bHQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uU2V0KHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UoJycsIHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IHVzaW5nIGFuIEhUTUwgc3RyaW5nIGluIHRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIGxpdGVyYWwgU1ZHIHNvdXJjZSBvZiB0aGUgaWNvbiBzZXQuXG4gICAqL1xuICBhZGRTdmdJY29uU2V0TGl0ZXJhbChsaXRlcmFsOiBTYWZlSHRtbCwgb3B0aW9ucz86IEljb25PcHRpb25zKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3ZnSWNvblNldExpdGVyYWxJbk5hbWVzcGFjZSgnJywgbGl0ZXJhbCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGljb24gc2V0IGJ5IFVSTCBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gc2V0LlxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBhZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UobmFtZXNwYWNlOiBzdHJpbmcsIHVybDogU2FmZVJlc291cmNlVXJsLCBvcHRpb25zPzogSWNvbk9wdGlvbnMpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkU3ZnSWNvblNldENvbmZpZyhuYW1lc3BhY2UsIG5ldyBTdmdJY29uQ29uZmlnKHVybCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIHNldCB1c2luZyBhbiBIVE1MIHN0cmluZyBpbiB0aGUgc3BlY2lmaWVkIG5hbWVzcGFjZS5cbiAgICogQHBhcmFtIG5hbWVzcGFjZSBOYW1lc3BhY2UgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGljb24gc2V0LlxuICAgKiBAcGFyYW0gbGl0ZXJhbCBTVkcgc291cmNlIG9mIHRoZSBpY29uIHNldC5cbiAgICovXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsSW5OYW1lc3BhY2UobmFtZXNwYWNlOiBzdHJpbmcsIGxpdGVyYWw6IFNhZmVIdG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IHRoaXMge1xuICAgIGNvbnN0IHNhbml0aXplZExpdGVyYWwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIGxpdGVyYWwpO1xuXG4gICAgaWYgKCFzYW5pdGl6ZWRMaXRlcmFsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uRmFpbGVkVG9TYW5pdGl6ZUxpdGVyYWxFcnJvcihsaXRlcmFsKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdmdFbGVtZW50ID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcoc2FuaXRpemVkTGl0ZXJhbCk7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFN2Z0ljb25TZXRDb25maWcobmFtZXNwYWNlLCBuZXcgU3ZnSWNvbkNvbmZpZyhzdmdFbGVtZW50LCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBhbGlhcyBmb3IgYSBDU1MgY2xhc3MgbmFtZSB0byBiZSB1c2VkIGZvciBpY29uIGZvbnRzLiBDcmVhdGluZyBhbiBtYXRJY29uXG4gICAqIGNvbXBvbmVudCB3aXRoIHRoZSBhbGlhcyBhcyB0aGUgZm9udFNldCBpbnB1dCB3aWxsIGNhdXNlIHRoZSBjbGFzcyBuYW1lIHRvIGJlIGFwcGxpZWRcbiAgICogdG8gdGhlIGA8bWF0LWljb24+YCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gYWxpYXMgQWxpYXMgZm9yIHRoZSBmb250LlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIENsYXNzIG5hbWUgb3ZlcnJpZGUgdG8gYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSBhbGlhcy5cbiAgICovXG4gIHJlZ2lzdGVyRm9udENsYXNzQWxpYXMoYWxpYXM6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcgPSBhbGlhcyk6IHRoaXMge1xuICAgIHRoaXMuX2ZvbnRDc3NDbGFzc2VzQnlBbGlhcy5zZXQoYWxpYXMsIGNsYXNzTmFtZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQ1NTIGNsYXNzIG5hbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBhbGlhcyBieSBhIHByZXZpb3VzIGNhbGwgdG9cbiAgICogcmVnaXN0ZXJGb250Q2xhc3NBbGlhcy4gSWYgbm8gQ1NTIGNsYXNzIGhhcyBiZWVuIGFzc29jaWF0ZWQsIHJldHVybnMgdGhlIGFsaWFzIHVubW9kaWZpZWQuXG4gICAqL1xuICBjbGFzc05hbWVGb3JGb250QWxpYXMoYWxpYXM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvbnRDc3NDbGFzc2VzQnlBbGlhcy5nZXQoYWxpYXMpIHx8IGFsaWFzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIENTUyBjbGFzcyBuYW1lIHRvIGJlIHVzZWQgZm9yIGljb24gZm9udHMgd2hlbiBhbiBgPG1hdC1pY29uPmAgY29tcG9uZW50IGRvZXMgbm90XG4gICAqIGhhdmUgYSBmb250U2V0IGlucHV0IHZhbHVlLCBhbmQgaXMgbm90IGxvYWRpbmcgYW4gaWNvbiBieSBuYW1lIG9yIFVSTC5cbiAgICpcbiAgICogQHBhcmFtIGNsYXNzTmFtZVxuICAgKi9cbiAgc2V0RGVmYXVsdEZvbnRTZXRDbGFzcyhjbGFzc05hbWU6IHN0cmluZyk6IHRoaXMge1xuICAgIHRoaXMuX2RlZmF1bHRGb250U2V0Q2xhc3MgPSBjbGFzc05hbWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQ1NTIGNsYXNzIG5hbWUgdG8gYmUgdXNlZCBmb3IgaWNvbiBmb250cyB3aGVuIGFuIGA8bWF0LWljb24+YCBjb21wb25lbnQgZG9lcyBub3RcbiAgICogaGF2ZSBhIGZvbnRTZXQgaW5wdXQgdmFsdWUsIGFuZCBpcyBub3QgbG9hZGluZyBhbiBpY29uIGJ5IG5hbWUgb3IgVVJMLlxuICAgKi9cbiAgZ2V0RGVmYXVsdEZvbnRTZXRDbGFzcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0Rm9udFNldENsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHByb2R1Y2VzIHRoZSBpY29uIChhcyBhbiBgPHN2Zz5gIERPTSBlbGVtZW50KSBmcm9tIHRoZSBnaXZlbiBVUkwuXG4gICAqIFRoZSByZXNwb25zZSBmcm9tIHRoZSBVUkwgbWF5IGJlIGNhY2hlZCBzbyB0aGlzIHdpbGwgbm90IGFsd2F5cyBjYXVzZSBhbiBIVFRQIHJlcXVlc3QsIGJ1dFxuICAgKiB0aGUgcHJvZHVjZWQgZWxlbWVudCB3aWxsIGFsd2F5cyBiZSBhIG5ldyBjb3B5IG9mIHRoZSBvcmlnaW5hbGx5IGZldGNoZWQgaWNvbi4gKFRoYXQgaXMsXG4gICAqIGl0IHdpbGwgbm90IGNvbnRhaW4gYW55IG1vZGlmaWNhdGlvbnMgbWFkZSB0byBlbGVtZW50cyBwcmV2aW91c2x5IHJldHVybmVkKS5cbiAgICpcbiAgICogQHBhcmFtIHNhZmVVcmwgVVJMIGZyb20gd2hpY2ggdG8gZmV0Y2ggdGhlIFNWRyBpY29uLlxuICAgKi9cbiAgZ2V0U3ZnSWNvbkZyb21Vcmwoc2FmZVVybDogU2FmZVJlc291cmNlVXJsKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgY29uc3QgdXJsID0gdGhpcy5fc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHNhZmVVcmwpO1xuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IGdldE1hdEljb25GYWlsZWRUb1Nhbml0aXplVXJsRXJyb3Ioc2FmZVVybCk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FjaGVkSWNvbiA9IHRoaXMuX2NhY2hlZEljb25zQnlVcmwuZ2V0KHVybCk7XG5cbiAgICBpZiAoY2FjaGVkSWNvbikge1xuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjbG9uZVN2ZyhjYWNoZWRJY29uKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2xvYWRTdmdJY29uRnJvbUNvbmZpZyhuZXcgU3ZnSWNvbkNvbmZpZyhzYWZlVXJsKSkucGlwZShcbiAgICAgIHRhcChzdmcgPT4gdGhpcy5fY2FjaGVkSWNvbnNCeVVybC5zZXQodXJsISwgc3ZnKSksXG4gICAgICBtYXAoc3ZnID0+IGNsb25lU3ZnKHN2ZykpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgcHJvZHVjZXMgdGhlIGljb24gKGFzIGFuIGA8c3ZnPmAgRE9NIGVsZW1lbnQpIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICogYW5kIG5hbWVzcGFjZS4gVGhlIGljb24gbXVzdCBoYXZlIGJlZW4gcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggYWRkSWNvbiBvciBhZGRJY29uU2V0O1xuICAgKiBpZiBub3QsIHRoZSBPYnNlcnZhYmxlIHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGljb24gdG8gYmUgcmV0cmlldmVkLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byBsb29rIGZvciB0aGUgaWNvbi5cbiAgICovXG4gIGdldE5hbWVkU3ZnSWNvbihuYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nID0gJycpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICAvLyBSZXR1cm4gKGNvcHkgb2YpIGNhY2hlZCBpY29uIGlmIHBvc3NpYmxlLlxuICAgIGNvbnN0IGtleSA9IGljb25LZXkobmFtZXNwYWNlLCBuYW1lKTtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLl9zdmdJY29uQ29uZmlncy5nZXQoa2V5KTtcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRTdmdGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgLy8gU2VlIGlmIHdlIGhhdmUgYW55IGljb24gc2V0cyByZWdpc3RlcmVkIGZvciB0aGUgbmFtZXNwYWNlLlxuICAgIGNvbnN0IGljb25TZXRDb25maWdzID0gdGhpcy5faWNvblNldENvbmZpZ3MuZ2V0KG5hbWVzcGFjZSk7XG5cbiAgICBpZiAoaWNvblNldENvbmZpZ3MpIHtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRTdmdGcm9tSWNvblNldENvbmZpZ3MobmFtZSwgaWNvblNldENvbmZpZ3MpO1xuICAgIH1cblxuICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3coZ2V0TWF0SWNvbk5hbWVOb3RGb3VuZEVycm9yKGtleSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICB0aGlzLl9zdmdJY29uQ29uZmlncy5jbGVhcigpO1xuICAgdGhpcy5faWNvblNldENvbmZpZ3MuY2xlYXIoKTtcbiAgIHRoaXMuX2NhY2hlZEljb25zQnlVcmwuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjYWNoZWQgaWNvbiBmb3IgYSBTdmdJY29uQ29uZmlnIGlmIGF2YWlsYWJsZSwgb3IgZmV0Y2hlcyBpdCBmcm9tIGl0cyBVUkwgaWYgbm90LlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0U3ZnRnJvbUNvbmZpZyhjb25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICBpZiAoY29uZmlnLnN2Z0VsZW1lbnQpIHtcbiAgICAgIC8vIFdlIGFscmVhZHkgaGF2ZSB0aGUgU1ZHIGVsZW1lbnQgZm9yIHRoaXMgaWNvbiwgcmV0dXJuIGEgY29weS5cbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoY2xvbmVTdmcoY29uZmlnLnN2Z0VsZW1lbnQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmV0Y2ggdGhlIGljb24gZnJvbSB0aGUgY29uZmlnJ3MgVVJMLCBjYWNoZSBpdCwgYW5kIHJldHVybiBhIGNvcHkuXG4gICAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25Gcm9tQ29uZmlnKGNvbmZpZykucGlwZShcbiAgICAgICAgdGFwKHN2ZyA9PiBjb25maWcuc3ZnRWxlbWVudCA9IHN2ZyksXG4gICAgICAgIG1hcChzdmcgPT4gY2xvbmVTdmcoc3ZnKSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBmaW5kIGFuIGljb24gd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgaW4gYW55IG9mIHRoZSBTVkcgaWNvbiBzZXRzLlxuICAgKiBGaXJzdCBzZWFyY2hlcyB0aGUgYXZhaWxhYmxlIGNhY2hlZCBpY29ucyBmb3IgYSBuZXN0ZWQgZWxlbWVudCB3aXRoIGEgbWF0Y2hpbmcgbmFtZSwgYW5kXG4gICAqIGlmIGZvdW5kIGNvcGllcyB0aGUgZWxlbWVudCB0byBhIG5ldyBgPHN2Zz5gIGVsZW1lbnQuIElmIG5vdCBmb3VuZCwgZmV0Y2hlcyBhbGwgaWNvbiBzZXRzXG4gICAqIHRoYXQgaGF2ZSBub3QgYmVlbiBjYWNoZWQsIGFuZCBzZWFyY2hlcyBhZ2FpbiBhZnRlciBhbGwgZmV0Y2hlcyBhcmUgY29tcGxldGVkLlxuICAgKiBUaGUgcmV0dXJuZWQgT2JzZXJ2YWJsZSBwcm9kdWNlcyB0aGUgU1ZHIGVsZW1lbnQgaWYgcG9zc2libGUsIGFuZCB0aHJvd3NcbiAgICogYW4gZXJyb3IgaWYgbm8gaWNvbiB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBjYW4gYmUgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTdmdGcm9tSWNvblNldENvbmZpZ3MobmFtZTogc3RyaW5nLCBpY29uU2V0Q29uZmlnczogU3ZnSWNvbkNvbmZpZ1tdKTpcbiAgICAgIE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIC8vIEZvciBhbGwgdGhlIGljb24gc2V0IFNWRyBlbGVtZW50cyB3ZSd2ZSBmZXRjaGVkLCBzZWUgaWYgYW55IGNvbnRhaW4gYW4gaWNvbiB3aXRoIHRoZVxuICAgIC8vIHJlcXVlc3RlZCBuYW1lLlxuICAgIGNvbnN0IG5hbWVkSWNvbiA9IHRoaXMuX2V4dHJhY3RJY29uV2l0aE5hbWVGcm9tQW55U2V0KG5hbWUsIGljb25TZXRDb25maWdzKTtcblxuICAgIGlmIChuYW1lZEljb24pIHtcbiAgICAgIC8vIFdlIGNvdWxkIGNhY2hlIG5hbWVkSWNvbiBpbiBfc3ZnSWNvbkNvbmZpZ3MsIGJ1dCBzaW5jZSB3ZSBoYXZlIHRvIG1ha2UgYSBjb3B5IGV2ZXJ5XG4gICAgICAvLyB0aW1lIGFueXdheSwgdGhlcmUncyBwcm9iYWJseSBub3QgbXVjaCBhZHZhbnRhZ2UgY29tcGFyZWQgdG8ganVzdCBhbHdheXMgZXh0cmFjdGluZ1xuICAgICAgLy8gaXQgZnJvbSB0aGUgaWNvbiBzZXQuXG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG5hbWVkSWNvbik7XG4gICAgfVxuXG4gICAgLy8gTm90IGZvdW5kIGluIGFueSBjYWNoZWQgaWNvbiBzZXRzLiBJZiB0aGVyZSBhcmUgaWNvbiBzZXRzIHdpdGggVVJMcyB0aGF0IHdlIGhhdmVuJ3RcbiAgICAvLyBmZXRjaGVkLCBmZXRjaCB0aGVtIG5vdyBhbmQgbG9vayBmb3IgaWNvbk5hbWUgaW4gdGhlIHJlc3VsdHMuXG4gICAgY29uc3QgaWNvblNldEZldGNoUmVxdWVzdHM6IE9ic2VydmFibGU8U1ZHRWxlbWVudCB8IG51bGw+W10gPSBpY29uU2V0Q29uZmlnc1xuICAgICAgLmZpbHRlcihpY29uU2V0Q29uZmlnID0+ICFpY29uU2V0Q29uZmlnLnN2Z0VsZW1lbnQpXG4gICAgICAubWFwKGljb25TZXRDb25maWcgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFN2Z0ljb25TZXRGcm9tQ29uZmlnKGljb25TZXRDb25maWcpLnBpcGUoXG4gICAgICAgICAgY2F0Y2hFcnJvcigoZXJyOiBIdHRwRXJyb3JSZXNwb25zZSk6IE9ic2VydmFibGU8U1ZHRWxlbWVudCB8IG51bGw+ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCBpY29uU2V0Q29uZmlnLnVybCk7XG5cbiAgICAgICAgICAgIC8vIFN3YWxsb3cgZXJyb3JzIGZldGNoaW5nIGluZGl2aWR1YWwgVVJMcyBzbyB0aGVcbiAgICAgICAgICAgIC8vIGNvbWJpbmVkIE9ic2VydmFibGUgd29uJ3QgbmVjZXNzYXJpbHkgZmFpbC5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBMb2FkaW5nIGljb24gc2V0IFVSTDogJHt1cmx9IGZhaWxlZDogJHtlcnIubWVzc2FnZX1gO1xuICAgICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBfZXJyb3JIYW5kbGVyIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkXG4gICAgICAgICAgICBpZiAodGhpcy5fZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlci5oYW5kbGVFcnJvcihuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG51bGwpO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIC8vIEZldGNoIGFsbCB0aGUgaWNvbiBzZXQgVVJMcy4gV2hlbiB0aGUgcmVxdWVzdHMgY29tcGxldGUsIGV2ZXJ5IEljb25TZXQgc2hvdWxkIGhhdmUgYVxuICAgIC8vIGNhY2hlZCBTVkcgZWxlbWVudCAodW5sZXNzIHRoZSByZXF1ZXN0IGZhaWxlZCksIGFuZCB3ZSBjYW4gY2hlY2sgYWdhaW4gZm9yIHRoZSBpY29uLlxuICAgIHJldHVybiBmb3JrSm9pbihpY29uU2V0RmV0Y2hSZXF1ZXN0cykucGlwZShtYXAoKCkgPT4ge1xuICAgICAgY29uc3QgZm91bmRJY29uID0gdGhpcy5fZXh0cmFjdEljb25XaXRoTmFtZUZyb21BbnlTZXQobmFtZSwgaWNvblNldENvbmZpZ3MpO1xuXG4gICAgICBpZiAoIWZvdW5kSWNvbikge1xuICAgICAgICB0aHJvdyBnZXRNYXRJY29uTmFtZU5vdEZvdW5kRXJyb3IobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb3VuZEljb247XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIHRoZSBjYWNoZWQgU1ZHIGVsZW1lbnRzIGZvciB0aGUgZ2l2ZW4gaWNvbiBzZXRzIGZvciBhIG5lc3RlZCBpY29uIGVsZW1lbnQgd2hvc2UgXCJpZFwiXG4gICAqIHRhZyBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbmFtZS4gSWYgZm91bmQsIGNvcGllcyB0aGUgbmVzdGVkIGVsZW1lbnQgdG8gYSBuZXcgU1ZHIGVsZW1lbnQgYW5kXG4gICAqIHJldHVybnMgaXQuIFJldHVybnMgbnVsbCBpZiBubyBtYXRjaGluZyBlbGVtZW50IGlzIGZvdW5kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZXh0cmFjdEljb25XaXRoTmFtZUZyb21BbnlTZXQoaWNvbk5hbWU6IHN0cmluZywgaWNvblNldENvbmZpZ3M6IFN2Z0ljb25Db25maWdbXSk6XG4gICAgICBTVkdFbGVtZW50IHwgbnVsbCB7XG4gICAgLy8gSXRlcmF0ZSBiYWNrd2FyZHMsIHNvIGljb24gc2V0cyBhZGRlZCBsYXRlciBoYXZlIHByZWNlZGVuY2UuXG4gICAgZm9yIChsZXQgaSA9IGljb25TZXRDb25maWdzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBjb25maWcgPSBpY29uU2V0Q29uZmlnc1tpXTtcbiAgICAgIGlmIChjb25maWcuc3ZnRWxlbWVudCkge1xuICAgICAgICBjb25zdCBmb3VuZEljb24gPSB0aGlzLl9leHRyYWN0U3ZnSWNvbkZyb21TZXQoY29uZmlnLnN2Z0VsZW1lbnQsIGljb25OYW1lLCBjb25maWcub3B0aW9ucyk7XG4gICAgICAgIGlmIChmb3VuZEljb24pIHtcbiAgICAgICAgICByZXR1cm4gZm91bmRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjb250ZW50IG9mIHRoZSBpY29uIFVSTCBzcGVjaWZpZWQgaW4gdGhlIFN2Z0ljb25Db25maWcgYW5kIGNyZWF0ZXMgYW4gU1ZHIGVsZW1lbnRcbiAgICogZnJvbSBpdC5cbiAgICovXG4gIHByaXZhdGUgX2xvYWRTdmdJY29uRnJvbUNvbmZpZyhjb25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZmV0Y2hVcmwoY29uZmlnLnVybClcbiAgICAgICAgLnBpcGUobWFwKHN2Z1RleHQgPT4gdGhpcy5fY3JlYXRlU3ZnRWxlbWVudEZvclNpbmdsZUljb24oc3ZnVGV4dCwgY29uZmlnLm9wdGlvbnMpKSk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIGNvbnRlbnQgb2YgdGhlIGljb24gc2V0IFVSTCBzcGVjaWZpZWQgaW4gdGhlIFN2Z0ljb25Db25maWcgYW5kIGNyZWF0ZXMgYW4gU1ZHIGVsZW1lbnRcbiAgICogZnJvbSBpdC5cbiAgICovXG4gIHByaXZhdGUgX2xvYWRTdmdJY29uU2V0RnJvbUNvbmZpZyhjb25maWc6IFN2Z0ljb25Db25maWcpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICAvLyBJZiB0aGUgU1ZHIGZvciB0aGlzIGljb24gc2V0IGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkLCBkbyBub3RoaW5nLlxuICAgIGlmIChjb25maWcuc3ZnRWxlbWVudCkge1xuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjb25maWcuc3ZnRWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ZldGNoVXJsKGNvbmZpZy51cmwpLnBpcGUobWFwKHN2Z1RleHQgPT4ge1xuICAgICAgLy8gSXQgaXMgcG9zc2libGUgdGhhdCB0aGUgaWNvbiBzZXQgd2FzIHBhcnNlZCBhbmQgY2FjaGVkIGJ5IGFuIGVhcmxpZXIgcmVxdWVzdCwgc28gcGFyc2luZ1xuICAgICAgLy8gb25seSBuZWVkcyB0byBvY2N1ciBpZiB0aGUgY2FjaGUgaXMgeWV0IHVuc2V0LlxuICAgICAgaWYgKCFjb25maWcuc3ZnRWxlbWVudCkge1xuICAgICAgICBjb25maWcuc3ZnRWxlbWVudCA9IHRoaXMuX3N2Z0VsZW1lbnRGcm9tU3RyaW5nKHN2Z1RleHQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29uZmlnLnN2Z0VsZW1lbnQ7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBET00gZWxlbWVudCBmcm9tIHRoZSBnaXZlbiBTVkcgc3RyaW5nLCBhbmQgYWRkcyBkZWZhdWx0IGF0dHJpYnV0ZXMuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVTdmdFbGVtZW50Rm9yU2luZ2xlSWNvbihyZXNwb25zZVRleHQ6IHN0cmluZywgb3B0aW9ucz86IEljb25PcHRpb25zKTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcocmVzcG9uc2VUZXh0KTtcbiAgICB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKHN2Zywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyB0aGUgY2FjaGVkIGVsZW1lbnQgb2YgdGhlIGdpdmVuIFN2Z0ljb25Db25maWcgZm9yIGEgbmVzdGVkIGljb24gZWxlbWVudCB3aG9zZSBcImlkXCJcbiAgICogdGFnIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBuYW1lLiBJZiBmb3VuZCwgY29waWVzIHRoZSBuZXN0ZWQgZWxlbWVudCB0byBhIG5ldyBTVkcgZWxlbWVudCBhbmRcbiAgICogcmV0dXJucyBpdC4gUmV0dXJucyBudWxsIGlmIG5vIG1hdGNoaW5nIGVsZW1lbnQgaXMgZm91bmQuXG4gICAqL1xuICBwcml2YXRlIF9leHRyYWN0U3ZnSWNvbkZyb21TZXQoaWNvblNldDogU1ZHRWxlbWVudCwgaWNvbk5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IFNWR0VsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBVc2UgdGhlIGBpZD1cImljb25OYW1lXCJgIHN5bnRheCBpbiBvcmRlciB0byBlc2NhcGUgc3BlY2lhbFxuICAgIC8vIGNoYXJhY3RlcnMgaW4gdGhlIElEICh2ZXJzdXMgdXNpbmcgdGhlICNpY29uTmFtZSBzeW50YXgpLlxuICAgIGNvbnN0IGljb25Tb3VyY2UgPSBpY29uU2V0LnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7aWNvbk5hbWV9XCJdYCk7XG5cbiAgICBpZiAoIWljb25Tb3VyY2UpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENsb25lIHRoZSBlbGVtZW50IGFuZCByZW1vdmUgdGhlIElEIHRvIHByZXZlbnQgbXVsdGlwbGUgZWxlbWVudHMgZnJvbSBiZWluZyBhZGRlZFxuICAgIC8vIHRvIHRoZSBwYWdlIHdpdGggdGhlIHNhbWUgSUQuXG4gICAgY29uc3QgaWNvbkVsZW1lbnQgPSBpY29uU291cmNlLmNsb25lTm9kZSh0cnVlKSBhcyBFbGVtZW50O1xuICAgIGljb25FbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcblxuICAgIC8vIElmIHRoZSBpY29uIG5vZGUgaXMgaXRzZWxmIGFuIDxzdmc+IG5vZGUsIGNsb25lIGFuZCByZXR1cm4gaXQgZGlyZWN0bHkuIElmIG5vdCwgc2V0IGl0IGFzXG4gICAgLy8gdGhlIGNvbnRlbnQgb2YgYSBuZXcgPHN2Zz4gbm9kZS5cbiAgICBpZiAoaWNvbkVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2ZycpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKGljb25FbGVtZW50IGFzIFNWR0VsZW1lbnQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBub2RlIGlzIGEgPHN5bWJvbD4sIGl0IHdvbid0IGJlIHJlbmRlcmVkIHNvIHdlIGhhdmUgdG8gY29udmVydCBpdCBpbnRvIDxzdmc+LiBOb3RlXG4gICAgLy8gdGhhdCB0aGUgc2FtZSBjb3VsZCBiZSBhY2hpZXZlZCBieSByZWZlcnJpbmcgdG8gaXQgdmlhIDx1c2UgaHJlZj1cIiNpZFwiPiwgaG93ZXZlciB0aGUgPHVzZT5cbiAgICAvLyB0YWcgaXMgcHJvYmxlbWF0aWMgb24gRmlyZWZveCwgYmVjYXVzZSBpdCBuZWVkcyB0byBpbmNsdWRlIHRoZSBjdXJyZW50IHBhZ2UgcGF0aC5cbiAgICBpZiAoaWNvbkVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRTdmdBdHRyaWJ1dGVzKHRoaXMuX3RvU3ZnRWxlbWVudChpY29uRWxlbWVudCksIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZUVsZW1lbnQoJ1NWRycpIGRvZXNuJ3Qgd29yayBhcyBleHBlY3RlZDsgdGhlIERPTSBlbmRzIHVwIHdpdGhcbiAgICAvLyB0aGUgY29ycmVjdCBub2RlcywgYnV0IHRoZSBTVkcgY29udGVudCBkb2Vzbid0IHJlbmRlci4gSW5zdGVhZCB3ZVxuICAgIC8vIGhhdmUgdG8gY3JlYXRlIGFuIGVtcHR5IFNWRyBub2RlIHVzaW5nIGlubmVySFRNTCBhbmQgYXBwZW5kIGl0cyBjb250ZW50LlxuICAgIC8vIEVsZW1lbnRzIGNyZWF0ZWQgdXNpbmcgRE9NUGFyc2VyLnBhcnNlRnJvbVN0cmluZyBoYXZlIHRoZSBzYW1lIHByb2JsZW0uXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMzAwMzI3OC9zdmctaW5uZXJodG1sLWluLWZpcmVmb3gtY2FuLW5vdC1kaXNwbGF5XG4gICAgY29uc3Qgc3ZnID0gdGhpcy5fc3ZnRWxlbWVudEZyb21TdHJpbmcoJzxzdmc+PC9zdmc+Jyk7XG4gICAgLy8gQ2xvbmUgdGhlIG5vZGUgc28gd2UgZG9uJ3QgcmVtb3ZlIGl0IGZyb20gdGhlIHBhcmVudCBpY29uIHNldCBlbGVtZW50LlxuICAgIHN2Zy5hcHBlbmRDaGlsZChpY29uRWxlbWVudCk7XG5cbiAgICByZXR1cm4gdGhpcy5fc2V0U3ZnQXR0cmlidXRlcyhzdmcsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBET00gZWxlbWVudCBmcm9tIHRoZSBnaXZlbiBTVkcgc3RyaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3ZnRWxlbWVudEZyb21TdHJpbmcoc3RyOiBzdHJpbmcpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBkaXYgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyO1xuICAgIGNvbnN0IHN2ZyA9IGRpdi5xdWVyeVNlbGVjdG9yKCdzdmcnKSBhcyBTVkdFbGVtZW50O1xuXG4gICAgaWYgKCFzdmcpIHtcbiAgICAgIHRocm93IEVycm9yKCc8c3ZnPiB0YWcgbm90IGZvdW5kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbiBlbGVtZW50IGludG8gYW4gU1ZHIG5vZGUgYnkgY2xvbmluZyBhbGwgb2YgaXRzIGNoaWxkcmVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfdG9TdmdFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBzdmcgPSB0aGlzLl9zdmdFbGVtZW50RnJvbVN0cmluZygnPHN2Zz48L3N2Zz4nKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzO1xuXG4gICAgLy8gQ29weSBvdmVyIGFsbCB0aGUgYXR0cmlidXRlcyBmcm9tIHRoZSBgc3ltYm9sYCB0byB0aGUgbmV3IFNWRywgZXhjZXB0IHRoZSBpZC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHtuYW1lLCB2YWx1ZX0gPSBhdHRyaWJ1dGVzW2ldO1xuXG4gICAgICBpZiAobmFtZSAhPT0gJ2lkJykge1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGROb2Rlc1tpXS5ub2RlVHlwZSA9PT0gdGhpcy5fZG9jdW1lbnQuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChlbGVtZW50LmNoaWxkTm9kZXNbaV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgYXR0cmlidXRlcyBmb3IgYW4gU1ZHIGVsZW1lbnQgdG8gYmUgdXNlZCBhcyBhbiBpY29uLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0U3ZnQXR0cmlidXRlcyhzdmc6IFNWR0VsZW1lbnQsIG9wdGlvbnM/OiBJY29uT3B0aW9ucyk6IFNWR0VsZW1lbnQge1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpdCcsICcnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdmb2N1c2FibGUnLCAnZmFsc2UnKTsgLy8gRGlzYWJsZSBJRTExIGRlZmF1bHQgYmVoYXZpb3IgdG8gbWFrZSBTVkdzIGZvY3VzYWJsZS5cblxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudmlld0JveCkge1xuICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIG9wdGlvbnMudmlld0JveCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgd2hpY2ggcHJvZHVjZXMgdGhlIHN0cmluZyBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gVVJMLiBSZXN1bHRzIG1heSBiZVxuICAgKiBjYWNoZWQsIHNvIGZ1dHVyZSBjYWxscyB3aXRoIHRoZSBzYW1lIFVSTCBtYXkgbm90IGNhdXNlIGFub3RoZXIgSFRUUCByZXF1ZXN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfZmV0Y2hVcmwoc2FmZVVybDogU2FmZVJlc291cmNlVXJsIHwgbnVsbCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgaWYgKCF0aGlzLl9odHRwQ2xpZW50KSB7XG4gICAgICB0aHJvdyBnZXRNYXRJY29uTm9IdHRwUHJvdmlkZXJFcnJvcigpO1xuICAgIH1cblxuICAgIGlmIChzYWZlVXJsID09IG51bGwpIHtcbiAgICAgIHRocm93IEVycm9yKGBDYW5ub3QgZmV0Y2ggaWNvbiBmcm9tIFVSTCBcIiR7c2FmZVVybH1cIi5gKTtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlJFU09VUkNFX1VSTCwgc2FmZVVybCk7XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgZ2V0TWF0SWNvbkZhaWxlZFRvU2FuaXRpemVVcmxFcnJvcihzYWZlVXJsKTtcbiAgICB9XG5cbiAgICAvLyBTdG9yZSBpbi1wcm9ncmVzcyBmZXRjaGVzIHRvIGF2b2lkIHNlbmRpbmcgYSBkdXBsaWNhdGUgcmVxdWVzdCBmb3IgYSBVUkwgd2hlbiB0aGVyZSBpc1xuICAgIC8vIGFscmVhZHkgYSByZXF1ZXN0IGluIHByb2dyZXNzIGZvciB0aGF0IFVSTC4gSXQncyBuZWNlc3NhcnkgdG8gY2FsbCBzaGFyZSgpIG9uIHRoZVxuICAgIC8vIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgaHR0cC5nZXQoKSBzbyB0aGF0IG11bHRpcGxlIHN1YnNjcmliZXJzIGRvbid0IGNhdXNlIG11bHRpcGxlIFhIUnMuXG4gICAgY29uc3QgaW5Qcm9ncmVzc0ZldGNoID0gdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuZ2V0KHVybCk7XG5cbiAgICBpZiAoaW5Qcm9ncmVzc0ZldGNoKSB7XG4gICAgICByZXR1cm4gaW5Qcm9ncmVzc0ZldGNoO1xuICAgIH1cblxuICAgIC8vIFRPRE8oamVsYm91cm4pOiBmb3Igc29tZSByZWFzb24sIHRoZSBgZmluYWxpemVgIG9wZXJhdG9yIFwibG9zZXNcIiB0aGUgZ2VuZXJpYyB0eXBlIG9uIHRoZVxuICAgIC8vIE9ic2VydmFibGUuIEZpZ3VyZSBvdXQgd2h5IGFuZCBmaXggaXQuXG4gICAgY29uc3QgcmVxID0gdGhpcy5faHR0cENsaWVudC5nZXQodXJsLCB7cmVzcG9uc2VUeXBlOiAndGV4dCd9KS5waXBlKFxuICAgICAgZmluYWxpemUoKCkgPT4gdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuZGVsZXRlKHVybCkpLFxuICAgICAgc2hhcmUoKSxcbiAgICApO1xuXG4gICAgdGhpcy5faW5Qcm9ncmVzc1VybEZldGNoZXMuc2V0KHVybCwgcmVxKTtcbiAgICByZXR1cm4gcmVxO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBpY29uIGNvbmZpZyBieSBuYW1lIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBjb25maWcuXG4gICAqIEBwYXJhbSBpY29uTmFtZSBOYW1lIHVuZGVyIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBjb25maWcuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBwcml2YXRlIF9hZGRTdmdJY29uQ29uZmlnKG5hbWVzcGFjZTogc3RyaW5nLCBpY29uTmFtZTogc3RyaW5nLCBjb25maWc6IFN2Z0ljb25Db25maWcpOiB0aGlzIHtcbiAgICB0aGlzLl9zdmdJY29uQ29uZmlncy5zZXQoaWNvbktleShuYW1lc3BhY2UsIGljb25OYW1lKSwgY29uZmlnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gaWNvbiBzZXQgY29uZmlnIGluIHRoZSBzcGVjaWZpZWQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gbmFtZXNwYWNlIE5hbWVzcGFjZSBpbiB3aGljaCB0byByZWdpc3RlciB0aGUgaWNvbiBjb25maWcuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBwcml2YXRlIF9hZGRTdmdJY29uU2V0Q29uZmlnKG5hbWVzcGFjZTogc3RyaW5nLCBjb25maWc6IFN2Z0ljb25Db25maWcpOiB0aGlzIHtcbiAgICBjb25zdCBjb25maWdOYW1lc3BhY2UgPSB0aGlzLl9pY29uU2V0Q29uZmlncy5nZXQobmFtZXNwYWNlKTtcblxuICAgIGlmIChjb25maWdOYW1lc3BhY2UpIHtcbiAgICAgIGNvbmZpZ05hbWVzcGFjZS5wdXNoKGNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ljb25TZXRDb25maWdzLnNldChuYW1lc3BhY2UsIFtjb25maWddKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIElDT05fUkVHSVNUUllfUFJPVklERVJfRkFDVE9SWShcbiAgcGFyZW50UmVnaXN0cnk6IE1hdEljb25SZWdpc3RyeSxcbiAgaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gIGRvY3VtZW50PzogYW55LFxuICBlcnJvckhhbmRsZXI/OiBFcnJvckhhbmRsZXIpIHtcbiAgcmV0dXJuIHBhcmVudFJlZ2lzdHJ5IHx8IG5ldyBNYXRJY29uUmVnaXN0cnkoaHR0cENsaWVudCwgc2FuaXRpemVyLCBkb2N1bWVudCwgZXJyb3JIYW5kbGVyKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBJQ09OX1JFR0lTVFJZX1BST1ZJREVSID0ge1xuICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGFuIE1hdEljb25SZWdpc3RyeSBhdmFpbGFibGUsIHVzZSB0aGF0LiBPdGhlcndpc2UsIHByb3ZpZGUgYSBuZXcgb25lLlxuICBwcm92aWRlOiBNYXRJY29uUmVnaXN0cnksXG4gIGRlcHM6IFtcbiAgICBbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNYXRJY29uUmVnaXN0cnldLFxuICAgIFtuZXcgT3B0aW9uYWwoKSwgSHR0cENsaWVudF0sXG4gICAgRG9tU2FuaXRpemVyLFxuICAgIFtuZXcgT3B0aW9uYWwoKSwgRXJyb3JIYW5kbGVyXSxcbiAgICBbbmV3IE9wdGlvbmFsKCksIERPQ1VNRU5UIGFzIEluamVjdGlvblRva2VuPGFueT5dLFxuICBdLFxuICB1c2VGYWN0b3J5OiBJQ09OX1JFR0lTVFJZX1BST1ZJREVSX0ZBQ1RPUlksXG59O1xuXG4vKiogQ2xvbmVzIGFuIFNWR0VsZW1lbnQgd2hpbGUgcHJlc2VydmluZyB0eXBlIGluZm9ybWF0aW9uLiAqL1xuZnVuY3Rpb24gY2xvbmVTdmcoc3ZnOiBTVkdFbGVtZW50KTogU1ZHRWxlbWVudCB7XG4gIHJldHVybiBzdmcuY2xvbmVOb2RlKHRydWUpIGFzIFNWR0VsZW1lbnQ7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBjYWNoZSBrZXkgdG8gdXNlIGZvciBhbiBpY29uIG5hbWVzcGFjZSBhbmQgbmFtZS4gKi9cbmZ1bmN0aW9uIGljb25LZXkobmFtZXNwYWNlOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICByZXR1cm4gbmFtZXNwYWNlICsgJzonICsgbmFtZTtcbn1cbiJdfQ==