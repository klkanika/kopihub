import { schema } from 'nexus'

schema.objectType({
  name: 'Steamer',
  definition(t) {
    t.model.id()
    t.model.steamerNo()
    t.model.machineNo()
    t.model.updatedAt()
    t.model.updatedBy()
    t.model.Task()
    t.model.taskId()
  },
})
