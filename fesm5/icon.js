import { SecurityContext, Injectable, Optional, Inject, ErrorHandler, ɵɵdefineInjectable, ɵɵinject, SkipSelf, InjectionToken, inject, Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, Attribute, Input, NgModule } from '@angular/core';
import { mixinColor, MatCommonModule } from '@angular/material/core';
import { __extends, __read } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { tap, map, catchError, finalize, share, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError, forkJoin } from 'rxjs';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Returns an exception to be thrown in the case when attempting to
 * load an icon with a name that cannot be found.
 * @docs-private
 */
function getMatIconNameNotFoundError(iconName) {
    return Error("Unable to find icon with the name \"" + iconName + "\"");
}
/**
 * Returns an exception to be thrown when the consumer attempts to use
 * `<mat-icon>` without including @angular/common/http.
 * @docs-private
 */
function getMatIconNoHttpProviderError() {
    return Error('Could not find HttpClient provider for use with Angular Material icons. ' +
        'Please include the HttpClientModule from @angular/common/http in your ' +
        'app imports.');
}
/**
 * Returns an exception to be thrown when a URL couldn't be sanitized.
 * @param url URL that was attempted to be sanitized.
 * @docs-private
 */
function getMatIconFailedToSanitizeUrlError(url) {
    return Error("The URL provided to MatIconRegistry was not trusted as a resource URL " +
        ("via Angular's DomSanitizer. Attempted URL was \"" + url + "\"."));
}
/**
 * Returns an exception to be thrown when a HTML string couldn't be sanitized.
 * @param literal HTML that was attempted to be sanitized.
 * @docs-private
 */
