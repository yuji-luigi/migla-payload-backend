import { DatabaseAdapter, Payload } from 'payload'
import { initFirebaseAdmin } from '../../firebase-config'

export const onInit = async (payload: Payload) => {
  await seed(payload).catch((error) => {
    console.log('seed error', error)
  })
  await localizeUserFullName(payload).catch((error) => {
    console.log('localizeUserFullName error', error)
  })
  initFirebaseAdmin()
}

export const seed = async (payload: Payload) => {
  // Get a local copy of Payload by passing your config
  try {
    await payload.create({
      collection: 'roles',

      data: {
        name: 'super_admin',
        slug: 'super_admin',
        canLoginAdmin: true,
        isSuperAdmin: true,
        isAdmin: false,
        label: 'スーパー管理者',
      },
      context: {
        isSeed: true,
      },
    })
    await payload.create({
      collection: 'roles',
      data: {
        name: 'admin',
        slug: 'admin',
        isAdmin: true,
        canLoginAdmin: true,
        label: '管理者',
      },
    })

    await payload.create({
      collection: 'roles',
      data: {
        name: 'teacher',
        slug: 'teacher',
        isTeacher: true,
        label: '先生',
      },
    })
    await payload.create({
      collection: 'roles',
      data: {
        name: 'parent',
        slug: 'parent',
        isParent: true,
        label: '保護者',
      },
    })
  } catch (error) {
    console.warn('seed.ts catch block')
    // console.warn('seeding roles catch block', error)
  }
}

const localizeUserFullName = async (payload: Payload) => {
  const users = await payload.find({
    collection: 'users',
  })

  for (const user of users.docs) {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        // nameLocalized: user.name,
        // surnameLocalized: user.surname,
      },
    })
  }
}

function makeDBExraQueries(db: DatabaseAdapter) {
  throw new Error('Function not implemented.')
}
// Call the function here to run your seed script
// await seed()
