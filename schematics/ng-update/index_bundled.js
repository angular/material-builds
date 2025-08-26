"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/material/schematics/ng-update/data/attribute-selectors.js
var require_attribute_selectors = __commonJS({
  "src/material/schematics/ng-update/data/attribute-selectors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.attributeSelectors = void 0;
    exports2.attributeSelectors = {};
  }
});

// src/material/schematics/ng-update/data/class-names.js
var require_class_names = __commonJS({
  "src/material/schematics/ng-update/data/class-names.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.classNames = void 0;
    exports2.classNames = {};
  }
});

// src/material/schematics/ng-update/data/constructor-checks.js
var require_constructor_checks = __commonJS({
  "src/material/schematics/ng-update/data/constructor-checks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.constructorChecks = void 0;
    exports2.constructorChecks = {};
  }
});

// src/material/schematics/ng-update/data/css-selectors.js
var require_css_selectors = __commonJS({
  "src/material/schematics/ng-update/data/css-selectors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.cssSelectors = void 0;
    exports2.cssSelectors = {};
  }
});

// src/material/schematics/ng-update/data/css-tokens.js
var require_css_tokens = __commonJS({
  "src/material/schematics/ng-update/data/css-tokens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.cssTokens = void 0;
    exports2.cssTokens = {};
  }
});

// src/material/schematics/ng-update/data/element-selectors.js
var require_element_selectors = __commonJS({
  "src/material/schematics/ng-update/data/element-selectors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.elementSelectors = void 0;
    exports2.elementSelectors = {};
  }
});

// src/material/schematics/ng-update/data/input-names.js
var require_input_names = __commonJS({
  "src/material/schematics/ng-update/data/input-names.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.inputNames = void 0;
    exports2.inputNames = {};
  }
});

// src/material/schematics/ng-update/data/method-call-checks.js
var require_method_call_checks = __commonJS({
  "src/material/schematics/ng-update/data/method-call-checks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.methodCallChecks = void 0;
    exports2.methodCallChecks = {};
  }
});

// src/material/schematics/ng-update/data/output-names.js
var require_output_names = __commonJS({
  "src/material/schematics/ng-update/data/output-names.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.outputNames = void 0;
    exports2.outputNames = {};
  }
});

// src/material/schematics/ng-update/data/property-names.js
var require_property_names = __commonJS({
  "src/material/schematics/ng-update/data/property-names.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.propertyNames = void 0;
    exports2.propertyNames = {};
  }
});

// src/material/schematics/ng-update/data/symbol-removal.js
var require_symbol_removal = __commonJS({
  "src/material/schematics/ng-update/data/symbol-removal.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.symbolRemoval = void 0;
    exports2.symbolRemoval = {};
  }
});

// src/material/schematics/ng-update/data/index.js
var require_data = __commonJS({
  "src/material/schematics/ng-update/data/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_attribute_selectors(), exports2);
    __exportStar(require_class_names(), exports2);
    __exportStar(require_constructor_checks(), exports2);
    __exportStar(require_css_selectors(), exports2);
    __exportStar(require_css_tokens(), exports2);
    __exportStar(require_element_selectors(), exports2);
    __exportStar(require_input_names(), exports2);
    __exportStar(require_method_call_checks(), exports2);
    __exportStar(require_output_names(), exports2);
    __exportStar(require_property_names(), exports2);
    __exportStar(require_symbol_removal(), exports2);
  }
});

// src/material/schematics/ng-update/upgrade-data.js
var require_upgrade_data = __commonJS({
  "src/material/schematics/ng-update/upgrade-data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.materialUpgradeData = void 0;
    var data_1 = require_data();
    exports2.materialUpgradeData = {
      attributeSelectors: data_1.attributeSelectors,
      classNames: data_1.classNames,
      constructorChecks: data_1.constructorChecks,
      cssSelectors: data_1.cssSelectors,
      cssTokens: data_1.cssTokens,
      elementSelectors: data_1.elementSelectors,
      inputNames: data_1.inputNames,
      methodCallChecks: data_1.methodCallChecks,
      outputNames: data_1.outputNames,
      propertyNames: data_1.propertyNames,
      symbolRemoval: data_1.symbolRemoval
    };
  }
});

// src/material/schematics/ng-update/index.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToV21 = updateToV21;
var schematics_1 = require("@angular-devkit/schematics");
var schematics_2 = require("@angular/cdk/schematics");
var upgrade_data_1 = require_upgrade_data();
var materialMigrations = [];
function updateToV21() {
  return (0, schematics_1.chain)([
    (0, schematics_2.createMigrationSchematicRule)(schematics_2.TargetVersion.V21, materialMigrations, upgrade_data_1.materialUpgradeData)
  ]);
}
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
//# sourceMappingURL=index_bundled.js.map
