import { schema } from 'nexus'

schema.objectType({
  name: 'Payroll',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updateAt()
    t.model.employee()
    t.model.employeeId()
    t.model.payrollDate()
    t.model.paid()
  },
})
