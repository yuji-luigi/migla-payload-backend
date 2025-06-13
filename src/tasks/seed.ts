import { Payload } from 'payload'

export const onInit = async (payload: Payload) => {
  await seed(payload).catch((error) => {
    console.log('seed error', error)
  })
  await localizeUserFullName(payload).catch((error) => {
    console.log('localizeUserFullName error', error)
  })
  await localizeHero(payload).catch((error) => {
    console.log('localizeHero error', error)
  })
  // const user = await payload.create({
  //   collection: 'users',
  //   locale: 'ja',
  //   data: {
  //     name: 'テスト',
  //     surname: 'テスト姓',
  //     password: 'test777',
  //     email: 'hey@test.com',
  //   },
  // })
  // await payload.update({
  //   collection: 'users',
  //   id: user.id,
  //   locale: 'en',
  //   data: {
  //     name: 'test',
  //     surname: 'test surname',
  //   },
  // })
  // await payload.update({
  //   collection: 'users',
  //   id: user.id,
  //   locale: 'it',
  //   data: {
  //     name: 'prova',
  //     surname: 'prova cognome',
  //   },
  // })
}

export const seed = async (payload: Payload) => {
  // Get a local copy of Payload by passing your config
  try {
    await payload.create({
      collection: 'roles',
      // where: {
      //   name: { equals: 'admin' },
      // },
      // locale: 'ja',
      // fallbackLocale: 'ja',
      data: {
        name: 'super_admin',
        slug: 'super_admin',
        canLoginAdmin: true,
        isSuperAdmin: true,
        isAdminLevel: true,
        label: 'スーパー管理者',
      },
      context: {
        isSeed: true,
      },
    })
    await payload.create({
      collection: 'roles',
      // where: {
      //   name: { equals: 'admin' },
      // },
      // locale: 'ja',
      // fallbackLocale: 'ja',
      data: {
        name: 'admin',
        slug: 'admin',
        isAdminLevel: true,
        canLoginAdmin: true,
        label: '管理者',
      },
    })

    await payload.create({
      collection: 'roles',
      // where: {
      //   name: { equals: 'teacher' },
      // },
      // locale: 'ja',
      // fallbackLocale: 'ja',
      data: {
        name: 'teacher',
        slug: 'teacher',
        isTeacher: true,
        label: '先生',
      },
    })
    await payload.create({
      collection: 'roles',
      // locale: 'ja',
      // fallbackLocale: 'ja',
      // where: {
      //   name: { equals: 'parent' },
      // },
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

// Call the function here to run your seed script
// await seed()

async function localizeHero(payload: Payload) {
  const pages = await payload.find({
    collection: 'pages',
  })

  for (const page of pages.docs) {
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        heroLocalized: page.hero,
      },
    })
  }
}
