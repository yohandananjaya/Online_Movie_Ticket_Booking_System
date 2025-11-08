import React, { useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { assets } from '../assets/assets'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
        const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
        const {login, register} = useAppContext()

        const onSubmit = (e)=>{
            e.preventDefault()
            if(state === 'register'){
                if(password !== confirm){
                    toast.error('Passwords do not match')
                    return;
                }
                register(name, email, password)
            } else {
                login(email, password)
            }
        }

        return (
            <div className="min-h-[80vh] flex flex-col md:flex-row items-stretch mt-20 md:mt-30 px-6 md:px-16 lg:px-32">
                {/* Left visual panel */}
                <div className="hidden md:flex relative flex-1 rounded-xl overflow-hidden border border-primary/20" style={{backgroundImage:`url('/backgroundImage.png')`, backgroundSize:'cover', backgroundPosition:'center'}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                        <h2 className="text-4xl font-semibold leading-tight max-w-md">Experience stories on the big screen.</h2>
                        <p className="mt-4 text-sm text-gray-200 max-w-sm">Book tickets, track favorites, and never miss a showtime. Dive into a universe of films curated just for you.</p>
                        <div className="flex items-center gap-4 mt-8">
                            <img src={assets.logo} alt="Logo" className="w-14" />
                            <p className="text-sm text-gray-300">ShowTix • Your movie companion</p>
                        </div>
                    </div>
                </div>
                {/* Form panel */}
                <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full md:w-[420px] bg-[#111113] border border-primary/30 rounded-xl p-8 md:p-10 shadow-2xl backdrop-blur">
                    <p className="text-3xl font-semibold">
                        {state === 'login' ? 'Welcome back' : 'Create account'}
                    </p>
                    <p className="text-sm text-gray-400 -mt-3">
                        {state === 'login' ? 'Enter your credentials to continue' : 'Fill in the details below to get started'}
                    </p>
                    {state === 'register' && (
                        <div className="w-full group">
                            <label className="text-xs uppercase tracking-wide text-gray-400">Name</label>
                            <input onChange={e=>setName(e.target.value)} value={name} placeholder="Jane Doe" className="mt-1 bg-[#1b1c1e] border border-gray-700 focus:border-primary/70 focus:ring-2 focus:ring-primary/30 transition rounded-md w-full px-3 py-2 text-sm" type="text" required />
                        </div>
                    )}
                    <div className="w-full group">
                        <label className="text-xs uppercase tracking-wide text-gray-400">Email</label>
                        <input onChange={e=>setEmail(e.target.value)} value={email} placeholder="you@example.com" className="mt-1 bg-[#1b1c1e] border border-gray-700 focus:border-primary/70 focus:ring-2 focus:ring-primary/30 transition rounded-md w-full px-3 py-2 text-sm" type="email" required />
                    </div>
                                        <div className="w-full group">
                                                <label className="text-xs uppercase tracking-wide text-gray-400">Password</label>
                                                <div className="relative mt-1">
                                                    <input onChange={e=>setPassword(e.target.value)} value={password} placeholder="••••••••" className="bg-[#1b1c1e] border border-gray-700 focus:border-primary/70 focus:ring-2 focus:ring-primary/30 transition rounded-md w-full px-3 py-2 pr-10 text-sm" type={showPwd? 'text' : 'password'} required />
                                                    <button type="button" aria-label="Toggle password" onClick={()=>setShowPwd(p=>!p)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                                                        {showPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                                    </button>
                                                </div>
                                        </div>
                                        {state === 'register' && (
                                            <div className="w-full group">
                                                <label className="text-xs uppercase tracking-wide text-gray-400">Confirm Password</label>
                                                <input onChange={e=>setConfirm(e.target.value)} value={confirm} placeholder="••••••••" className="mt-1 bg-[#1b1c1e] border border-gray-700 focus:border-primary/70 focus:ring-2 focus:ring-primary/30 transition rounded-md w-full px-3 py-2 text-sm" type={showPwd? 'text' : 'password'} required />
                                                {confirm && confirm !== password && (
                                                    <p className="text-xs text-red-400 mt-1">Passwords don’t match</p>
                                                )}
                                            </div>
                                        )}
                    <div className="text-xs text-gray-400">
                        {state === 'register' ? (
                            <span>Already have an account? <button type="button" onClick={()=>setState('login')} className="text-primary hover:underline font-medium">Login</button></span>
                        ) : (
                            <span>Need an account? <button type="button" onClick={()=>setState('register')} className="text-primary hover:underline font-medium">Sign Up</button></span>
                        )}
                    </div>
                    <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-3 rounded-md text-sm font-semibold tracking-wide">
                        {state === 'register' ? 'Create Account' : 'Login'}
                    </button>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2">
                        <span className="h-px flex-1 bg-gray-700" />
                        <p>Secure & Private</p>
                        <span className="h-px flex-1 bg-gray-700" />
                    </div>
                </form>
            </div>
        )
}
export default Login
