import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';

const Dashboard = () => {

  const currency = import.meta.env.VITE_CURRENCY 
  
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalShows: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(false);

  const dashboardCards = [
    {title: "Total Bookings", value: dashboardData.totalBookings || "0", icon:ChartLineIcon },
    {title: "Total Revenue", value: (currency + dashboardData.totalRevenue )|| "0", icon:CircleDollarSignIcon},
    {title: "Active Shows", value: dashboardData.activeShows.length || "0", icon:PlayCircleIcon},
    {title: "Total Users", value: dashboardData.totalUsers || "0", icon:UserIcon}
  ] 

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData)
    setLoading(false)
  };
   useEffect(() => {
    fetchDashboardData();
   }, []);

  return !loading ?(
    <>
      <Title text1="Admin" text2="Dashboard"/>
      <div className='relative flex flex-wrap gap-4 mt-6'>
        <BlurCircle top="-100px" left="0px" />
        <div className='flex flex-wrap gap-4 w-full'>
          {dashboardCards.map((card, index) => (
            <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full'>
              <div>
                <h1 className='text-sm'>{card.title}</h1>
                <p className='text-xl font-medium mt-l'>{card.value}</p>
              </div>
              <card.icon className='w-6 h-6' />
            </div>))}
        </div>

      </div>
      <p className='mt-10 text-lg font-medium'>Active Shows</p>
      <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl'>
            <BlurCircle top="100px" left="-10px" />
            {dashboardData.activeShows.map((show) => (
              <div key={show._id} className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>
                <img src={show.movie.poster_path} alt="" className='h-60 w-full object-cover'/>
                <p className='font-medium p-2 truncate'>{show.movie.title}</p>
                <div className='flex items-center justify-between px-2'>
                  <p className='text-lg font-medium'>{currency} {show.showPrice}</p>
                  <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary'/>
                    {show.movie.vote_average.toFixed(1)}
                  </p>
                </div>
                <p className='px-2 pt-2 text-sm text-gray-500'>{dateFormat(show.showDateTime)}</p>
              </div>
            ))}
      </div>
    </>
  ) : <Loading/>;
}

export default Dashboard
