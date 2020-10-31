require('dotenv').config()
import express from "express";
import {getOrders} from './ocha-api'
import fetch from 'node-fetch'

const { AUTHEN, COOKIE, API } = process.env
const app = express();

app.listen(5000, () => {
  console.log(`server started at http://localhost:${5000}`);
  if (!AUTHEN || !COOKIE) return;

  const interval = 10
  setInterval(async () => {
    const orders = await getOrders(AUTHEN, COOKIE);
    console.log(orders);
    await AddTask(orders);
  }, interval * 1000)

});

const AddTask = async (orders) => {
  if(orders===[]) return;

  const tasks = await (await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: `
          {
            tasks{
              name
            }
          }
        `
    })
  })).json();
  console.log(JSON.stringify(tasks))

  return
  orders
    .forEach(async element => {
      const res = await (await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query:
            `
        mutation 
          createTask(
            $name: String!
            $total: Int!
            $finishTime: DateTime
            $countTime: Int!
            $userId: String!
          )
          {
            createTask(
              name: $name
              total: $total
              finishTime: $finishTime
              countTime: $countTime
              userId: $userId
            ){
              id
              name
              countTime
              finishTime
              status
              priority
              total
              updatedAt
            }
          }
        `,
          variables: {
            name: element.name,
            total: 2,
            finishTime: new Date(),
            countTime: 0,
            userId: "099f7b04-6487-4ec7-a585-73ccfdd9cefd"
          }

        })
      })).json();
      console.log(JSON.stringify(res))
    });
}