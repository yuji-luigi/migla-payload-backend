import { LogoRectangle } from '../../_components/logo/logo_rectandle/LogoRectangle'

const LoginHeaderBar = () => {
  return (
    <header className="header">
      <div className="flex flex-row justify-between items-center">
        <LogoRectangle />
        <select>
          <option value="1">日本語</option>
          <option value="2">English</option>
        </select>
      </div>
    </header>
  )
}

export default LoginHeaderBar
