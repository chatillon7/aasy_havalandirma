'use client'

import { logout } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function LogoutButton() {
  const [state, action, pending] = useActionState(logout, undefined)

  return (
    <form action={action} className="row g-3">
      <div className="col-md-12">
        <button disabled={pending} type="submit" className="btn btn-danger">
          Çıkış Yap
        </button>
      </div>
    </form>
  )
}
