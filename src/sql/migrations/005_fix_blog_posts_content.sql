-- Reset content column to JSONB
ALTER TABLE blog_posts 
ALTER COLUMN content TYPE jsonb USING 
  CASE 
    WHEN content IS NULL THEN '{}'::jsonb
    WHEN jsonb_typeof(content::jsonb) = 'string' THEN content::jsonb
    ELSE content::jsonb
  END;

-- Drop existing constraint
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_content_check;

-- Add new relaxed constraint
ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_content_check CHECK (
    content IS NOT NULL AND 
    jsonb_typeof(content) IN ('object', 'string')
);
