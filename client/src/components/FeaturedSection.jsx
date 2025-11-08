import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/Appcontext'
import Loading from './Loading'

const FeaturedSection = () => {
        const navigate = useNavigate()
        const { axios } = useAppContext()
        const [shows, setShows] = useState([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)

        const fetchActiveShows = async () => {
            try {
                setLoading(true); setError(null)
                const {data} = await axios.get('/api/show/all')
                if(data.success){
                    setShows(data.shows || [])
                } else {
                    setError(data.message || 'Failed to load shows')
                }
            } catch (e){
                setError('Network error')
            } finally {
                setLoading(false)
            }
        }

        useEffect(()=>{ fetchActiveShows() },[])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
       
        <div className='relative flex items-center justify-between pt-20 pb-10'>
            <BlurCircle top='0' right='-80px'/>
            <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
            <button onClick={()=> navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'>
                View All 
                <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/>
            </button>
        </div>
                {loading ? <Loading /> : error ? <p className='text-red-400 text-sm'>{error}</p> : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8'>
                        {shows.slice(0,4).map((movie)=> (
                            <MovieCard key={movie._id || movie.id} movie={movie} />
                        ))}
                        {shows.length === 0 && <p className='text-gray-400 text-sm'>No active shows.</p>}
                    </div>
                )}
        <div className='flex justify-center mt-20'>
            <button onClick={()=>{navigate('/movies'); scrollTo(0,0)}}className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md
            font-medium cursor-pointer'>show more</button>
        </div>
      
    </div>
  )
}

export default FeaturedSection
