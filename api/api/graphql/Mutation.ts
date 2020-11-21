import { schema } from 'nexus'
import { intArg, stringArg, arg, core, booleanArg } from '@nexus/schema'
// import { compare, hash } from 'bcryptjs'
import { compare, hash } from 'bcrypt'
// import { io } from '../app'
import moment from "moment"
import 'moment/locale/th'

moment.locale("th");

const line = require("@line/bot-sdk");

const client = new line.Client({
  channelAccessToken: '4kuOFDDMvTDhPcv5wyYekEs7TS5xXphUooS4L43vHAOGGW8QxuQOCez6gnBIAprscTjKIERPiRxLuke6tTaQ0ZE9ibd8EgPjxR/9nIR91FwjGFG6JxWD5E8y2xrtcH0zZ4ShbwGORKxWk0Ae6cZNWQdB04t89/1O/w1cDnyilFU=',
});

const sendMessageToClient = (toUser: String, message: any) => {
  return client
    .pushMessage(toUser, message)
    .then(() => {
      console.log("pushMessage success!");
      return true;
    })
    .catch(() => {
      console.log("pushMessage error!");
      return false;
    });
};

const dateTimeArg = (
  opts: core.NexusArgConfig<'DateTime'>
) => arg({ ...opts, type: "DateTime" })

