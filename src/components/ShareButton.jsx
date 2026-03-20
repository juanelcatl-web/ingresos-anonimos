// src/components/ShareButton.jsx
// Botón para compartir resultados por WhatsApp, Twitter y copiar link

import { useState } from 'react'

export default function ShareButton({ title, text, url }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || window.location.href

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`${text}\n\n${shareUrl}`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const shareTwitter = () => {
    const msg = encodeURIComponent(`${text} ${shareUrl}`)
    window.open(`https://twitter.com/intent/tweet?text=${msg}`, '_blank')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback para navegadores sin clipboard API
      const el = document.createElement('input')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Usar Web Share API si está disponible (mobile nativo)
  const canShare = !!navigator.share

  const shareNative = async () => {
    try {
      await navigator.share({ title, text, url: shareUrl })
    } catch { /* usuario canceló */ }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 font-medium">Compartir:</span>

      {/* WhatsApp */}
      <button
        onClick={canShare ? shareNative : shareWhatsApp}
        className="flex items-center gap-1.5 bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-[#25D366]/25 transition-all active:scale-95"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </button>

      {/* Twitter / X */}
      <button
        onClick={shareTwitter}
        className="flex items-center gap-1.5 bg-black/30 text-white/70 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-white/10 transition-all active:scale-95"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </button>

      {/* Copiar link */}
      <button
        onClick={copyLink}
        className={`flex items-center gap-1.5 border rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
          copied
            ? 'bg-brand-green/20 text-brand-green border-brand-green/40'
            : 'bg-dark-input text-white/50 border-dark-border hover:text-white hover:border-white/20'
        }`}
      >
        {copied ? '✓ Copiado' : '🔗 Link'}
      </button>
    </div>
  )
}
