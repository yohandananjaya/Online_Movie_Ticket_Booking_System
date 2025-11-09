import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const clearAuth = useCallback(() => {
        setUser(null);
        setToken(null);
        setFavoriteMovies([]);
        try { localStorage.removeItem('token'); } catch { /* no-op */ }
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    const fetchShows = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/show/all');
            if (data.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchFavoriteMovies = useCallback(async () => {
        if (!token) return;
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setFavoriteMovies(data.movies);
            }
        } catch (error) {
            console.error(error);
        }
    }, [token]);

    const fetchCurrentUser = useCallback(async (activeToken) => {
        try {
            const { data } = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${activeToken}` } });
            if (data.success) {
                setUser(data.user);
            } else {
                clearAuth();
            }
        } catch (error) {
            clearAuth();
        }
    }, [clearAuth]);

    useEffect(() => { fetchShows(); }, [fetchShows]);

    useEffect(() => {
        if (token) {
            fetchFavoriteMovies();
        } else {
            setFavoriteMovies([]);
        }
    }, [token, fetchFavoriteMovies]);

    const login = async (email, password, redirectTo) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            if (data.success) {
                setUser(data.user);
                setToken(data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                try { localStorage.setItem('token', data.token); } catch { /* ignore */ }
                toast.success('Logged in');
                navigate(redirectTo || '/', { replace: true });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Login failed');
        }
    };

    const register = async (name, email, password, redirectTo) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            if (data.success) {
                setUser(data.user);
                setToken(data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                try { localStorage.setItem('token', data.token); } catch { /* ignore */ }
                toast.success('Account created');
                navigate(redirectTo || '/', { replace: true });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Registration failed');
        }
    };

    const logout = () => {
        clearAuth();
        toast.success('Logged out');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    await fetchCurrentUser(storedToken);
                } else {
                    delete axios.defaults.headers.common['Authorization'];
                }
            } catch {
                clearAuth();
            } finally {
                setInitialized(true);
            }
        };
        initAuth();
    }, [fetchCurrentUser, clearAuth]);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    const currentPath = window.location.pathname;
                    clearAuth();
                    if (currentPath !== '/login') {
                        navigate('/login', { state: { from: currentPath }, replace: true });
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [clearAuth, navigate]);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const value = { axios, shows, favoriteMovies, fetchFavoriteMovies, user, token, login, register, logout, image_base_url, initialized };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);