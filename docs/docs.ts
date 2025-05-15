import  payload  from 'payload'

const user = {id:'demo'}

const teacherPages = await payload.find({
  collection: 'teachers',// select by collection config
  where: { user: { equals: user.id } },// where clause for first query
  select: { // select to populate the fields. by default it will select all fields. then populate can select the fields to populate.
    name: true,
    classroom: true,
    user: true,
  },
  populate: { // as mentioned above, populate can select the fields to populate. Kind of overriding the select fields.
    users: { email: true, name: true },
  },
})

/** @link https://payloadcms.com/docs/queries/select#populate */
/** @link https://payloadcms.com/docs/local-api/overview#collection-find */