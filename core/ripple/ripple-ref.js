/**
 * Reference to a previously launched ripple element.
 */
export var RippleRef = (function () {
    function RippleRef(_renderer, element, config) {
        this._renderer = _renderer;
        this.element = element;
        this.config = config;
    }
    /** Fades out the ripple element. */
    RippleRef.prototype.fadeOut = function () {
        this._renderer.fadeOutRipple(this);
    };
    return RippleRef;
}());
//# sourceMappingURL=ripple-ref.js.map