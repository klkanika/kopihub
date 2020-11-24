import { schema } from 'nexus'

schema.objectType({
  name: 'OTP',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.tel()
    t.model.message()
  },
})

