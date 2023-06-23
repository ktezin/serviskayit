import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {
  const navigate = useNavigate()

  async function loginHandler(event) {
    event.preventDefault()
    
    await signInWithEmailAndPassword(auth, event.target.email.value, event.target.password.value)
      .then((userCredential) => {
        const user = userCredential.user
        navigate('/services')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

  return (
    <form className="login" onSubmit={loginHandler}>
      <div>
        <h4>ERCHIN</h4>
        <p>Servis Kayıt Sistemi</p>
      </div>
      <input type="text" name="email" placeholder="Kullanıcı" />
      <input type="password" name="password" placeholder="Şifre" />
      <button type="submit">Giriş</button>
    </form>
  )
}

export default Login
