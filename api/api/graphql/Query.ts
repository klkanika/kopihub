import { schema } from 'nexus'

schema.queryType({
  definition(t) {
    t.crud.users({ filtering: true })
    t.crud.tasks({ filtering: true, ordering :true })
    t.crud.steamers({ filtering: true, ordering :true })
  },
})
