const CustomLogin: React.FC = (props) => {
  // console.log(props)
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [role, setRole] = useState('')
  // const [roles, setRoles] = useState<any[]>([{ label: 'yey', id: 'yey' }])
  // const [error, setError] = useState('')
  // const history = useHistory()
  // const { setToken } = useAuth()

  // useEffect(() => {
  //   // Fetch roles from your API
  //   // fetch('/api/roles?limit=100')
  //   //   .then((res) => res.json())
  //   //   .then((data) => setRoles(data.docs))
  // }, [])

  const handleLogin = async (e: any) => {
    // e.preventDefault()
    // const res = await fetch('/api/users/login-with-role', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, password, roleId: role }),
    // })
    // const data = await res.jåson()
    // if (!res.ok) {
    //   setError(data?.message || 'Login failed')
    //   return
    // }
    // setToken(data.token)
    // history.push('/')
  }

  return (
    <>
      {/* <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={'email'}
        required
        // onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={'password'}
        required
        // onChange={(e) => setPassword(e.target.value)}
      />
      <select value={'role'} required>
        <option value="">Select Role</option>
        {[{ label: 'yey', id: 'yey' }].map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
      <button type="submit">Login</button> */}
    </>
  )
}

export default CustomLogin