schema.mutationType({
  definition(t) {
    t.crud.createOneUser(),
      t.crud.createOneLogUser(),
      t.crud.createOneTask(),
      t.crud.updateOneUser(),
      t.crud.updateOneLogUser(),
      t.crud.updateOneTask(),
      t.crud.createOneSteamer(),
      t.crud.updateOneSteamer(),
      t.crud.createOneNotification(),
      t.crud.createOneNotificationLog(),
      t.crud.createOneEmployee(),
      t.crud.updateOneEmployee(),
      t.crud.createOnePayroll(),

      t.field('createUser', {
        type: 'User',
        args: {
          name: stringArg({ nullable: false }),
          userName: stringArg({ nullable: false }),
          password: stringArg({ nullable: false }),
        },
        nullable: true,
        resolve: async (_parent, { name, userName, password }, ctx) => {
          const hashedPassword = await hash(password, 10)
          return ctx.db.user.create({
            data: {
              name: name,
              userName: userName,
              password: hashedPassword,
              enableStatus: "SHOW"
            },
          })
        },
      })

    t.field('login', {
      type: 'LogUser',
      args: {
        userName: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { userName, password }, ctx) => {
        const user = await ctx.db.user.findOne({
          where: {
            userName,
          },
        })
        if (!user) {
          throw new Error(`No user found: ${userName}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        // io.emit('hello','hello');
        return ctx.db.logUser.create({
          data: {
            role: 'NONE',
            user: { connect: { id: user.id } }
          },
        })
      },
    })

    t.field('createTask', {
      type: 'Task',
      args: {
        name: stringArg({ nullable: false }),
        total: intArg({ nullable: false }),
        finishTime: dateTimeArg({ type: 'DateTime' }),
        countTime: intArg({ nullable: false }),
        userId: stringArg({ nullable: false }),
        serverId: stringArg()
      },
      nullable: true,
      resolve: async (_parent, { name, total, finishTime, countTime, userId, serverId }, ctx) => {

        const count = await ctx.db.task.count()
        return ctx.db.task.create({
          data: {
            countTime: countTime,
            finishTime: finishTime,
            name: name,
            priority: count + 1,
            status: 'PENDING',
            total: total,
            updatedBy: userId,
            user: { connect: { id: userId } },
            serverId: serverId
          },
        }).finally(
          () => {
            // io.emit('taskUpdate','update')
            // io.emit('pendingTaskUpdate','update')
          }

        )
      },
    })

    t.field('updateTaskOngoing', {
      type: 'Task',
      args: {
        finishTime: dateTimeArg({ type: 'DateTime' }),
        countTime: intArg({ nullable: false }),
        taskId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { finishTime, countTime, taskId }, ctx) => {

        return ctx.db.task.update({
          where: {
            id: taskId
          },
          data: {
            countTime: countTime,
            finishTime: finishTime,
            status: 'ONGOING',
            priority: 0
          },
        }).finally(
          () => {
            // io.emit('taskUpdate','update')
            // io.emit('pendingTaskUpdate','update')
          }
        )
      },
    })

    t.field('updateTaskTimeup', {
      type: 'Task',
      args: {
        taskId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId }, ctx) => {

        return ctx.db.task.update({
          where: {
            id: taskId
          },
          data: {
            status: 'TIMEUP'
          },
        }).finally(
          // () => io.emit('taskUpdate','update')
        )
      },
    })

    t.field('updateTaskComplete', {
      type: 'Task',
      args: {
        taskId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId }, ctx) => {

        return ctx.db.task.update({
          where: {
            id: taskId
          },
          data: {
            status: 'COMPLETED'
          },
        }).finally(
          // () => io.emit('taskUpdate','update')
        )
      },
    })

    t.field('updateTaskCancel', {
      type: 'Task',
      args: {
        taskId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId }, ctx) => {

        return ctx.db.task.update({
          where: {
            id: taskId
          },
          data: {
            status: 'CANCELED'
          },
        }).finally(
          () => {
            // io.emit('taskUpdate','update')
            // io.emit('pendingTaskUpdate','update')
          }
        )
      },
    })

    t.field('UpdateEditTask', {
      type: 'Task',
      args: {
        taskId: stringArg({ nullable: false }),
        name: stringArg({ nullable: false }),
        total: intArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId, name, total }, ctx) => {

        return ctx.db.task.update({
          where: {
            id: taskId
          },
          data: {
            name: name,
            total: total
          },
        }).finally(
          () => {
            // io.emit('taskUpdate','update')
            // io.emit('pendingTaskUpdate','update')
          }
        )
      },
    })

    t.field('updateTaskPriority', {
      type: 'Task',
      args: {
        taskId: stringArg({ nullable: false }),
        priority: intArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId, priority }, ctx) => {

        return ctx.db.task.update({
          where: {
            id: taskId
          },
          data: {
            priority: priority
          },
        }).finally(
          // () => io.emit('taskUpdate','update')
        )
      },
    })

    t.field('updateSteamerComplete', {
      type: "Boolean",
      args: {
        taskId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId }, ctx) => {
        const steamer = await ctx.db.steamer.findMany({
          where: {
            taskId: taskId
          }
        })

        if (steamer) {
          for (let stm of steamer) {
            await ctx.db.steamer.update({
              data: {
                Task: { disconnect: true }
              },
              where: {
                id: stm.id
              }
            })
          }
        }
        return true;
      },
    })

    t.field('cancelQueue', {
      type: 'Boolean',
      args: {
        id: intArg({ required: true }),
      },
      resolve: async (_parent, { id }, ctx) => {
        const updateCancelQueue = await ctx.db.queue.updateMany({
          where: {
            id: id,
            status: 'ACTIVE'
          },
          data: {
            status: 'CANCELLED'
          },
        })

        return updateCancelQueue ? true : false
      },
    })

    t.field('fetchQueue', {
      type: 'Boolean',
      args: {
        id: intArg({ required: true }),
        tableId: intArg({ required: false })
      },
      resolve: async (_parent, { id, tableId }, ctx) => {
        if (id && tableId) {
          const updateFetchQueue = await ctx.db.queue.update({
            where: {
              id: id,
            },
            data: {
              status: 'SUCCESS',
              table: {
                connect: {
                  id: tableId,
                },
              },
            },
          })


          if (updateFetchQueue && updateFetchQueue.userId) {
            await sendMessageToClient(updateFetchQueue.userId, {
              type: "text",
              text: `ขอบคุณสำหรับการรอค่ะ คุณ${updateFetchQueue.name ? updateFetchQueue.name : 'ลูกค้า'} ถึงคิว ${updateFetchQueue.queueNo} ของคุณแล้ว กรุณาแจ้งพนักงาน`,
            });
          }

          return updateFetchQueue ? true : false
        }else{
          return false
        }
      },
    })

    t.field('orderFood', {
      type: 'Boolean',
      args: {
        id: intArg({ required: true }),
      },
      resolve: async (_parent, { id }, ctx) => {
        const updateOrderFood = await ctx.db.queue.update({
          where: {
            id: id
          },
          data: {
            ordered: true
          },
        })

        return updateOrderFood ? true : false
      },
    })

    t.field('bookQueue', {
      type: 'Boolean',
      args: {
        userId: stringArg({ required: false }),
        seat: intArg({ required: true }),
        name: stringArg({ required: false }),
        pictureUrl: stringArg({ required: false })
      },
      resolve: async (_parent, { userId, seat, name, pictureUrl }, ctx) => {
        let queueString = seat < 4 ? 'A' : seat < 7 ? 'B' : 'C'
        let maxQueueDigit = 3

        let myQueue
        if (userId) {
          myQueue = await ctx.db.queue.findMany({
            where: {
              AND: {
                OR: [
                  { status: 'ACTIVE' },
                  {
                    AND: {
                      status: 'SUCCESS',
                      createdAt: {
                        gte: moment().utcOffset(7).subtract(1, "hour").toDate()
                      }
                    }
                  }
                ]
              },
              userId: { equals: userId }
            }
          })
        }

        let createBookQueue
        if (myQueue && myQueue.length > 0) { } else {
          const queues = await ctx.db.queue.findMany({
            where: {
              AND: [
                {
                  createdAt: {
                    gt: moment().utcOffset(7).startOf('day').toDate()
                  }
                },
                {
                  createdAt: {
                    lt: moment().utcOffset(7).endOf('day').toDate()
                  }
                },
                {
                  queueNo: {
                    startsWith: queueString
                  }
                },
                {
                  status: {
                    equals: 'ACTIVE'
                  }
                }
              ]
            }
          })

          const lastQueues = await ctx.db.queue.findMany({
            where: {
              AND: [
                {
                  createdAt: {
                    gt: moment().utcOffset(7).startOf('day').toDate()
                  }
                },
                {
                  createdAt: {
                    lt: moment().utcOffset(7).endOf('day').toDate()
                  }
                },
                // {
                //   queueNo: {
                //     startsWith: queueString
                //   }
                // }
              ]
            },
            orderBy: {
              id: 'desc'
            }
          })

          let lastQueue
          if (lastQueues && lastQueues.length > 0) {
            lastQueue = lastQueues[0]
          }

          let queueNo
          if (lastQueue) {
            queueNo = parseInt(lastQueue.queueNo.substr(queueString.length)) + 1 + ''
          } else {
            queueNo = '1'
          }

          while (queueNo.length < maxQueueDigit) {
            queueNo = '0' + queueNo
          }

          queueNo = queueString + queueNo

          createBookQueue = await ctx.db.queue.create({
            data: {
              queueNo: queueNo,
              status: 'ACTIVE',
              ordered: false,
              userId: userId,
              seat: seat,
              name: name,
              pictureUrl: pictureUrl
            },
          })

          if (createBookQueue && userId) {
            await sendMessageToClient(userId, {
              type: "flex",
              altText: `คุณจองคิว ${createBookQueue.queueNo} สำหรับ ${createBookQueue.seat} คน`,
              contents: {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": `${createBookQueue.name ? `คุณ${createBookQueue.name}` : 'คุณลูกค้า'}`,
                      "weight": "bold",
                      "size": "xxl",
                      "margin": "md",
                      "color": "#683830"
                    },
                    {
                      "type": "text",
                      "text": `จำนวน ${createBookQueue.seat} ท่าน`,
                      "color": "#585568",
                      "wrap": true,
                      "margin": "6px",
                      "size": "md"
                    },
                    {
                      "type": "separator",
                      "margin": "xxl"
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "margin": "xxl",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "รออีก (คิว)",
                              "size": "md",
                              "color": "#585568",
                              "align": "center",
                              "offsetEnd": "none"
                            },
                            {
                              "type": "text",
                              "text": `${queues.length + 1}`,
                              "size": "4xl",
                              "color": "#683830",
                              "align": "center"
                            }
                          ]
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "หมายเลขคิว",
                              "size": "md",
                              "color": "#585568",
                              "align": "center"
                            },
                            {
                              "type": "text",
                              "text": `${createBookQueue.queueNo}`,
                              "size": "4xl",
                              "color": "#683830",
                              "align": "center"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "baseline",
                          "contents": [
                            {
                              "type": "filler"
                            },
                            {
                              "type": "text",
                              "color": "#ffffff",
                              "flex": 0,
                              "text": "ดูคิวของคุณ"
                            },
                            {
                              "type": "filler"
                            }
                          ],
                          "backgroundColor": "#683830",
                          "cornerRadius": "4px",
                          "spacing": "md",
                          "paddingAll": "16px",
                          "action": {
                            "type": "uri",
                            "label": "action",
                            "uri": "https://liff.line.me/1655216608-Gl3yPZWv/customerqueue"
                          }
                        }
                      ],
                      "alignItems": "center",
                      "margin": "lg"
                    },
                    {
                      "type": "separator",
                      "margin": "xxl"
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ยกเลิกคิว",
                          "color": "#FD0F0F",
                          "flex": 0,
                          "size": "md",
                          "action": {
                            "type": "uri",
                            "label": "action",
                            "uri": `https://liff.line.me/1655216608-Gl3yPZWv/cancelqueue&id=${createBookQueue.id}`
                          }
                        }
                      ],
                      "justifyContent": "center",
                      "margin": "xl"
                    }
                  ],
                  "position": "relative"
                },
                "styles": {
                  "footer": {
                    "separator": true
                  }
                }
              }
            });
          }
        }

        return createBookQueue ? true : false
      },
    })
  },
})



