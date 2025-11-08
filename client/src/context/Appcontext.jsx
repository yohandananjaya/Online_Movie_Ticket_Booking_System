import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
export const AppContext = createContext()

export const AppProvider = ({children}) => {
    const [shows,setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [initialized, setInitialized] = useState(false)
    const navigate = useNavigate()

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const fetchShows = async ()=>{
        try {
            const {data} = await axios.get('/api/show/all')
            if(data.success){
                setShows(data.shows)   
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchFavoriteMovies = async ()=>{
        try {
            const {data} = await axios.get('/api/user/favorites',{headers:{Authorization: `Bearer ${token}`}})
            if(data.success){
                setFavoriteMovies(data.movies)   
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        fetchShows()
    },[])

    useEffect(()=>{
        if(token){
            fetchFavoriteMovies()
        }
    },[token])

    const login = async (email, password)=>{
        try {
            const {data} = await axios.post('/api/auth/login',{email,password})
            if(data.success){
                setUser(data.user)
                setToken(data.token)
                try{ localStorage.setItem('token', data.token) }catch{}
                toast.success('Logged in')
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Login failed')
        }
    }
    const register = async (name, email, password)=>{
        try {
            const {data} = await axios.post('/api/auth/register',{name,email,password})
            if(data.success){
                setUser(data.user)
                setToken(data.token)
                try{ localStorage.setItem('token', data.token) }catch{}
                toast.success('Account created')
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Registration failed')
        }
    }
    const logout = ()=>{
        setUser(null); setToken(null); try{ localStorage.removeItem('token') }catch{}; toast.success('Logged out')
    }

        useEffect(()=>{
                // rehydrate token from storage and set axios auth header
                        try{
                            const t = localStorage.getItem('token')
                            if(t){
                                setToken(t)
                                axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
                            } else {
                                delete axios.defaults.headers.common['Authorization']
                            }
                        }catch{}
                        // mark rehydration finished
                        setInitialized(true)
        },[])

        useEffect(()=>{
                // keep axios auth header in sync when token changes
                if(token){
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                }else{
                        delete axios.defaults.headers.common['Authorization']
                }
        },[token])

    const value = {axios,shows,favoriteMovies,fetchFavoriteMovies,user,token,login,register,logout,image_base_url,initialized}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}
export const useAppContext = () => useContext(AppContext)