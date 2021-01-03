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
      const tasks = await getTask();

      await AddTask(tasks, orders);
      await CancelTask(tasks, orders);

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

const AddTask = async (tasks, orders) => {
  if (orders === []) return;

  const serverIds = tasks.map((t) => `${t.serverId}`);

  orders
    .map((o) => {
      if (!o.tables) {
        return {
          serverId: `${o.cart.server_id}`,
          name: `สั่งกลับบ้าน ${o.cart.name}`,
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
    .filter((o) => !serverIds.includes(o.serverId))
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

const getTask = async () => {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(`get tasks from ${today} to ${new Date()}`);
  const taskRes = await (
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: TASK_QUERY,
        variables: { today },
      }),
    })
  ).json();
  const tasks = taskRes.data.tasks;
  return tasks;
};

const CancelTask = async (tasks, orders) => {
  const serverIds = orders.map((o) => `${o.cart.server_id}`);
  tasks
    .filter((t) => !serverIds.includes(t.serverId))
    .filter((t) => t.status === "PENDING")
    .forEach(async (t) => {
      console.log("to be cancel", t.id, t.serverId);
      const res = await (
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: TASK_CANCEL,
            variables: {
              taskId: t.id,
            },
          }),
        })
      ).json();
      console.log("cancelled", JSON.stringify(res));
    });
};

const TASK_QUERY = `
query tasks($today: DateTime!)
{
  tasks (where:{createdAt:{gte: $today}}){
    id
    name
    serverId
    status
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

const TASK_CANCEL = `
mutation updateTaskCancel($taskId: String!){
  updateTaskCancel(taskId: $taskId){
    id
    serverId
    name
  }
}
`;
