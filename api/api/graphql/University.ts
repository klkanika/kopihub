import { schema } from 'nexus'

schema.objectType({
    name: 'University',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updateAt()
        t.model.name()
        t.model.Employee()
    },
})
