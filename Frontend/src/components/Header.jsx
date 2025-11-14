import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="nav">
        <h2 style={{margin:0}}>Team Learning</h2>
        <nav style={{marginLeft:16}}>
          <Link to="/" className="link" style={{marginRight:12}}>Home</Link>
          <Link to="/teams" className="link" style={{marginRight:12}}>Teams</Link>
          <Link to="/about" className="link">About</Link>
        </nav>
      </div>
    </header>
  )
}
