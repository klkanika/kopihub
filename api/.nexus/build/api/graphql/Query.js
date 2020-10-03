"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
nexus_1.schema.queryType({
    definition(t) {
        t.crud.users({ filtering: true });
        t.crud.tasks({ filtering: true, ordering: true });
    },
});
