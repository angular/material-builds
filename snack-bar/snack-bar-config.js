/**
 * Configuration used when opening a snack-bar.
 */
export var MdSnackBarConfig = (function () {
    function MdSnackBarConfig() {
        /** The politeness level for the MdAriaLiveAnnouncer announcement. */
        this.politeness = 'assertive';
        /** Message to be announced by the MdAriaLiveAnnouncer */
        this.announcementMessage = '';
        /** The view container to place the overlay for the snack bar into. */
        this.viewContainerRef = null;
        /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
        this.duration = 0;
    }
    return MdSnackBarConfig;
}());
//# sourceMappingURL=snack-bar-config.js.map