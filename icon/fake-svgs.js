import { Response, ResponseOptions } from '@angular/http';
/**
 * Fake URLs and associated SVG documents used by tests.
 * @docs-private
 */
var FAKE_SVGS = (function () {
    var svgs = new Map();
    svgs.set('cat.svg', '<svg><path id="meow"></path></svg>');
    svgs.set('dog.svg', '<svg><path id="woof"></path></svg>');
    svgs.set('farm-set-1.svg', "\n      <svg>\n        <defs>\n          <g id=\"pig\"><path id=\"oink\"></path></g>\n          <g id=\"cow\"><path id=\"moo\"></path></g>\n        </defs>\n      </svg>\n  ");
    svgs.set('farm-set-2.svg', "\n      <svg>\n        <defs>\n          <g id=\"cow\"><path id=\"moo moo\"></path></g>\n          <g id=\"sheep\"><path id=\"baa\"></path></g>\n        </defs>\n      </svg>\n  ");
    svgs.set('arrow-set.svg', "\n      <svg>\n        <defs>\n          <svg id=\"left-arrow\"><path id=\"left\"></path></svg>\n          <svg id=\"right-arrow\"><path id=\"right\"></path></svg>\n        </defs>\n      </svg>\n  ");
    return svgs;
})();
/**
 * Returns an HTTP response for a fake SVG URL.
 * @docs-private
 */
export function getFakeSvgHttpResponse(url) {
    if (FAKE_SVGS.has(url)) {
        return new Response(new ResponseOptions({
            status: 200,
            body: FAKE_SVGS.get(url),
        }));
    }
    else {
        return new Response(new ResponseOptions({ status: 404 }));
    }
}

//# sourceMappingURL=fake-svgs.js.map
