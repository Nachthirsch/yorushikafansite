-- Add new fields to the albums table with checks to prevent errors if they already exist

-- Add description field if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_name='albums' AND column_name='description') THEN
        ALTER TABLE albums ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add youtube_url field if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_name='albums' AND column_name='youtube_url') THEN
        ALTER TABLE albums ADD COLUMN youtube_url TEXT;
    END IF;
END $$;

-- Add spotify_url field if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_name='albums' AND column_name='spotify_url') THEN
        ALTER TABLE albums ADD COLUMN spotify_url TEXT;
    END IF;
END $$;

-- Add classification field if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_name='albums' AND column_name='classification') THEN
        ALTER TABLE albums ADD COLUMN classification VARCHAR(50);
    END IF;
END $$;

-- You can run this command to verify the structure after changes
-- COMMENT: SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'albums';
