import { schema } from 'nexus'

schema.objectType({
  name: 'Notification',
  definition(t) {
    t.model.id()
    t.model.message()
    t.model.hour()
    t.model.minute()
    t.model.token()
    t.model.mon()
    t.model.tue()
    t.model.wed()
    t.model.thu()
    t.model.fri()
    t.model.sat()
    t.model.sun()
  },
})

