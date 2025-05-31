import { getPayload, Payload } from 'payload'
import config from '@payload-config'

export const seedRoles = async (payload: Payload) => {
  // Get a local copy of Payload by passing your config
  try {
    // const superAdmin = await payload.create({
    //   collection: 'roles',
    //   // locale: 'ja',
    //   // fallbackLocale: 'ja',
    //   data: {
    //     name: 'super_admin',
    //     slug: 'super_admin',
    //     label: 'スーパー管理者',
    //   },
    // })

    await payload.update({
      collection: 'roles',
      where: {
        name: { equals: 'admin' },
      },
      // locale: 'ja',
      // fallbackLocale: 'ja',
      data: {
        name: 'admin',
        slug: 'admin',
        isAdminLevel: true,
        label: '管理者',
      },
    })
    await payload.update({
      collection: 'roles',
      where: {
        name: { equals: 'teacher' },
      },
      // locale: 'ja',
      // fallbackLocale: 'ja',
      data: {
        name: 'teacher',
        slug: 'teacher',
        isTeacher: true,
        label: '先生',
      },
    })
    await payload.update({
      collection: 'roles',
      // locale: 'ja',
      // fallbackLocale: 'ja',
      where: {
        name: { equals: 'parent' },
      },
      data: {
        name: 'parent',
        slug: 'parent',
        isParent: true,
        label: '保護者',
      },
    })
  } catch (error) {
    console.error(error)
  }
}

// Call the function here to run your seed script
// await seed()
