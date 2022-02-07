"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var servicePool_1 = require("./servicePool");
var types_1 = require("../../types");
var services = new Map();
self.addEventListener('message', function (e) {
    if (e && e.data && e.data.method) {
        var message = e.data;
        if (message.method == types_1.Method.getEpochPollKeys) {
            var entries = services.entries();
            var next = entries.next();
            var keys = [];
            while (!next.done) {
                var s = next.value[1];
                if (s && s.temp.state == types_1.MintState.running) {
                    keys.push(s.temp.taskId);
                }
                next = entries.next();
            }
            message.result = keys;
            // @ts-ignore
            self.postMessage(message);
            return;
        }
        if (message.data) {
            var service = void 0;
            var key = message.data;
            if (message.method == types_1.Method.powInit) {
                var mintData = message.data;
                key = mintData.accountScenes;
            }
            if (services.has(key)) {
                service = services.get(key);
            }
            else {
                service = new servicePool_1.default();
                services.set(key, service);
            }
            service.handle(e);
        }
    }
});
exports.default = services;
