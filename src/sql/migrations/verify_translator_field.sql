-- Verify translator column exists and has correct type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'songs' AND column_name = 'translator';

-- If needed, modify the column
ALTER TABLE songs 
ALTER COLUMN translator TYPE VARCHAR(255); -- Adjust size if needed
