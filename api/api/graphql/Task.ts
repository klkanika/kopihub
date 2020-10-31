import { schema } from 'nexus'
// import { io } from '../app'

schema.objectType({
  name: 'Task',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.countTime()
    t.model.finishTime()
    t.model.status()
    t.model.priority()
    t.model.total()
    t.model.updatedAt()
    t.model.serverId()
  },
})
// io.emit("data",{
//   x:'dd'
// })