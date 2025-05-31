import { getPayload } from 'payload'
import config from '@payload-config'

export const seedRoles = async () => {
  // Get a local copy of Payload by passing your config
  const payload = await getPayload({ config })

  const superAdmin = await payload.create({
    collection: 'roles',
    // locale: 'ja',
    // fallbackLocale: 'ja',
    data: {
      name: 'super_admin',
      slug: 'super_admin',
      label: 'スーパー管理者',
    },
  })

  await payload.create({
    collection: 'roles',
    // locale: 'ja',
    // fallbackLocale: 'ja',
    data: {
      name: 'admin',
      slug: 'admin',
      label: '管理者',
    },
  })
  await payload.create({
    collection: 'roles',
    // locale: 'ja',
    // fallbackLocale: 'ja',
    data: {
      name: 'teacher',
      slug: 'teacher',
      label: '先生',
    },
  })
  await payload.create({
    collection: 'roles',
    // locale: 'ja',
    // fallbackLocale: 'ja',
    data: {
      name: 'parent',
      slug: 'parent',
      label: '保護者',
    },
  })
}

// Call the function here to run your seed script
// await seed()
