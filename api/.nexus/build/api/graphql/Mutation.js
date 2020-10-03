"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
const schema_1 = require("@nexus/schema");
// import { compare, hash } from 'bcryptjs'
const bcrypt_1 = require("bcrypt");
const app_1 = require("../app");
const dateTimeArg = (opts) => schema_1.arg({ ...opts, type: "DateTime" });
nexus_1.schema.mutationType({
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
                    name: schema_1.stringArg({ nullable: false }),
                    userName: schema_1.stringArg({ nullable: false }),
                    password: schema_1.stringArg({ nullable: false }),
                },
                nullable: true,
                resolve: async (_parent, { name, userName, password }, ctx) => {
                    const hashedPassword = await bcrypt_1.hash(password, 10);
                    return ctx.db.user.create({
                        data: {
                            name: name,
                            userName: userName,
                            password: hashedPassword,
                            enableStatus: "SHOW"
                        },
                    });
                },
            });
        t.field('login', {
            type: 'LogUser',
            args: {
                userName: schema_1.stringArg({ nullable: false }),
                password: schema_1.stringArg({ nullable: false }),
            },
            nullable: true,
            resolve: async (_parent, { userName, password }, ctx) => {
                const user = await ctx.db.user.findOne({
                    where: {
                        userName,
                    },
                });
                if (!user) {
                    throw new Error(`No user found: ${userName}`);
                }
                const passwordValid = await bcrypt_1.compare(password, user.password);
                if (!passwordValid) {
                    throw new Error('Invalid password');
                }
                app_1.io.emit('hello', 'hello');
                return ctx.db.logUser.create({
                    data: {
                        role: 'NONE',
                        user: { connect: { id: user.id } }
                    },
                });
            },
        });
        t.field('createTask', {
            type: 'Task',
            args: {
                name: schema_1.stringArg({ nullable: false }),
                total: schema_1.intArg({ nullable: false }),
                finishTime: dateTimeArg({ type: 'DateTime' }),
                countTime: schema_1.intArg({ nullable: false }),
                userId: schema_1.stringArg({ nullable: false }),
            },
            nullable: true,
            resolve: async (_parent, { name, total, finishTime, countTime, userId }, ctx) => {
                const count = await ctx.db.task.count();
                return ctx.db.task.create({
                    data: {
                        countTime: countTime,
                        finishTime: finishTime,
                        name: name,
                        priority: count + 1,
                        status: 'PENDING',
                        total: total,
                        updatedBy: userId,
                        user: { connect: { id: userId } }
                    },
                }).finally(() => {
                    app_1.io.emit('taskUpdate', 'update');
                    app_1.io.emit('pendingTaskUpdate', 'update');
                });
            },
        });
        t.field('updateTaskOngoing', {
            type: 'Task',
            args: {
                finishTime: dateTimeArg({ type: 'DateTime' }),
                countTime: schema_1.intArg({ nullable: false }),
                taskId: schema_1.stringArg({ nullable: false }),
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
                }).finally(() => {
                    app_1.io.emit('taskUpdate', 'update');
                    app_1.io.emit('pendingTaskUpdate', 'update');
                });
            },
        });
        t.field('updateTaskTimeup', {
            type: 'Task',
            args: {
                taskId: schema_1.stringArg({ nullable: false }),
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
                }).finally(() => app_1.io.emit('taskUpdate', 'update'));
            },
        });
        t.field('updateTaskComplete', {
            type: 'Task',
            args: {
                taskId: schema_1.stringArg({ nullable: false }),
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
                }).finally(() => app_1.io.emit('taskUpdate', 'update'));
            },
        });
        t.field('updateTaskCancel', {
            type: 'Task',
            args: {
                taskId: schema_1.stringArg({ nullable: false }),
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
                }).finally(() => {
                    app_1.io.emit('taskUpdate', 'update');
                    app_1.io.emit('pendingTaskUpdate', 'update');
                });
            },
        });
        t.field('updateTaskPriority', {
            type: 'Task',
            args: {
                taskId: schema_1.stringArg({ nullable: false }),
                priority: schema_1.intArg({ nullable: false }),
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
                }).finally(() => app_1.io.emit('taskUpdate', 'update'));
            },
        });
    },
});
