import { schema } from 'nexus'

schema.objectType({
  name: 'Table',
  definition(t) {
    t.model.id()
    t.model.ochaTableName()
    t.model.tableName()
  },
})
