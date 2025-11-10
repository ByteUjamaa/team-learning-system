import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Teams from './pages/Teams'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'


export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/profile" element={<Profile />} />

          </Routes>
           
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
