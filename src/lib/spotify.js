/**
 * Utilitas untuk integrasi dengan Spotify Web API
 * Menyediakan fungsi-fungsi untuk otentikasi dan fetching data podcast
 */
import axios from "axios";

// Kredensial Spotify dari variabel lingkungan
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Cache untuk token
let tokenData = {
  access_token: null,
  expires_at: null,
};

/**
 * Mendapatkan token akses untuk Spotify API
 * Menggunakan Client Credentials Flow
 * @returns {Promise<string>} Token akses
 */
export const getAccessToken = async () => {
  // Periksa apakah token masih valid
  if (tokenData.access_token && tokenData.expires_at && tokenData.expires_at > Date.now()) {
    return tokenData.access_token;
  }

  try {
    // Format kredensial untuk basic auth
    const authString = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

    // Request token baru
    const response = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Simpan token dan waktu kedaluwarsa
    const { access_token, expires_in } = response.data;
    tokenData = {
      access_token,
      expires_at: Date.now() + expires_in * 900, // 90% dari waktu kedaluwarsa sebagai margin keamanan
    };

    return access_token;
  } catch (error) {
    console.error("Gagal mendapatkan token Spotify:", error);
    throw new Error("Gagal otentikasi dengan Spotify API");
  }
};

/**
 * Mengambil data show/podcast dari Spotify API berdasarkan ID
 * @param {string} showId - ID podcast di Spotify
 * @returns {Promise<Object>} Data podcast
 */
export const getShow = async (showId) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/shows/${showId}`, {
      params: { market: "JP" }, // Menggunakan market JP untuk konten Jepang
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data show:", error);
    // Tambahkan informasi error yang lebih spesifik
    if (error.response && error.response.status === 404) {
      throw new Error("Podcast tidak ditemukan. Mohon periksa ID podcast.");
    }
    throw new Error("Gagal mengambil data podcast");
  }
};

/**
 * Mengambil episode-episode dari podcast tertentu
 * @param {string} showId - ID podcast di Spotify
 * @param {number} limit - Jumlah episode yang diambil (max 50)
 * @param {number} offset - Offset untuk paginasi
 * @returns {Promise<Object>} Data episode-episode
 */
export const getShowEpisodes = async (showId, limit = 20, offset = 0) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/shows/${showId}/episodes`, {
      params: { limit, offset, market: "JP" }, // Menggunakan market JP untuk konten Jepang
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data episode:", error);
    // Tambahkan informasi error yang lebih spesifik
    if (error.response && error.response.status === 404) {
      throw new Error("Podcast tidak ditemukan. Mohon periksa ID podcast.");
    }
    throw new Error("Gagal mengambil episode podcast");
  }
};

/**
 * Mengambil detail episode tertentu
 * @param {string} episodeId - ID episode di Spotify
 * @returns {Promise<Object>} Data detail episode
 */
export const getEpisode = async (episodeId) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/episodes/${episodeId}`, {
      params: { market: "ID" },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data detail episode:", error);
    // Tambahkan informasi error yang lebih spesifik
    if (error.response && error.response.status === 404) {
      throw new Error("Episode tidak ditemukan.");
    }
    throw new Error("Gagal mengambil detail episode podcast");
  }
};

/**
 * Mencari podcast berdasarkan kata kunci
 * @param {string} query - Kata kunci pencarian
 * @param {number} limit - Jumlah hasil (max 50)
 * @param {number} offset - Offset untuk paginasi
 * @returns {Promise<Object>} Hasil pencarian
 */
export const searchShows = async (query, limit = 20, offset = 0) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      params: {
        q: query,
        type: "show",
        limit,
        offset,
        market: "ID",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.shows;
  } catch (error) {
    console.error("Gagal melakukan pencarian show:", error);
    throw new Error("Gagal mencari podcast");
  }
};

/**
 * ID podcast Yorushika (Update dengan ID podcast yang valid)
 * Menggunakan ID podcast resmi dari Spotifym/show/5kUfyYT5d3BbYlagnTZiFA
 * Untuk sementara menggunakan ID podcast populer sebagai contoh
 */ export const YORUSHIKA_PODCAST_ID = "5kUfyYT5d3BbYlagnTZiFA"; // ID resmi podcast Yorucast
// export const YORUSHIKA_PODCAST_ID = "5K4UCaG8qnD71awcCADQWS"; // ID tidak validexport const YORUSHIKA_PODCAST_ID = "4rOoJ6Egrf8K2IrywzwOMk"; // Ted Talks Daily sebagai contoh
