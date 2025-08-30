import React from 'react'

function Footer() {
  return (
    <div>
      <footer className='footer-custom text-center'>
        <div className='container'>
          <p className='mb-2'>© {new Date().getFullYear()} OCP Products - Tous droits réservés.</p>
        </div>
      </footer>

    </div>
  )
}

export default Footer
