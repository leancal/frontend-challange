import { useEffect, useState } from 'react'
import './Toast.css'

export default function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<{ msg: string }>).detail
      if (!detail?.msg) return
      setMsg(detail.msg)
      const t = setTimeout(() => setMsg(null), 1800)
      return () => clearTimeout(t)
    }
    window.addEventListener('toast', onToast as EventListener)
    return () => window.removeEventListener('toast', onToast as EventListener)
  }, [])

  if (!msg) return null
  return (
    <div className="toast">{msg}</div>
  )
}
