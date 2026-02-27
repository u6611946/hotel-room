"use client"
import { useState } from "react"

export default function LoginForm() {
  const [email, setEmail] = useState("")

  const handleSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email })
    })
  }

  return (
    <div>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  )
}