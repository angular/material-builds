!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("@angular/cdk/testing")):"function"==typeof define&&define.amd?define("@angular/material/card/testing",["exports","@angular/cdk/testing"],e):e(((t=t||self).ng=t.ng||{},t.ng.material=t.ng.material||{},t.ng.material.card=t.ng.material.card||{},t.ng.material.card.testing={}),t.ng.cdk.testing)}(this,(function(t,e){"use strict";
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
    ***************************************************************************** */var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)};function r(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{c(r.next(t))}catch(t){i(t)}}function u(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){t.done?o(t.value):function e(t){return t instanceof n?t:new n((function(e){e(t)}))}(t.value).then(a,u)}c((r=r.apply(t,e||[])).next())}))}function o(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function c(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}}function i(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var r,o,i=n.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return a}function a(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(i(arguments[e]));return t}var u=function(t){function i(){var e=t.apply(this,a(arguments))||this;return e._title=e.locatorForOptional(".mat-card-title"),e._subtitle=e.locatorForOptional(".mat-card-subtitle"),e}return function u(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}(i,t),i.with=function(t){return void 0===t&&(t={}),new e.HarnessPredicate(i,t).addOption("text",t.text,(function(t,n){return e.HarnessPredicate.stringMatches(t.getText(),n)})).addOption("title",t.title,(function(t,n){return e.HarnessPredicate.stringMatches(t.getTitleText(),n)})).addOption("subtitle",t.subtitle,(function(t,n){return e.HarnessPredicate.stringMatches(t.getSubtitleText(),n)}))},i.prototype.getText=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.host()];case 1:return[2,t.sent().text()]}}))}))},i.prototype.getTitleText=function(){var t,e;return r(this,void 0,void 0,(function(){return o(this,(function(n){switch(n.label){case 0:return[4,this._title()];case 1:return[2,null!==(e=null===(t=n.sent())||void 0===t?void 0:t.text())&&void 0!==e?e:""]}}))}))},i.prototype.getSubtitleText=function(){var t,e;return r(this,void 0,void 0,(function(){return o(this,(function(n){switch(n.label){case 0:return[4,this._subtitle()];case 1:return[2,null!==(e=null===(t=n.sent())||void 0===t?void 0:t.text())&&void 0!==e?e:""]}}))}))},i}(e.ContentContainerComponentHarness);u.hostSelector=".mat-card",
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
t.MatCardHarness=u,Object.defineProperty(t,"__esModule",{value:!0})}));