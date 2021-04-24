import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import Login from './Login'
import Dashboard from './Dashboard'

const code = new URLSearchParams(window.location.search).get('code')

const App = () => (
  code ? <Dashboard code={code}/> : <Login />
)

export default App
