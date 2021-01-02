require("dotenv").config();
import express from "express";
import { getOrders } from "./ocha-api";
import fetch from "node-fetch";
const { query } = require("./utils/database");

const { API, USER, PORT } = process.env;
const app = express();

app.post("/sync-order", async (req, res) => {
  const { token, cookie, last_update } = await getAuth();
  try {
    if (token && cookie) {
      const orders = await getOrders(token, cookie);
      await AddTask(orders);
      console.log("fetched");
    }
  } catch (ex) {
    console.log(ex);
  }

  res.send("ok");
});

app.listen(PORT || 5000, async () => {
  const { token, cookie, last_update } = await getAuth();
  console.log(`server started at http://localhost:${PORT || 5000}`);
  if (!token || !cookie) return;
  console.log("vvv");
  // const interval = 10
  // setInterval(async () => {
  //   const orders = await getOrders(token, cookie);
  //   await AddTask(orders);
  //   console.log("fetched")
  // }, interval * 1000)
});

const getAuth = async () => {
  const { rows } = await query("select * from auth where id = 1");
  console.log(rows[0]);
  return rows[0];
};

const AddTask = async (orders) => {
  if (orders === []) return;

  const taskRes = await (
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: TASK_QUERY,
      }),
    })
  ).json();
  const tasks = taskRes.data.tasks.map((t) => `${t.serverId}`);

  orders
    .map((o) => {
      if (!o.tables) {
        return {
          serverId: `${o.cart.server_id}`,
          name: `รับที่ร้าน ${o.cart.name}`,
          total: o.items
            .filter((i) => i.category_name === "ติ่มซำ")
            .reduce((acc, i) => i.quantity + acc, 0),
        };
      }

      return {
        serverId: `${o.cart.server_id}`,
        name: `${o.tables?.[0].area_name} ${o.tables?.[0].table_name}`,
        total: o.items
          .filter((i) => i.category_name === "ติ่มซำ")
          .reduce((acc, i) => i.quantity + acc, 0),
      };
    })
    .filter((o) => o.total > 0)
    .filter((o) => !tasks.includes(o.serverId))
    .forEach(async (order) => {
      const { serverId, total, name } = order;
      console.log("before created: ", serverId, total, name);
      const res = await (
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: TASK_CREATE,
            variables: {
              name: name,
              total: total,
              finishTime: new Date(),
              countTime: 0,
              userId: USER,
              serverId: serverId,
            },
          }),
        })
      ).json();
      console.log("created: ", JSON.stringify(res));
    });
};

const TASK_QUERY = `
{
  tasks(where: {NOT : [{status:CANCELED}, {status:COMPLETED}]}){
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
