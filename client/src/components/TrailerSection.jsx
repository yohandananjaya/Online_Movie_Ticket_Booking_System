import React, { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";   // ✅ Correct import
import BlurCircle from "./BlurCircle";
import { PlayCircle } from "lucide-react";
import Loading from "./Loading";
import { useAppContext } from "../context/Appcontext";

const TrailerSection = () => {
  const { axios } = useAppContext();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ytThumb = (key) => `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
  const ytUrl = (key) => `https://www.youtube.com/watch?v=${key}`;

  const fetchTrailers = async () => {
    try {
      setLoading(true); setError(null);
      // 1) Get active shows (unique upcoming movies)
      const { data: showsRes } = await axios.get('/api/show/all');
      if(!showsRes.success){
        setError(showsRes.message || 'Failed to load shows');
        return;
      }
      const movies = showsRes.shows || [];
      // 2) Fetch trailers for the first up to 8 movies in parallel
      const top = movies.slice(0,8);
      const trailerPromises = top.map(async (m)=>{
        try{
          const r = await axios.get(`/api/show/${m._id || m.id}/trailers`);
          if(r.data.success){
            const list = r.data.trailers || [];
            const best = list.find(v=>v.type==='Trailer') || list[0];
            if(best){
              return { image: ytThumb(best.key), videoUrl: ytUrl(best.key), title: m.title };
            }
          }
        }catch(_){ /* ignore per-movie failure */ }
        return null;
      })
      const results = (await Promise.all(trailerPromises)).filter(Boolean);
      setTrailers(results);
      setCurrentTrailer(results[0] || null);
    } catch(e){
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchTrailers() },[]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>

      {/* Main Player */}
      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-400 text-sm text-center">{error}</p>
        ) : currentTrailer ? (
          <ReactPlayer
            url={currentTrailer.videoUrl}
            playing={true}
            controls={true}
            width="960px"
            height="540px"
            className="mx-auto max-w-full rounded-lg overflow-hidden"
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                },
              },
            }}
          />
        ) : (
          <p className="text-gray-400 text-sm text-center">No trailers found.</p>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {trailers.map((trailer) => (
          <div
            key={trailer.image}
            className="relative hover:-translate-y-1 duration-300 transition cursor-pointer"
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt={trailer.title || 'trailer'}
              className="rounded-lg w-full h-full object-cover brightness-75"
            />
            <PlayCircle
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
