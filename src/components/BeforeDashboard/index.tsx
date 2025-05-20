import { I18n } from '@payloadcms/translations'
import { Button, Card } from '@payloadcms/ui'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { Plus } from 'lucide-react' // If using lucide-react
import { AdminViewServerProps, Payload, ServerProps } from 'payload'
import React from 'react'
import { User } from '../../payload-types'
import { AdminBeforeDashboard } from './AdminBeforeDashboard'
import { SeedButton } from './SeedButton'
import { TeacherBeforeDashboard } from './TeacherBeforeDashboard'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard = async ({ payload, user, i18n, ...rest }: ServerProps) => {
  let components: React.ReactNode[] = []

  if (user?.currentRole?.isTeacher) {
    components.push(
      <TeacherBeforeDashboard key="teacher-dashboard" payload={payload} user={user} />,
    )
  }
  if (user?.currentRole?.isAdminLevel) {
    components.push(
      <AdminBeforeDashboard key="admin-dashboard" payload={payload} user={user} i18n={i18n} />,
    )
  }

  return <>{components.map((component) => component)}</>
  return (
    // <Card title="Welcome to your dashboard!"></Card>
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' with a few pages, posts, and projects to jump-start your new site, then '}
          <a href="/" target="_blank">
            visit your website
          </a>
          {' to see the results.'}
        </li>
        <li>
          If you created this repo using Payload Cloud, head over to GitHub and clone it to your
          local machine. It will be under the <i>GitHub Scope</i> that you selected when creating
          this project.
        </li>
        <li>
          {'Modify your '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            collections
          </a>
          {' and add more '}
          <a
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            fields
          </a>
          {' as needed. If you are new to Payload, we also recommend you check out the '}
          <a
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            Getting Started
          </a>
          {' docs.'}
        </li>
        <li>
          Commit and push your changes to the repository to trigger a redeployment of your project.
        </li>
      </ul>
      {'Pro Tip: This block is a '}
      <a
        href="https://payloadcms.com/docs/admin/custom-components/overview#base-component-overrides"
        rel="noopener noreferrer"
        target="_blank"
      >
        custom component
      </a>
      , you can remove it at any time by updating your <strong>payload.config</strong>.
      <Card
        title="Admin"
        href="/admin/login"
        actions={
          <Button
            el="a"
            url="/admin/login"
            buttonStyle="icon-label"
            iconStyle="with-border"
            icon={<Plus size={16} />}
          />
        }
      ></Card>
      <Plus size={16} />
    </div>
  )
}

export default BeforeDashboard
