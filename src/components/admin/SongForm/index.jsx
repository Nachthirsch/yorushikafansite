import useSongForm from './useSongForm';
import SongFormView from './SongFormView';

export default function SongForm({ song = {}, isEditing = false, onSubmit, onChange, albums = [] }) {
  const formLogic = useSongForm({ song, onSubmit, onChange });
  
  return (
    <SongFormView
      {...formLogic}
      song={song}
      albums={albums}
      isEditing={isEditing}
    />
  );
} 