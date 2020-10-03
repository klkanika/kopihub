import { schema } from 'nexus'

schema.objectType({
  name: 'LogUser',
  definition(t) {
    t.model.id()
    t.model.role()
    t.model.userId()
    t.model.createdAt()
  },
})
