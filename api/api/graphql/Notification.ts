import { schema } from 'nexus'

schema.objectType({
  name: 'Notification',
  definition(t) {
    t.model.id()
    t.model.message()
    t.model.hour()
    t.model.minute()
    t.model.token()
  },
})

