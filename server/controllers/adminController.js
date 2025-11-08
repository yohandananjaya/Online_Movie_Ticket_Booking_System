import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";


// API to check if user is admin 
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true });
}

// API to get dashbord deta
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        // fetch all upcoming shows, then reduce to one entry per movie (earliest upcoming)
        const upcoming = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 });
        const uniqueByMovie = new Map();
        for (const s of upcoming) {
            const key = s.movie?._id?.toString?.() || String(s.movie)
            if (!uniqueByMovie.has(key)) {
                uniqueByMovie.set(key, s)
            }
        }
        const activeShows = Array.from(uniqueByMovie.values())
        const totalUser = await User.countDocuments();
        const dashbordData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, b) => acc + b.amount, 0),
            activeShows,
            totalUser
        };
        res.json({ success: true, dashbordData });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//API toget all shows

export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 });
        res.json({ success: true, shows });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user')
            .populate({ path: 'show', populate: { path: 'movie' } })
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to delete a specific show (admin)
export const deleteShow = async (req, res) => {
    try{
        const { showId } = req.params
        // guard: prevent deleting if there are existing bookings for this show
        const hasBookings = await Booking.exists({ show: showId })
        if(hasBookings){
            return res.json({success:false, message:'Cannot delete a show with existing bookings'})
        }
        const result = await Show.findByIdAndDelete(showId)
        if(!result){
            return res.status(404).json({success:false, message:'Show not found'})
        }
        res.json({success:true, message:'Show deleted'})
    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}