"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
nexus_1.schema.objectType({
    name: 'Task',
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.countTime();
        t.model.finishTime();
        t.model.status();
        t.model.priority();
        t.model.total();
    },
});
// io.emit("data",{
//   x:'dd'
// })
