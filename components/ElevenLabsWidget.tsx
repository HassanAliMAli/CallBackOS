'use client'

import { useEffect } from 'react'

export default function ElevenLabsWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://elevenlabs.io/convai-widget/index.js'
    script.async = true
    script.type = 'text/javascript'
    document.body.appendChild(script)

    script.onload = () => {
      const widget = document.createElement('elevenlabs-convai')
      widget.setAttribute('agent-id', 'agent_8701kn0wrgbcfnnvx34j0rdqc4xv')
      document.body.appendChild(widget)
    }

    return () => {
      const existing = document.querySelector('elevenlabs-convai')
      if (existing) existing.remove()
    }
  }, [])

  return null
}
