-- Add author fields to blog_posts table
ALTER TABLE blog_posts
ADD COLUMN author_name VARCHAR,
ADD COLUMN author_social_link VARCHAR;
