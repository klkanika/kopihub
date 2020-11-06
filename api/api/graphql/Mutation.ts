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
      },
      resolve: async (_parent, { id }, ctx) => {
        const updateFetchQueue = await ctx.db.queue.updateMany({
          where: {
            id: id,
            status: 'ACTIVE'
          },
          data: {
            status: 'SUCCESS'
          },
        })

        return updateFetchQueue ? true : false
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

        const myQueue = await ctx.db.queue.findMany({
          where: {
            AND: {
              OR: [
                { status: 'ACTIVE' },
                {
                  AND: {
                    status: 'SUCCESS',
                    createdAt: {
                      gte: moment().subtract(1, "hour").toDate()
                    }
                  }
                }
              ]
            },
            userId: { equals: userId }
          }
        })

        let createBookQueue
        if (myQueue && myQueue.length > 0) { } else {
          const lastQueues = await ctx.db.queue.findMany({
            where: {
              AND: [
                {
                  createdAt: {
                    gt: moment().startOf('day').toDate()
                  }
                },
                {
                  createdAt: {
                    lt: moment().endOf('day').toDate()
                  }
                },
                {
                  queueNo: {
                    startsWith: queueString
                  }
                }
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
            // liff#1
            // await sendMessageToClient(userId, {
            //   type: "text",
            //   text: `คิวของคุณคือ ${createBookQueue.queueNo}`,
            // });
          }
        }

        return createBookQueue ? true : false
      },
    })
  },
})



