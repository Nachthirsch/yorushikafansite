import React, { createContext, useContext, useReducer, useMemo } from "react";

const AdminContext = createContext();

const initialState = {
  posts: [],
  albums: [],
  songs: [],
  stats: {
    totalPosts: 0,
    totalAlbums: 0,
    totalSongs: 0,
  },
  loading: false,
  currentPost: {
    title: "",
    content: [],
    published: false,
    publish_date: "",
    author_name: "",
    author_social_link: "",
  },
  isEditing: false,
  postSort: "newest",
  albumSort: "newest",
  postFilter: "",
  albumFilter: "",
  selectedAlbum: null,
  newSong: {
    title: "",
    track_number: "",
    duration: "",
    lyrics: "",
    lyrics_translation: "",
    album_id: "",
  },
  deleteConfirmation: {
    show: false,
    type: null,
    id: null,
    title: "",
  },
};

function adminReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "SET_ALBUMS":
      return { ...state, albums: action.payload };
    case "SET_SONGS":
      return { ...state, songs: action.payload };
    case "UPDATE_STATS":
      return { ...state, stats: action.payload };
    case "SET_CURRENT_POST":
      return {
        ...state,
        currentPost: {
          ...state.currentPost,
          ...action.payload,
          author_name: action.payload.author_name || "",
          author_social_link: action.payload.author_social_link || "",
        },
      };
    case "SET_IS_EDITING":
      return { ...state, isEditing: action.payload };
    case "RESET_CURRENT_POST":
      return {
        ...state,
        currentPost: initialState.currentPost,
      };
    case "SET_DELETE_CONFIRMATION":
      return { ...state, deleteConfirmation: action.payload };
    case "HIDE_DELETE_CONFIRMATION":
      return { ...state, deleteConfirmation: initialState.deleteConfirmation };
    case "SET_POST_SORT":
      return { ...state, postSort: action.payload };
    case "SET_ALBUM_SORT":
      return { ...state, albumSort: action.payload };
    case "SET_POST_FILTER":
      return { ...state, postFilter: action.payload };
    case "SET_ALBUM_FILTER":
      return { ...state, albumFilter: action.payload };
    case "SET_SELECTED_ALBUM":
      return { ...state, selectedAlbum: action.payload };
    case "SET_NEW_SONG":
      return { ...state, newSong: action.payload };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const value = useMemo(() => [state, dispatch], [state]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
