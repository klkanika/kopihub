import { schema } from 'nexus'

schema.objectType({
  name: 'EmployeeWatcher',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updateAt()
    t.model.name()
    t.model.tel()
  },
})
