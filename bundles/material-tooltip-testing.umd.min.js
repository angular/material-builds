!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("@angular/cdk/testing")):"function"==typeof define&&define.amd?define("@angular/material/tooltip/testing",["exports","@angular/cdk/testing"],n):n(((t=t||self).ng=t.ng||{},t.ng.material=t.ng.material||{},t.ng.material.tooltip=t.ng.material.tooltip||{},t.ng.material.tooltip.testing={}),t.ng.cdk.testing)}(this,(function(t,n){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])})(t,n)};function r(t,n,e,r){return new(e||(e=Promise))((function(o,i){function a(t){try{c(r.next(t))}catch(t){i(t)}}function u(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){t.done?o(t.value):function n(t){return t instanceof e?t:new e((function(n){n(t)}))}(t.value).then(a,u)}c((r=r.apply(t,n||[])).next())}))}function o(t,n){var e,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function c(i){if(e)throw new TypeError("Generator is already executing.");for(;a;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=n.call(t,a)}catch(t){i=[6,t],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}}function i(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return a}function a(){for(var t=[],n=0;n<arguments.length;n++)t=t.concat(i(arguments[n]));return t}var u=function(t){function i(){var n=t.apply(this,a(arguments))||this;return n._optionalPanel=n.documentRootLocatorFactory().locatorForOptional(".mat-tooltip"),n}return function u(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}(i,t),i.with=function(t){return void 0===t&&(t={}),new n.HarnessPredicate(i,t)},i.prototype.show=function(){var t;return r(this,void 0,void 0,(function(){var n;return o(this,(function(e){switch(e.label){case 0:return[4,this.host()];case 1:return n=e.sent(),[4,null===(t=n.dispatchEvent)||void 0===t?void 0:t.call(n,"touchstart",{changedTouches:[]})];case 2:return e.sent(),[4,n.hover()];case 3:return e.sent(),[2]}}))}))},i.prototype.hide=function(){var t;return r(this,void 0,void 0,(function(){var n;return o(this,(function(e){switch(e.label){case 0:return[4,this.host()];case 1:return n=e.sent(),[4,null===(t=n.dispatchEvent)||void 0===t?void 0:t.call(n,"touchend")];case 2:return e.sent(),[4,n.mouseAway()];case 3:return e.sent(),[4,this.forceStabilize()];case 4:return e.sent(),[2]}}))}))},i.prototype.isOpen=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this._optionalPanel()];case 1:return[2,!!t.sent()]}}))}))},i.prototype.getTooltipText=function(){return r(this,void 0,void 0,(function(){var t;return o(this,(function(n){switch(n.label){case 0:return[4,this._optionalPanel()];case 1:return[2,(t=n.sent())?t.text():""]}}))}))},i}(n.ComponentHarness);u.hostSelector=".mat-tooltip-trigger",
/**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
/**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
t.MatTooltipHarness=u,Object.defineProperty(t,"__esModule",{value:!0})}));