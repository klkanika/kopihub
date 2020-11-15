import { schema } from 'nexus'

schema.objectType({
  name: 'Employee',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updateAt()
    t.model.name()
    t.model.hiringType()
    t.model.earning()
    t.model.status()
  },
})
