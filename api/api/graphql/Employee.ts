import { schema } from 'nexus'

schema.objectType({
  name: 'Employee',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updateAt()
    t.model.name()
    t.model.fullName()
    t.model.tel()
    t.model.lineId()
    t.model.bank()
    t.model.bankAccount()
    t.model.hiringType()
    t.model.earning()
    t.model.status()
    t.model.WorkingHistory()
    t.model.Payroll()
    t.model.universityId()
    t.model.university()
    t.model.facultyId()
    t.model.faculty()
    t.model.profilePictureUrl()
    t.model.idCardPictureUrl()
    t.model.withdrawableMoney()
    t.model.withdrawnMoney()
  },
})
