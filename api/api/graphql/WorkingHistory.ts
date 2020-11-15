import { schema } from 'nexus'

schema.objectType({
  name: 'WorkingHistory',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updateAt()
    t.model.employee()
    t.model.employeeId()
    t.model.historyDate()
    t.model.hours()
    t.model.hiringType()
    t.model.earningRate()
    t.model.earning()
  },
})
