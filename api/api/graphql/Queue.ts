import { schema } from 'nexus'

schema.objectType({
  name: 'Queue',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updateAt()
    t.model.queueNo()
    t.model.status()
    t.model.ordered()
    t.model.userId()
    t.model.name()
    t.model.seat()
    t.model.pictureUrl()
    t.model.table()
  },
})
