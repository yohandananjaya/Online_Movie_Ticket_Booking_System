import express from 'express';
import { addShow, getNowPlayingMovies, getShow, getShows, getMovieTrailers } from '../controllers/showController.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

showRouter.get('/now-playing', getNowPlayingMovies)
showRouter.post('/add',addShow)
showRouter.get("/all", getShows)
// place trailers route before :movieId to avoid route shadowing
showRouter.get('/:movieId/trailers', getMovieTrailers)
showRouter.get("/:movieId", getShow)


export default showRouter;