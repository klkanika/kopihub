import { schema } from 'nexus'
import { intArg, stringArg, arg, core } from '@nexus/schema'
// import { compare, hash } from 'bcryptjs'
import { compare ,hash } from 'bcrypt'
// import { io } from '../app'

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
            name : name,
            userName : userName,
            password : hashedPassword,
            enableStatus : "SHOW"
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
            role : 'NONE',
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
        finishTime: dateTimeArg({type:'DateTime'}),
        countTime: intArg({ nullable: false }),
        userId : stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { name, total, finishTime, countTime, userId }, ctx) => {
        
        const count = await ctx.db.task.count()
        return ctx.db.task.create({
          data: {
            countTime : countTime,
            finishTime : finishTime,
            name : name,
            priority : count + 1,
            status : 'PENDING',
            total : total,
            updatedBy : userId,
            user: { connect: { id: userId } }
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
        finishTime: dateTimeArg({type:'DateTime'}),
        countTime: intArg({ nullable: false }),
        taskId : stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { finishTime, countTime, taskId }, ctx) => {
        
        return ctx.db.task.update({
          where: {
            id : taskId
          },
          data: {
            countTime : countTime,
            finishTime : finishTime,
            status : 'ONGOING',
            priority : 0
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
        taskId : stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId }, ctx) => {
        
        return ctx.db.task.update({
          where: {
            id : taskId
          },
          data: {
            status : 'TIMEUP'
          },
        }).finally(
          // () => io.emit('taskUpdate','update')
        )
      },
    })

    t.field('updateTaskComplete', {
      type: 'Task',
      args: {
        taskId : stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId }, ctx) => {
        
        return ctx.db.task.update({
          where: {
            id : taskId
          },
          data: {
            status : 'COMPLETED'
          },
        }).finally(
          // () => io.emit('taskUpdate','update')
        )
      },
    })

    t.field('updateTaskCancel', {
      type: 'Task',
      args: {
        taskId : stringArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId }, ctx) => {
        
        return ctx.db.task.update({
          where: {
            id : taskId
          },
          data: {
            status : 'CANCELED'
          },
        }).finally(
          () =>{
            // io.emit('taskUpdate','update')
            // io.emit('pendingTaskUpdate','update')
          } 
        )
      },
    })

    t.field('updateTaskPriority', {
      type: 'Task',
      args: {
        taskId : stringArg({ nullable: false }),
        priority : intArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_parent, { taskId, priority }, ctx) => {
        
        return ctx.db.task.update({
          where: {
            id : taskId
          },
          data: {
            priority : priority
          },
        }).finally(
          // () => io.emit('taskUpdate','update')
        )
      },
    })
  },
})



