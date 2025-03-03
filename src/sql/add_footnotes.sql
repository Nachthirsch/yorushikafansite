-- Add footnotes column to songs table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'songs' 
        AND column_name = 'footnotes'
    ) THEN
        ALTER TABLE songs
        ADD COLUMN footnotes TEXT;
    END IF;
END $$;

-- Add some sample footnotes to existing songs (optional)
UPDATE songs 
SET footnotes = CASE 
    WHEN id = (SELECT id FROM songs LIMIT 1) 
    THEN E'[1] This song was inspired by Japanese folklore\n[2] The term used in verse 2 refers to an ancient tradition\n[3] The chorus contains references to classical literature'
    ELSE NULL 
END
WHERE id IN (SELECT id FROM songs LIMIT 1);

-- Confirm the changes
SELECT id, title, footnotes 
FROM songs 
WHERE footnotes IS NOT NULL;
