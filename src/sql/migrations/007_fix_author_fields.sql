-- Drop existing columns if they exist
ALTER TABLE blog_posts 
DROP COLUMN IF EXISTS author_name,
DROP COLUMN IF EXISTS author_social_link;

-- Add columns with proper constraints
ALTER TABLE blog_posts
ADD COLUMN author_name VARCHAR(255),
ADD COLUMN author_social_link VARCHAR(512);

-- Update existing rows
UPDATE blog_posts
SET 
  author_name = '',
  author_social_link = ''
WHERE author_name IS NULL;
