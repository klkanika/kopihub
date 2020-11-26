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
      t.crud.deleteOneNotification(),
      t.crud.createOneEmployee(),
      t.crud.updateOneEmployee(),
      t.crud.createOnePayroll(),
      t.crud.deleteOneWorkingHistory(),
      t.crud.updateOneWorkingHistory(),
      t.crud.createOneWorkingHistory(),
      t.crud.createOneTaskLog(),
      t.crud.createOneOTP(),

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

    t.field('createNotification', {
      type: 'Notification',
      args: {
        message: stringArg({ nullable: false }),
        hour: intArg({ nullable: false }),
        minute: intArg({ nullable: false }),
        token: stringArg({ nullable: false }),
        userId: stringArg({ nullable: false }),
        mon: booleanArg({ nullable: false }),
        tue: booleanArg({ nullable: false }),
        wed: booleanArg({ nullable: false }),
        thu: booleanArg({ nullable: false }),
        fri: booleanArg({ nullable: false }),
        sat: booleanArg({ nullable: false }),
        sun: booleanArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { message, hour, minute, token, userId, mon, tue, wed, thu, fri, sat, sun }, ctx) => {
        return ctx.db.notification.create({
          data: {
            message: message,
            hour: hour,
            minute: minute,
            token: token,
            mon: mon,
            tue: tue,
            wed: wed,
            thu: thu,
            fri: fri,
            sat: sat,
            sun: sun,
            user: { connect: { id: userId } },
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
        let priority = 0;
        if (serverId){
          priority = parseInt(serverId)
        }else {
          priority = await ctx.db.task.count()
        }
        return ctx.db.task.create({
          data: {
            countTime: countTime,
            finishTime: finishTime,
            name: name,
            priority: priority,
            status: 'PENDING',
            total: total,
            updatedBy: userId,
            user: { connect: { id: userId } },
            serverId: serverId
          },
        }).finally(
          () => {
            console.log("created ServerID" + serverId + ", time :" + new Date())
          }

        )
      },
    })

    t.field('updateTaskOngoing', {
      type: "Boolean",
      args: {
        finishTime: dateTimeArg({ type: 'DateTime' }),
        countTime: intArg({ nullable: false }),
        taskId: stringArg({ nullable: false }),
        userId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, args, ctx) => {
        let check = false
        const task = await ctx.db.task.findOne({
          where: {
            id : args.taskId
          }
        })

        if(task){
          console.log("task",task)
          if(task.status && (task.status == 'PENDING' || task.status == 'TIMEUP' || task.status == 'ONGOING')){
            console.log("task.status",task.status)
            const log = await ctx.db.taskLog.create({
              data: {
                status: 'PENDING',
                updateStatus: 'ONGOING',
                user: { connect: { id: args.userId } },
                task: { connect: { id: args.taskId } },
              },
            })

            const updateTask = await ctx.db.task.update({
              where: {
                id: args.taskId
              },
              data: {
                countTime: args.countTime,
                finishTime: args.finishTime,
                status: 'ONGOING',
                priority: 0
              },
            })

            check = updateTask ? true : false
            console.log("check",check)
          }
        }
        
        console.log("check",check)
        return check
      },
    })

    t.field('updateTaskTimeup', {
      type: 'Boolean',
      args: {
        taskId: stringArg({ nullable: false }),
        userId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, args, ctx) => {
        let check = false
        const task = await ctx.db.task.findOne({
          where: {
            id : args.taskId
          }
        })

        if(task){
          if(task.status && task.status == 'ONGOING'){
            const log = await ctx.db.taskLog.create({
              data: {
                status: 'ONGOING',
                updateStatus: 'TIMEUP',
                user: { connect: { id: args.userId } },
                task: { connect: { id: args.taskId } },
              },
            })

            const updateTask = await ctx.db.task.update({
              where: {
                id: args.taskId
              },
              data: {
                status: 'TIMEUP'
              },
            })
            
            check = updateTask ? true : false
          }
        }
        return check
      },
    })

    t.field('updateTaskComplete', {
      type: 'Boolean',
      args: {
        taskId: stringArg({ nullable: false }),
        userId: stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, args, ctx) => {
        let check = false
        const task = await ctx.db.task.findOne({
          where: {
            id : args.taskId
          }
        })

        if(task){
          if(task.status && task.status == 'TIMEUP'){
            const log = await ctx.db.taskLog.create({
              data: {
                status: 'TIMEUP',
                updateStatus: 'COMPLETED',
                user: { connect: { id: args.userId } },
                task: { connect: { id: args.taskId } },
              },
            })

            const updateTask = await ctx.db.task.update({
              where: {
                id: args.taskId
              },
              data: {
                status: 'COMPLETED'
              },
            })

            check = updateTask ? true : false
          }
        }

        return check
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

    t.field('updateNotification', {
      type: 'Notification',
      args: {
        id: stringArg({ nullable: false }),
        message: stringArg({ nullable: false }),
        hour: intArg({ nullable: false }),
        minute: intArg({ nullable: false }),
        token: stringArg({ nullable: false }),
        mon: booleanArg({ nullable: false }),
        tue: booleanArg({ nullable: false }),
        wed: booleanArg({ nullable: false }),
        thu: booleanArg({ nullable: false }),
        fri: booleanArg({ nullable: false }),
        sat: booleanArg({ nullable: false }),
        sun: booleanArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { id, message, hour, minute, token, mon, tue, wed, thu, fri, sat, sun }, ctx) => {

        return ctx.db.notification.update({
          where: {
            id: id
          },
          data: {
            message: message,
            hour: hour,
            minute: minute,
            token: token,
            mon: mon,
            tue: tue,
            wed: wed,
            thu: thu,
            fri: fri,
            sat: sat,
            sun: sun,
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
            }, include: {
              table: true
            }
          })


          if (updateFetchQueue && updateFetchQueue.userId) {
            await sendMessageToClient(updateFetchQueue.userId, {
              type: "text",
              text: `ขอบคุณสำหรับการรอค่ะ คุณ${updateFetchQueue.name ? updateFetchQueue.name : 'ลูกค้า'} ถึงคิว ${updateFetchQueue.queueNo} ของคุณแล้วที่โต๊ะ ${updateFetchQueue.table?.ochaTableName} กรุณาแจ้งพนักงาน`,
            });
          }

          return updateFetchQueue ? true : false
        } else {
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
            ordered: true,
            orderedAt: moment().utcOffset(7).toDate()
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



