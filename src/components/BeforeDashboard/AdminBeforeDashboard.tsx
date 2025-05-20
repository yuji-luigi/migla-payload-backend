import { ServerProps } from 'payload'

export const AdminBeforeDashboard = async (props: ServerProps) => {
  return (
    <div>
      <button className="btn btn--icon-style-without-border btn--size-large btn--withoutPopup btn--style-pill btn--withoutPopup text-5xl ">
        Import
      </button>
    </div>
  )
}
export default AdminBeforeDashboard
