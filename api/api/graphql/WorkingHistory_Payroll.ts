import { schema } from 'nexus'

schema.objectType({
  name: 'WorkingHistory_Payroll',
  definition(t) {
    t.model.workingHistoryId()
    t.model.WorkingHistory()
    t.model.payrollId()
    t.model.Payroll()
    t.model.employeeId()
    t.model.Employee()
    t.model.paid()
    t.model.allMoney()
  },
})
