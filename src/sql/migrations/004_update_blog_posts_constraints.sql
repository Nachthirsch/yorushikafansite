-- Drop the existing constraint if it exists
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_content_check;

-- Make content column JSONB
ALTER TABLE blog_posts
ALTER COLUMN content TYPE jsonb USING content::jsonb;

-- Add new constraint that ensures content is valid JSON with required structure
ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_content_check CHECK (
    (content IS NOT NULL) AND 
    (jsonb_typeof(content) = 'object') AND 
    (content ? 'type') AND 
    (content ? 'sections')
);
