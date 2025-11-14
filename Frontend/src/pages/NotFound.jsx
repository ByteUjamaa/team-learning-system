import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <section>
      <h1>404 — Not Found</h1>
      <p style={{color:'#6b7280'}}>We couldn't find that page. <Link to="/">Go home</Link></p>
    </section>
  )
}
