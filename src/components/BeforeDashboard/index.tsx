// 'use client'
import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'
import { SeedButton } from './SeedButton'
import './index.scss'
import { Button, Card, MoreIcon, LinkIcon } from '@payloadcms/ui'
import { Icon, PiIcon, Plus, PlusIcon } from 'lucide-react' // If using lucide-react
import { Payload } from 'payload'
import { I18n } from '@payloadcms/translations'
import { Classroom, Teacher, TeachersSelect, User } from '../../payload-types'

const baseClass = 'before-dashboard'

const BeforeDashboard = async ({
  payload,
  user,
  req,
  i18,
  ...rest
}: {
  payload: Payload
  user: User
  i18n: I18n
  [key: string]: any
}) => {
  if (user.currentRole?.isTeacher) {
    const teacherPages = await payload.find({
      collection: 'teachers',
      where: { user: { equals: user.id } },
      select: {
        name: true,
        classroom: true,
        // user: true,
      },
      populate: {
        classrooms: { name: true },
      },
    })
    const teacher = teacherPages.docs[0]
    console.log(teacher)
    if (teacher && typeof teacher.classroom === 'object') {
      const classroomName =
        teacher.classroom?.name || "Admin must provide a classroom to your account's teacher"
      return (
        <>
          <h3 className="font-bold text-4xl pt-4">
            {teacher.name} {classroomName}
          </h3>
          {/* <pre>{JSON.stringify(teacher, null, 4)}</pre> */}
        </>
      )
    }
  }
  return null
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
