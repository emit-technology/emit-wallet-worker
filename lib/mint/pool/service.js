"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var servicePool_1=require("./servicePool"),types_1=require("../../types"),services=new Map;self.addEventListener("message",function(e){if(e&&e.data&&e.data.method){var t,s,a=e.data;if(a.method==types_1.Method.getEpochPollKeys){for(var r=services.entries(),o=r.next(),i=[];!o.done;){var d=o.value[1];d&&d.temp.state==types_1.MintState.running&&i.push(d.temp.taskId),o=r.next()}return a.result=i,void self.postMessage(a)}a.data&&(t=void 0,s=a.data,a.method==types_1.Method.powInit&&(s=a.data.accountScenes),services.has(s)?t=services.get(s):(t=new servicePool_1.default,services.set(s,t)),t.handle(e))}}),exports.default=services;