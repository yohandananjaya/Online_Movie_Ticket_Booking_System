// Movies.jsx
import React, { useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/Appcontext'
import { useLocation, useNavigate } from 'react-router-dom'

const Favorite = () => {
  const {favoriteMovies, token, initialized} = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(()=>{
    if(initialized && !token){
      navigate('/login', { state:{ from: location.pathname }, replace:true })
    }
  },[initialized, token])

  if(!initialized){
    return <div className='pt-40 text-center text-sm text-gray-400'>Loading...</div>
  }
  if(!token){
    return null
  }
  return favoriteMovies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      <h1 className="text-lg font-medium my-4">Your Favorite Movies</h1>

      {/* Option A: responsive breakpoints */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {favoriteMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id || movie.id} />
        ))}
      </div>

      {/* Option B (alternative): auto-fit without breakpoints
      <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {favoriteMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id || movie.id} />
        ))}
      </div>
      */}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No movies available</h1>
    </div>
  )
   
    
  
}

export default Favorite