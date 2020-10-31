"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const ocha_api_1 = require("./ocha-api");
const node_fetch_1 = __importDefault(require("node-fetch"));
const { AUTHEN, COOKIE, API, USER } = process.env;
const app = express_1.default();
app.listen(5000, () => {
    console.log(`server started at http://localhost:${5000}`);
    if (!AUTHEN || !COOKIE)
        return;
    const interval = 10;
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const orders = yield ocha_api_1.getOrders(AUTHEN, COOKIE);
        yield AddTask(orders);
        console.log("fetched");
    }), interval * 1000);
});
const AddTask = (orders) => __awaiter(void 0, void 0, void 0, function* () {
    if (orders === [])
        return;
    const taskRes = yield (yield node_fetch_1.default(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: TASK_QUERY
        })
    })).json();
    const tasks = taskRes.data.tasks.map((t) => `${t.serverId}`);
    orders
        .map((o) => {
        return {
            serverId: `${o.cart.server_id}`,
            name: `${o.tables[0].area_name} ${o.tables[0].table_name}`,
            total: o.items
                .filter((i) => i.category_name === "ติ่มซำ")
                .reduce((acc, i) => i.quantity + acc, 0)
        };
    })
        .filter(o => o.total > 0)
        .filter((o) => !tasks.includes(o.serverId))
        .forEach((order) => __awaiter(void 0, void 0, void 0, function* () {
        const { serverId, total, name } = order;
        const res = yield (yield node_fetch_1.default(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: TASK_CREATE,
                variables: {
                    name: name,
                    total: total,
                    finishTime: new Date(),
                    countTime: 0,
                    userId: USER,
                    serverId: serverId
                }
            })
        })).json();
        console.log("created: ", JSON.stringify(res));
    }));
});
const TASK_QUERY = `
{
  tasks{
    serverId
  }
}
`;
const TASK_CREATE = `
mutation 
  createTask(
    $name: String!
    $total: Int!
    $finishTime: DateTime
    $countTime: Int!
    $userId: String!
    $serverId: String
  )
  {
    createTask(
      name: $name
      total: $total
      finishTime: $finishTime
      countTime: $countTime
      userId: $userId
      serverId: $serverId
    ){
      id
      name
      countTime
      finishTime
      status
      priority
      total
      updatedAt
      serverId
    }
  }
`;
//# sourceMappingURL=index.js.map