function getMatIconFailedToSanitizeLiteralError(literal) {
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
            return of(cloneSvg(cachedIcon));
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
        return throwError(getMatIconNameNotFoundError(key));
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
            return of(cloneSvg(config.svgElement));
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
            return of(namedIcon);
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
                return of(null);
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
            return of(config.svgElement);
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
    MatIconRegistry.ɵprov = ɵɵdefineInjectable({ factory: function MatIconRegistry_Factory() { return new MatIconRegistry(ɵɵinject(HttpClient, 8), ɵɵinject(DomSanitizer), ɵɵinject(DOCUMENT, 8), ɵɵinject(ErrorHandler, 8)); }, token: MatIconRegistry, providedIn: "root" });
    return MatIconRegistry;
}());
/** @docs-private */
function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, httpClient, sanitizer, document, errorHandler) {
    return parentRegistry || new MatIconRegistry(httpClient, sanitizer, document, errorHandler);
}
/** @docs-private */
var ICON_REGISTRY_PROVIDER = {
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Boilerplate for applying mixins to MatIcon.
/** @docs-private */
var MatIconBase = /** @class */ (function () {
    function MatIconBase(_elementRef) {
        this._elementRef = _elementRef;
    }
    return MatIconBase;
}());
var _MatIconMixinBase = mixinColor(MatIconBase);
/**
 * Injection token used to provide the current location to `MatIcon`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
var MAT_ICON_LOCATION = new InjectionToken('mat-icon-location', {
    providedIn: 'root',
    factory: MAT_ICON_LOCATION_FACTORY
});
/** @docs-private */
function MAT_ICON_LOCATION_FACTORY() {
    var _document = inject(DOCUMENT);
    var _location = _document ? _document.location : null;
    return {
        // Note that this needs to be a function, rather than a property, because Angular
        // will only resolve it once, but we want the current path on each call.
        getPathname: function () { return _location ? (_location.pathname + _location.search) : ''; }
    };
}
/** SVG attributes that accept a FuncIRI (e.g. `url(<something>)`). */
var funcIriAttributes = [
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
var ɵ0 = function (attr) { return "[" + attr + "]"; };
/** Selector that can be used to find all elements that are using a `FuncIRI`. */
var funcIriAttributeSelector = funcIriAttributes.map(ɵ0).join(', ');
/** Regex that can be used to extract the id out of a FuncIRI. */
var funcIriPattern = /^url\(['"]?#(.*?)['"]?\)$/;
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
var MatIcon = /** @class */ (function (_super) {
    __extends(MatIcon, _super);
    function MatIcon(elementRef, _iconRegistry, ariaHidden, 
    /**
     * @deprecated `location` parameter to be made required.
     * @breaking-change 8.0.0
     */
    _location, 
    // @breaking-change 9.0.0 _errorHandler parameter to be made required
    _errorHandler) {
        var _this = _super.call(this, elementRef) || this;
        _this._iconRegistry = _iconRegistry;
        _this._location = _location;
        _this._errorHandler = _errorHandler;
        _this._inline = false;
        // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
        // the right thing to do for the majority of icon use-cases.
        if (!ariaHidden) {
            elementRef.nativeElement.setAttribute('aria-hidden', 'true');
        }
        return _this;
    }
    Object.defineProperty(MatIcon.prototype, "inline", {
        /**
         * Whether the icon should be inlined, automatically sizing the icon to match the font size of
         * the element the icon is contained in.
         */
        get: function () {
            return this._inline;
        },
        set: function (inline) {
            this._inline = coerceBooleanProperty(inline);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatIcon.prototype, "fontSet", {
        /** Font set that the icon is a part of. */
        get: function () { return this._fontSet; },
        set: function (value) {
            this._fontSet = this._cleanupFontValue(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatIcon.prototype, "fontIcon", {
        /** Name of an icon within a font set. */
        get: function () { return this._fontIcon; },
        set: function (value) {
            this._fontIcon = this._cleanupFontValue(value);
        },
        enumerable: true,
        configurable: true
    });
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
    MatIcon.prototype._splitIconName = function (iconName) {
        if (!iconName) {
            return ['', ''];
        }
        var parts = iconName.split(':');
        switch (parts.length) {
            case 1: return ['', parts[0]]; // Use default namespace.
            case 2: return parts;
            default: throw Error("Invalid icon name: \"" + iconName + "\"");
        }
    };
    MatIcon.prototype.ngOnChanges = function (changes) {
        var _this = this;
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        var svgIconChanges = changes['svgIcon'];
        if (svgIconChanges) {
            if (this.svgIcon) {
                var _a = __read(this._splitIconName(this.svgIcon), 2), namespace_1 = _a[0], iconName_1 = _a[1];
                this._iconRegistry.getNamedSvgIcon(iconName_1, namespace_1)
                    .pipe(take(1))
                    .subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) {
                    var errorMessage = "Error retrieving icon " + namespace_1 + ":" + iconName_1 + "! " + err.message;
                    // @breaking-change 9.0.0 _errorHandler parameter to be made required.
                    if (_this._errorHandler) {
                        _this._errorHandler.handleError(new Error(errorMessage));
                    }
                    else {
                        console.error(errorMessage);
                    }
                });
            }
            else if (svgIconChanges.previousValue) {
                this._clearSvgElement();
            }
        }
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    MatIcon.prototype.ngOnInit = function () {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <mat-icon>arrow</mat-icon> In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    MatIcon.prototype.ngAfterViewChecked = function () {
        var cachedElements = this._elementsWithExternalReferences;
        if (cachedElements && this._location && cachedElements.size) {
            var newPath = this._location.getPathname();
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
    };
    MatIcon.prototype.ngOnDestroy = function () {
        if (this._elementsWithExternalReferences) {
            this._elementsWithExternalReferences.clear();
        }
    };
    MatIcon.prototype._usingFontIcon = function () {
        return !this.svgIcon;
    };
    MatIcon.prototype._setSvgElement = function (svg) {
        this._clearSvgElement();
        // Workaround for IE11 and Edge ignoring `style` tags inside dynamically-created SVGs.
        // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10898469/
        // Do this before inserting the element into the DOM, in order to avoid a style recalculation.
        var styleTags = svg.querySelectorAll('style');
        for (var i = 0; i < styleTags.length; i++) {
            styleTags[i].textContent += ' ';
        }
        // Note: we do this fix here, rather than the icon registry, because the
        // references have to point to the URL at the time that the icon was created.
        if (this._location) {
            var path = this._location.getPathname();
            this._previousPath = path;
            this._cacheChildrenWithExternalReferences(svg);
            this._prependPathToReferences(path);
        }
        this._elementRef.nativeElement.appendChild(svg);
    };
    MatIcon.prototype._clearSvgElement = function () {
        var layoutElement = this._elementRef.nativeElement;
        var childCount = layoutElement.childNodes.length;
        if (this._elementsWithExternalReferences) {
            this._elementsWithExternalReferences.clear();
        }
        // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
        // we can't use innerHTML, because IE will throw if the element has a data binding.
        while (childCount--) {
            var child = layoutElement.childNodes[childCount];
            // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes in order to get rid
            // of any loose text nodes, as well as any SVG elements in order to remove any old icons.
            if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
                layoutElement.removeChild(child);
            }
        }
    };
    MatIcon.prototype._updateFontIconClasses = function () {
        if (!this._usingFontIcon()) {
            return;
        }
        var elem = this._elementRef.nativeElement;
        var fontSetClass = this.fontSet ?
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
    };
    /**
     * Cleans up a value to be used as a fontIcon or fontSet.
     * Since the value ends up being assigned as a CSS class, we
     * have to trim the value and omit space-separated values.
     */
    MatIcon.prototype._cleanupFontValue = function (value) {
        return typeof value === 'string' ? value.trim().split(' ')[0] : value;
    };
    /**
     * Prepends the current path to all elements that have an attribute pointing to a `FuncIRI`
     * reference. This is required because WebKit browsers require references to be prefixed with
     * the current path, if the page has a `base` tag.
     */
    MatIcon.prototype._prependPathToReferences = function (path) {
        var elements = this._elementsWithExternalReferences;
        if (elements) {
            elements.forEach(function (attrs, element) {
                attrs.forEach(function (attr) {
                    element.setAttribute(attr.name, "url('" + path + "#" + attr.value + "')");
                });
            });
        }
    };
    /**
     * Caches the children of an SVG element that have `url()`
     * references that we need to prefix with the current path.
     */
    MatIcon.prototype._cacheChildrenWithExternalReferences = function (element) {
        var elementsWithFuncIri = element.querySelectorAll(funcIriAttributeSelector);
        var elements = this._elementsWithExternalReferences =
            this._elementsWithExternalReferences || new Map();
        var _loop_1 = function (i) {
            funcIriAttributes.forEach(function (attr) {
                var elementWithReference = elementsWithFuncIri[i];
                var value = elementWithReference.getAttribute(attr);
                var match = value ? value.match(funcIriPattern) : null;
                if (match) {
                    var attributes = elements.get(elementWithReference);
                    if (!attributes) {
                        attributes = [];
                        elements.set(elementWithReference, attributes);
                    }
                    attributes.push({ name: attr, value: match[1] });
                }
            });
        };
        for (var i = 0; i < elementsWithFuncIri.length; i++) {
            _loop_1(i);
        }
    };
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
    MatIcon.ctorParameters = function () { return [
        { type: ElementRef },
        { type: MatIconRegistry },
        { type: String, decorators: [{ type: Attribute, args: ['aria-hidden',] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_ICON_LOCATION,] }] },
        { type: ErrorHandler, decorators: [{ type: Optional }] }
    ]; };
    MatIcon.propDecorators = {
        inline: [{ type: Input }],
        svgIcon: [{ type: Input }],
        fontSet: [{ type: Input }],
        fontIcon: [{ type: Input }]
    };
    return MatIcon;
}(_MatIconMixinBase));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatIconModule = /** @class */ (function () {
    function MatIconModule() {
    }
    MatIconModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatCommonModule],
                    exports: [MatIcon, MatCommonModule],
                    declarations: [MatIcon],
                },] }
    ];
    return MatIconModule;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ICON_REGISTRY_PROVIDER, ICON_REGISTRY_PROVIDER_FACTORY, MAT_ICON_LOCATION, MAT_ICON_LOCATION_FACTORY, MatIcon, MatIconModule, MatIconRegistry, getMatIconFailedToSanitizeLiteralError, getMatIconFailedToSanitizeUrlError, getMatIconNameNotFoundError, getMatIconNoHttpProviderError, ɵ0 };
//# sourceMappingURL=icon.js.map
