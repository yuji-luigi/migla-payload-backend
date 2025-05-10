import { SelectField } from '@payloadcms/ui'
import { SelectFieldServerComponent } from 'payload'

const CustomSelectFieldServer: SelectFieldServerComponent = async ({
  clientField,
  path,
  schemaPath,
  permissions,
  payload,
}) => {
  console.log('clientField', clientField)
  console.log('path', path)
  console.log('schemaPath', schemaPath)
  console.log('permissions', permissions)
  const users = await payload.find({
    collection: 'users',
  })
  console.log('users', users)
  const options = users.docs.map((user) => ({
    label: `${user.name} ${user.surname}`,
    value: user.id,
  }))
  console.log('options', options)
  return (
    <SelectField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
export default CustomSelectFieldServer
