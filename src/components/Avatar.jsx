import React from 'react'

export default function Avatar({ publicId, alt, className = '' }) {
  const src = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.jpg`

  return (
    <img
      src={src}
      alt={alt}
      onError={e => {
        e.currentTarget.onerror = null
        e.currentTarget.src = '/fallback-avatar.png'
      }}
      className={`rounded-full object-cover ${className}`}
    />
  )
}

