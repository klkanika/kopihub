import { schema } from 'nexus'
// import { io } from '../app'

schema.objectType({
  name: 'TaskLog',
  definition(t) {
    t.model.id()
    t.model.taskId()
    t.model.status()
    t.model.updateStatus()
    t.model.createdBy()
  },
})