import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-center p-4 md:p-6 bg-neutral-950 text-white">
      © {currentYear} Trueself All rights reserved.
    </footer>
  )
}
