import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Volume2, Download, Share2, PlayCircle, PauseCircle, ExternalLink, Headphones, ChevronDown, ChevronUp } from "lucide-react";
import { usePodcastEpisode, useEpisodeTranscript, useRelatedEpisodes } from "../hooks/usePodcasts";
import YorushikaLogo from "../components/common/YorushikaLogo";

/**
 * Halaman detail untuk episode podcast tunggal
 * Menampilkan informasi episode, player audio, dan transkrip
 * Desain menyesuaikan dengan komponen SongHeader dan LyricsContent
 */
export default function PodcastDetailPage() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const { data: episode, isLoading, isError } = usePodcastEpisode(episodeId);
  const { data: transcript } = useEpisodeTranscript(episodeId);
  const { data: relatedEpisodes, isLoading: isLoadingRelated } = useRelatedEpisodes(episodeId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);

  // Format waktu dari detik ke format mm:ss
  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format tanggal rilis
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Menangani pemutaran audio
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress bar saat audio bermain
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const progressPercent = (currentTime / duration) * 100;

    setProgress(progressPercent);
    setDuration(duration);
  };

  // Mengatur posisi audio berdasarkan klik pada progress bar
  const handleProgressClick = (e) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const seekPercentage = clickPosition / progressBarWidth;
    const seekTime = seekPercentage * audioRef.current.duration;

    audioRef.current.currentTime = seekTime;
  };

  // Reset audio state ketika episode berubah
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [episodeId]);

  // Variabel animasi untuk konten
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Menangani navigasi ke episode terkait
  const handleRelatedEpisodeClick = (relatedEpisodeId) => {
    navigate(`/yorucast/${relatedEpisodeId}`);
  };

  // Menampilkan loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-500 dark:border-t-neutral-400 rounded-full animate-spin"></div>
          <div className="text-neutral-500 dark:text-neutral-400 font-medium">Memuat episode...</div>
        </div>
      </div>
    );
  }

  // Menampilkan error state
  if (isError || !episode) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4">
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Episode tidak ditemukan</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Maaf, episode yang Anda cari tidak tersedia</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/yorucast")}
            className="mt-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg
                      hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors
                      text-neutral-800 dark:text-neutral-200"
          >
            Kembali ke daftar episode
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-16">
      {/* Header dengan tema konsisten dengan SongHeader */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative bg-neutral-50 dark:bg-neutral-950 pt-24 pb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigasi kembali dengan styling konsisten */}
          <div className="mb-4">
            <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/yorucast")} className="group inline-flex items-center py-1.5 px-3 -ml-3 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all" aria-label="Back to episodes">
              <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Episodes</span>
            </motion.button>
          </div>

          {/* Konten header utama dengan desain yang serupa dengan SongHeader */}
          <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 sm:p-6 lg:p-8 relative mb-6 before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8 relative">
              {/* Cover podcast dengan styling konsisten */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-none overflow-hidden relative group shadow-md border border-neutral-200 dark:border-neutral-700">
                  {episode.images && episode.images.length > 0 ? (
                    <img src={episode.images[0].url} alt="Podcast thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                      <Headphones className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
                    </div>
                  )}
                </div>

                {/* Elemen dekoratif sudut */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r border-b border-neutral-300 dark:border-neutral-700 opacity-60"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 border-l border-t border-neutral-300 dark:border-neutral-700 opacity-60"></div>
              </div>

              {/* Informasi episode dengan desain yang ditingkatkan */}
              <div className="flex-1">
                {/* Judul episode dengan elemen dekoratif yang konsisten */}
                <div className="flex items-center mb-3">
                  <div className="relative mr-2">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 px-4">{episode.name}</h1>
                </div>

                {/* Detail episode dengan styling yang selaras */}
                <div className="pl-6 border-l border-dashed border-neutral-300 dark:border-neutral-600 relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">
                  <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
                    {/* Tanggal rilis */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-500" />
                      <span className="text-sm">{formatReleaseDate(episode.release_date)}</span>
                    </div>

                    {/* Durasi */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-500" />
                      <span className="text-sm">{formatTime(episode.duration_ms / 1000)}</span>
                    </div>

                    {/* Badge untuk menunjukkan tipe konten */}
                    <div className="mt-2.5">
                      <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full">PODCAST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons dengan positioning */}
              <div className="absolute top-1 right-1 flex gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigator
                      .share({
                        title: episode.name,
                        text: episode.description,
                        url: window.location.href,
                      })
                      .catch(() => {})
                  }
                  className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  aria-label="Share episode"
                >
                  <Share2 className="h-4.5 w-4.5" />
                </motion.button>

                <motion.a href={episode.external_urls?.spotify} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-label="Listen on Spotify">
                  <ExternalLink className="h-4.5 w-4.5" />
                </motion.a>
              </div>
            </div>

            {/* Logo dekoratif */}
            <div className="absolute bottom-2 right-2 opacity-10">
              <YorushikaLogo className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content area */}
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div key="player" initial="hidden" animate="visible" exit="exit" variants={contentVariants} transition={{ duration: 0.3 }} className="mb-6">
            {/* Player section dengan desain yang konsisten */}
            <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                  </div>
                  <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">Now Playing</h2>
                </div>
              </div>

              {/* Audio player controls yang didesain ulang */}
              <div className="flex flex-col gap-4 pb-1">
                {/* Progress bar yang lebih elegan */}
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer relative overflow-hidden" onClick={handleProgressClick}>
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-neutral-500 to-neutral-400 dark:from-neutral-600 dark:to-neutral-500 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Audio controls dengan layout yang lebih seimbang */}
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button onClick={handlePlayPause} className={`p-2.5 rounded-full transition-all ${isPlaying ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600"}`} aria-label={isPlaying ? "Pause audio" : "Play audio"}>
                      {isPlaying ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                    </button>

                    <div className="text-sm text-neutral-700 dark:text-neutral-300 min-w-[80px]">
                      {formatTime(audioRef.current?.currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Volume control dengan desain yang lebih halus */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <div className="w-20 h-1.5 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-neutral-400 to-neutral-500 dark:from-neutral-500 dark:to-neutral-400"></div>
                      </div>
                    </div>

                    {/* Download button */}
                    <a href={episode.audio_preview_url} target="_blank" rel="noopener noreferrer" download={`${episode.name}.mp3`} className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors" aria-label="Download audio preview">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <audio ref={audioRef} src={episode.audio_preview_url} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>

              {/* Elemen dekoratif untuk audio player */}
              <div className="mt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700 pt-4">
                <a href={episode.external_urls?.spotify} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors w-fit">
                  <span>Listen full episode on Spotify</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Episode description section */}
          <motion.div key="description" initial="hidden" animate="visible" exit="exit" variants={contentVariants} transition={{ duration: 0.3, delay: 0.1 }} className="mb-6">
            <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                </div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">About this Episode</h2>
              </div>

              <div className="whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 border-l border-dashed border-neutral-300 dark:border-neutral-600 pl-4 font-lyrics relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">{episode.description || <p className="text-neutral-400 dark:text-neutral-500 italic">No description available</p>}</div>
            </div>
          </motion.div>

          {/* Transcript section dengan toggle */}
          {transcript && transcript.content && (
            <motion.div key="transcript" initial="hidden" animate="visible" exit="exit" variants={contentVariants} transition={{ duration: 0.3, delay: 0.2 }} className="mb-6">
              <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
                <button onClick={() => setShowTranscript(!showTranscript)} className="w-full flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                    </div>
                    <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">Transcript</h2>
                  </div>
                  {showTranscript ? <ChevronUp className="w-5 h-5 text-neutral-500 dark:text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />}
                </button>

                <AnimatePresence>
                  {showTranscript && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="mt-4 whitespace-pre-line leading-relaxed text-neutral-800 dark:text-neutral-200 border-l border-dashed border-neutral-300 dark:border-neutral-600 pl-4 font-lyrics relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent max-h-96 overflow-y-auto pr-2">{transcript.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Related episodes section dengan styling yang konsisten */}
          <motion.div key="related" initial="hidden" animate="visible" exit="exit" variants={contentVariants} transition={{ duration: 0.3, delay: 0.3 }} className="mb-6">
            <div className="bg-white dark:bg-neutral-900 border-0 shadow-lg p-6 relative before:absolute before:inset-0 before:border before:border-neutral-300 dark:before:border-neutral-700 before:-m-1 before:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,8px_8px,8px_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_8px,8px_8px)] before:pointer-events-none">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-neutral-400"></div>
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-neutral-400"></div>
                </div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 ml-4">Related Episodes</h2>
              </div>

              <div className="border-l border-dashed border-neutral-300 dark:border-neutral-600 pl-4 relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-neutral-400 before:to-transparent">
                {isLoadingRelated ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-500 dark:border-t-neutral-400 rounded-full animate-spin"></div>
                  </div>
                ) : relatedEpisodes && relatedEpisodes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {relatedEpisodes.map((relatedEpisode) => (
                      <motion.div key={relatedEpisode.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleRelatedEpisodeClick(relatedEpisode.id)} className="group cursor-pointer bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden flex flex-col">
                        {/* Episode thumbnail */}
                        <div className="relative aspect-square overflow-hidden">
                          {relatedEpisode.images && relatedEpisode.images.length > 0 ? (
                            <img src={relatedEpisode.images[0].url} alt={`${relatedEpisode.name} thumbnail`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                              <Headphones className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-3 transition-opacity duration-300">
                            <PlayCircle className="w-10 h-10 text-white drop-shadow-md" />
                          </div>
                        </div>

                        {/* Episode info */}
                        <div className="p-3">
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm line-clamp-2 mb-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">{relatedEpisode.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatReleaseDate(relatedEpisode.release_date)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-neutral-600 dark:text-neutral-400">No related episodes available.</p>
                  </div>
                )}
              </div>

              {/* Elemen dekoratif */}
              <div className="absolute bottom-3 right-3 opacity-10">
                <YorushikaLogo className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
