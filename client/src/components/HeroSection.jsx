import React from 'react'
import { assets } from '../assets/assets'
import deadpool9 from '../assets/deadpool9.jpg'
import deadpool from '../assets/deadpool.jpeg'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

        const navigate = useNavigate()

    return (
        <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen'
            style={{ backgroundImage: `url(${deadpool9})` }}>

        <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20"/>

        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
            Deadpool <br/> & Wolverine
        </h1>

        <div className='flex items-center gap-4 text-gray-300'>
            <span>Action | Comedy | Sci-Fi</span>
            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/>2024
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/>2h 8m
            </div>
        </div>
            <p className='max-w-md text-gray-300'>
                Deadpool's peaceful existence comes crashing down when the Time Variance Authority recruits him to help 
                safeguard the multiverse. He soon unites with his would-be pal, Wolverine,
                 to complete the mission and save his world from an existential threat.         
          </p>
          <button onClick={()=> navigate('/movies')}className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
            Explore Movies
            <ArrowRight className="w-5 h-5"/>
          </button>
    </div>
  )
}

export default HeroSection
