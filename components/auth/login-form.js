'use client'

import { login } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="p-4 rounded shadow bg-body" style={{minWidth:320, maxWidth:400, width:'100%'}}>
      {state?.errors?.global && <div className="alert alert-danger">{state.errors.global}</div>}

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input id="email" name="email" placeholder="Email" className="form-control" />
      </div>
      {state?.errors?.email && <div className="text-danger small mb-2">{state.errors.email}</div>}

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Şifre</label>
        <input id="password" name="password" type="password" autoComplete="current-password" className="form-control" />
      </div>
      {state?.errors?.password && <div className="text-danger small mb-2">{state.errors.password}</div>}
      <button disabled={pending} type="submit" className="btn btn-primary w-100">
        Giriş Yap
      </button>
    </form>
  )
}
