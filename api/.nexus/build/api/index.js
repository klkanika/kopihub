"use strict";
// GENERATED NEXUS START MODULE
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Run framework initialization side-effects
// Also, import the app for later use
const nexus_1 = __importDefault(require("nexus"));
// Last resort error handling
process.once('uncaughtException', error => {
    nexus_1.default.log.fatal('uncaughtException', { error: error });
    process.exit(1);
});
process.once('unhandledRejection', error => {
    nexus_1.default.log.fatal('unhandledRejection', { error: error });
    process.exit(1);
});
// Import the user's Nexus modules
require("./graphql/LogUser");
require("./graphql/Mutation");
require("./graphql/Query");
require("./graphql/Task");
require("./graphql/User");
// Import the user's app module
require("./app");
nexus_1.default.assemble();
nexus_1.default.start();
