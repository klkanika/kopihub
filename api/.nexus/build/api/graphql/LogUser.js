"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
nexus_1.schema.objectType({
    name: 'LogUser',
    definition(t) {
        t.model.id();
        t.model.role();
        t.model.userId();
        t.model.createdAt();
    },
});
