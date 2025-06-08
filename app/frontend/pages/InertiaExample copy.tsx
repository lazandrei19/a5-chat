import { Head, router } from '@inertiajs/react'
import { useState, type FC } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"

interface Props {
  logged_in: boolean;
};

const InertiaExample: FC<Props> = ({ logged_in: loggedIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signup = () => {
    router.post('/users', {
      user: {
        email,
        password,
        password_confirmation: password
      }
    })
  }

  return (
    <>
      <Head title="Inertia + Vite Ruby + React Example" />

      <h1>Logged in: {loggedIn.toString()}</h1>

      <div>
        <Input value={email} type="email" required onChange={(ev) => setEmail(ev.target.value)} />
        <Input value={password} type="password" required onChange={(ev) => setPassword(ev.target.value)} />
        <Button onClick={signup}>Sign up</Button>
      </div>
    </>
  )
};

export default InertiaExample;
