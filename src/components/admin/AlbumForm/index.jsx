import useAlbumForm from './useAlbumForm';
import AlbumFormView from './AlbumFormView';

export default function AlbumForm({ album = null, onSave = () => {}, onCancel = () => {} }) {
  const formLogic = useAlbumForm({ album, onSave });
  
  return (
    <AlbumFormView
      {...formLogic}
      album={album}
      onCancel={onCancel}
    />
  );
} 