import useBlogPostForm from './useBlogPostForm';
import BlogPostFormView from './BlogPostFormView';

export default function BlogPostForm({ post, isEditing, onSubmit, onChange, onCancel }) {
  const formLogic = useBlogPostForm({ post, onChange, onSubmit });
  
  return (
    <BlogPostFormView
      {...formLogic}
      isEditing={isEditing}
      onCancel={onCancel}
    />
  );
} 