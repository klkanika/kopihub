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

export const getEmployeesEarningRow = schema.objectType({
  name: "getEmployeesEarningRow",
  definition(t) {
    t.string("id"),
      t.string("name"),
      t.float("remainingEarning")
  },
});

export const getEmployeesEarningArgs = schema.objectType({
  name: "getEmployeesEarningArgs",
  definition(t) {
    t.list.field("data", { type: "getEmployeesEarningRow" });
  },
});

export const getEmployeeHistoriesArgs = schema.objectType({
  name: "getEmployeeHistoriesArgs",
  definition(t) {
    t.list.field("payrolls", { type: "Payroll" });
    t.list.field("workingHistories", { type: "WorkingHistory" });
  }
});

export const getNotificationLogRow = schema.objectType({
  name: "getNotificationLogRow",
  definition(t) {
    t.string("id"),
      t.string("createdAt"),
      t.string("message")
  },
});

export const getNotificationLogArgs = schema.objectType({
  name: "getNotificationLogArgs",
  definition(t) {
    t.list.field("data", { type: "getNotificationLogRow" });
  },
});

schema.queryType({
  definition(t) {
    t.crud.users({ filtering: true })
    t.crud.tasks({ filtering: true, ordering: true })
    t.crud.steamers({ filtering: true, ordering: true })
    t.crud.queues({ filtering: true, ordering: true, pagination: true })
    t.crud.tables({ filtering: true, ordering: true, pagination: true })
    t.crud.employees({ filtering: true, ordering: true, pagination: true })
    t.crud.workingHistories({ filtering: true, ordering: true, pagination: true })
    t.crud.payrolls({ filtering: true, ordering: true, pagination: true })
    t.crud.notifications({ filtering: true })
    t.crud.notificationLogs({ filtering: true })
    t.crud.universities({ filtering: true, ordering: true, pagination: true })
    t.crud.faculties({ filtering: true, ordering: true, pagination: true })
    t.crud.employeeWatchers({ filtering: true, ordering: true, pagination: true })


    t.field("checkAdmin", {
      type: "User",
      args: {
        id: stringArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        const user = await prisma.user.findOne({
          where: {
            id: args.id,
          },
        });
        return user;
      },
    });

    t.field("getQueues", {
      type: "getQueuesArgs",
      resolve: async (_, args, ctx) => {
        const recentQueue = await prisma.queue.findMany({
          where: {
            status: 'SUCCESS',
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
              }
            ]
          },
          orderBy: {
            updateAt: 'desc'
          },
        })

        const activeQueues = await prisma.queue.findMany({
          where: {
            status: 'ACTIVE',
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
                      gte: moment().utcOffset(7).subtract(1, "hour").toDate()
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

    t.field("getEmployeesEarning", {
      type: "getEmployeesEarningArgs",
      resolve: async (_, args, ctx) => {
        const employees = await prisma.employee.findMany({
          where: {
            status: 'ACTIVE'
          }
        })

        let results: any = []

        for (let emp of employees) {
          const earning = await prisma.workingHistory.findMany({
            where: {
              employeeId: emp.id
            }
          })

          const paid = await prisma.payroll.findMany({
            where: {
              employeeId: emp.id
            }
          })

          let paidMoney = 0
          let earningMoney = 0

          for (let p of paid) {
            paidMoney += p.paid
          }

          for (let e of earning) {
            earningMoney += e.earning
          }

          results.push({
            ...emp,
            remainingEarning: earningMoney - paidMoney
          })
        }

        return {
          data: results
        }
      },
    });

    t.field("getEmployeeHistories", {
      type: "getEmployeeHistoriesArgs",
      args: {
        employeeId: stringArg({ required: true }),
        startDate: dateTimeArg({ type: "DateTime", required: false }),
        endDate: dateTimeArg({ type: "DateTime", required: false }),
      },
      resolve: async (_, args, ctx) => {
        let whereDate = {}
        if (args.startDate && args.endDate) {
          whereDate = {
            gte: moment(args.startDate).utcOffset(7).startOf('day').toDate(),
            lte: moment(args.endDate).utcOffset(7).endOf('day').toDate()
          }
        }

        const payrolls = await prisma.payroll.findMany({
          where: {
            employeeId: args.employeeId,
            payrollDate: whereDate
          },
          orderBy: {
            payrollDate: 'desc',
          },
        })

        const workingHistories = await prisma.workingHistory.findMany({
          where: {
            employeeId: args.employeeId,
            historyDate: whereDate
          },
          orderBy: {
            historyDate: 'desc'
          }
        })

        return {
          payrolls: payrolls,
          workingHistories: workingHistories
        }
      }
    });

    t.field("getAllNotifyLog", {
      type: "getNotificationLogArgs",
      args: {
      },
      resolve: async (_, args, ctx) => {

        const jobs: any = (
          await prisma.notificationLog.findMany({
            orderBy: [
              {
                createdAt: "desc",
              },
            ],
          })
        ).map(async (j) => {

          return {
            id: j.id,
            createdAt: `${moment(j.createdAt).add(543, 'years').format("DD MMM YYYY HH:mm")}`,
            message: j.message,
          };
        });

        return {
          data: jobs,
        };
      },
    });

    t.field("getNotificationById", {
      type: "Notification",
      args: {
        id: stringArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        const notification = await prisma.notification.findOne({
          where: {
            id: args.id,
          },
        });
        return notification;
      },
    });
  },
})
