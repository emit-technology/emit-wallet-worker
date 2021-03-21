"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("../service");
var service = new service_1.default();
self.addEventListener('message', function (e) {
    service.handle(e);
});
exports.default = service;
//# sourceMappingURL=service.js.map