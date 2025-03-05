-- Add translator column to songs table
ALTER TABLE songs 
ADD COLUMN translator VARCHAR;

-- Add comment to explain the column
COMMENT ON COLUMN songs.translator IS 'Name of the person who translated the lyrics';
