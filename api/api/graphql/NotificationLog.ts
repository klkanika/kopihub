import { schema } from 'nexus'

schema.objectType({
  name: 'NotificationLog',
  definition(t) {
    t.model.id()
    t.model.notificationId()
    t.model.createdAt()
  },
})

