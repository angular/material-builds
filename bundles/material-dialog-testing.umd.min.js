!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("@angular/cdk/testing")):"function"==typeof define&&define.amd?define("@angular/material/dialog/testing",["exports","@angular/cdk/testing"],e):e(((t=t||self).ng=t.ng||{},t.ng.material=t.ng.material||{},t.ng.material.dialog=t.ng.material.dialog||{},t.ng.material.dialog.testing={}),t.ng.cdk.testing)}(this,(function(t,e){"use strict";
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
    ***************************************************************************** */var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)};function r(t,e,n,r){return new(n||(n=Promise))((function(o,i){function u(t){try{s(r.next(t))}catch(t){i(t)}}function a(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){t.done?o(t.value):function e(t){return t instanceof n?t:new n((function(e){e(t)}))}(t.value).then(u,a)}s((r=r.apply(t,e||[])).next())}))}function o(t,e){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function s(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!((o=(o=u.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=e.call(t,u)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}}var i=function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return function u(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}(i,t),i.with=function(t){return void 0===t&&(t={}),new e.HarnessPredicate(i,t)},i.prototype.getId=function(){return r(this,void 0,void 0,(function(){var t;return o(this,(function(e){switch(e.label){case 0:return[4,this.host()];case 1:return[4,e.sent().getAttribute("id")];case 2:return[2,""!==(t=e.sent())?t:null]}}))}))},i.prototype.getRole=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.host()];case 1:return[2,t.sent().getAttribute("role")]}}))}))},i.prototype.getAriaLabel=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.host()];case 1:return[2,t.sent().getAttribute("aria-label")]}}))}))},i.prototype.getAriaLabelledby=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.host()];case 1:return[2,t.sent().getAttribute("aria-labelledby")]}}))}))},i.prototype.getAriaDescribedby=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.host()];case 1:return[2,t.sent().getAttribute("aria-describedby")]}}))}))},i.prototype.close=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.host()];case 1:return[4,t.sent().sendKeys(e.TestKey.ESCAPE)];case 2:return t.sent(),[2]}}))}))},i}(e.ContentContainerComponentHarness);i.hostSelector=".mat-dialog-container",
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
t.MatDialogHarness=i,Object.defineProperty(t,"__esModule",{value:!0})}));