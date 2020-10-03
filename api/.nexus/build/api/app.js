"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const nexus_1 = require("nexus");
const nexus_plugin_prisma_1 = require("nexus-plugin-prisma");
const socket_io_1 = __importDefault(require("socket.io"));
exports.io = socket_io_1.default.listen(nexus_1.server.raw.http, {
    path: '/socket'
});
exports.io.on("connection", () => {
    console.log('Connected');
    // setTimeout(()=>{
    // console.log('Send Data To Client')
    exports.io.emit('broadCastMessege', "fromServerrr"); //ยิงงงงง
    exports.io.emit('dataUpdate', { x: 1, y: 2 });
    // io.emit('eventx',{})
    // io.emit('evnetY',[])
    // },2000)  
});
nexus_1.use(nexus_plugin_prisma_1.prisma({ features: { crud: true } }));
nexus_1.settings.change({
    schema: {
        connections: {
            foobar: {},
            toto: {},
        },
    },
    server: {
        cors: true,
        startMessage: (info) => {
            nexus_1.settings.original.server.startMessage(info);
            nexus_1.log.warn('piggy back message!');
        },
    },
});
