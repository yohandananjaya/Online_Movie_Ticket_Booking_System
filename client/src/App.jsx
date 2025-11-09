import React from 'react'
import Navbar from './components/Navbar'
import  Home  from './pages/Home'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Loading from './components/Loading'
import { useAppContext } from './context/Appcontext'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import Movies from './pages/Movies'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import Addshows from './pages/admin/Addshows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'
import Login from './components/Login'


const PrivateRoute = ({children}) => {
  const { token, initialized } = useAppContext()
  const location = useLocation()
  if(!initialized) return <Loading />
  if(!token) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

const App = () => {

  const isAsminRoute = useLocation().pathname.startsWith('/admin');

  return (
    <>
      <Toaster />
      {!isAsminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/login' element={<Login />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<PrivateRoute><SeatLayout /></PrivateRoute>} />
        <Route path='/my-bookings' element={<PrivateRoute><MyBookings /></PrivateRoute>} />
  <Route path='/favorite' element={<PrivateRoute><Favorite /></PrivateRoute>} />
        <Route path='/admin/*' element={<Layout/> }>
          <Route index element ={<Dashboard/>}/>
          <Route path="add-shows" element={<Addshows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="list-bookings" element={<ListBookings/>}/>

        </Route>
      </Routes>
      {!isAsminRoute && <Footer />}
    </>
  )
}

export default App
