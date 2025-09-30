import { Outlet } from 'react-router-dom'
import Navigation from './pages/Auth/Navigation.jsx'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './App.css'
import Footer from './pages/User/Footer.jsx'

function App() {

  return (
    <>
     
      <ToastContainer />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
  
    </>
  )
}

export default App
