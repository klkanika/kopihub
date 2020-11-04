import { schema } from 'nexus'
import { PrismaClient } from "@prisma/client"
import moment from "moment"
import 'moment/locale/th'
import { arg, core, stringArg } from 'nexus/components/schema';

const prisma = new PrismaClient();

moment.locale("th");

const dateTimeArg = (opts: core.NexusArgConfig<"DateTime">) =>
  arg({ ...opts, type: "DateTime" });

export const getQueuesRow = schema.objectType({
  name: "getQueuesRow",
  definition(t) {
    t.int("id"),
      t.date("createdAt"),
      t.string("queueNo"),
      t.string("status"),
      t.boolean("ordered"),
      t.string("userId"),
      t.string("name"),
      t.int("seat")
      t.string("pictureUrl")
  },
});

export const getQueuesArgs = schema.objectType({
  name: "getQueuesArgs",
  definition(t) {
    t.field("recentQueue", { type: "Queue" });
    t.list.field("activeQueues", { type: "getQueuesRow" });
  },
});

schema.queryType({
  definition(t) {
    t.crud.users({ filtering: true })
    t.crud.tasks({ filtering: true, ordering: true })
    t.crud.steamers({ filtering: true, ordering: true })
    t.crud.queues({ filtering: true, ordering: true, pagination: true })

    t.field("getQueues", {
      type: "getQueuesArgs",
      resolve: async (_, args, ctx) => {
        const recentQueue = await prisma.queue.findMany({
          where: {
            status: 'SUCCESS',
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
              }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          },
        })

        const activeQueues = await prisma.queue.findMany({
          where: {
            status: 'ACTIVE',
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
              }
            ]
          },
          orderBy: {
            createdAt: 'asc'
          }
        });

        return {
          recentQueue: recentQueue && recentQueue.length > 0 ? recentQueue[0] : null,
          activeQueues: activeQueues && activeQueues.length > 0 ? activeQueues : null,
        }
      },
    });

    t.field("getMyQueue", {
      type: "Boolean",
      args: {
        userId: stringArg({ required: true })
      },
      resolve: async (_, args, ctx) => {
        const myQueue = await prisma.queue.findMany({
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
            userId: { equals: args.userId }
          }
        })
        return myQueue && myQueue.length > 0 ? true : false
      },
    });
  },
})
