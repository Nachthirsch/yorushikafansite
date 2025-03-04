-- Ensure content column is JSONB
ALTER TABLE blog_posts 
  ALTER COLUMN content TYPE jsonb USING content::jsonb;

-- Add constraint to ensure content has required structure
ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_content_check 
  CHECK (
    jsonb_typeof(content) = 'object' 
    AND content ? 'type'
    AND content ? 'sections'
  );

-- Add index for better query performance
CREATE INDEX idx_blog_posts_content_gin ON blog_posts USING gin (content);
