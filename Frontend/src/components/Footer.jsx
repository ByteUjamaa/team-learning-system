import React from 'react'

export default function Footer(){
  return (
    <footer className="footer mt-auto py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Team Learning System | All rights reserved.
      </div>
    </footer>
  )
}