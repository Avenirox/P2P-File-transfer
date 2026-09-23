import { useEffect, useState } from 'react'
import { useLanguage } from './locales/LoginContext'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import './index.css'
import Send from './pages/Send'
import Router from './Router'

const ParameterNavigator = () => {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const hasRoom = params.has('room')

    return hasRoom
      ? <Navigate to={`/send${location.search}`} replace />
      : <Navigate to={`/home`} />
  }

function App() {
  const {t, setLanguage} = useLanguage()
  useEffect(() => {
    let metaDescElement: HTMLMetaElement | null = document.querySelector('meta[name="description"]')

    if (!metaDescElement) {
      metaDescElement = document.createElement('meta') as HTMLMetaElement
      metaDescElement.name = 'description'
      document.head.appendChild(metaDescElement)
    }

    metaDescElement.setAttribute('content', t('title.metaDesc'))
  }, [t])

  //changing lang automaticly
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.slice(0, 2)
      
      if (browserLang === 'pl') {
        setLanguage('pl')
      }
    }
  }, [])

  return (
    <>
      <Routes>
        <Route element={<Router />}>
          <Route path='/home' element={<Home />}/>
          <Route path='/send' element={<Send />}/>
          <Route path='*' element={<ParameterNavigator />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
