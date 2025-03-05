-- Enable RLS on all tables
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for albums
CREATE POLICY "Enable read access for all users" ON public.albums
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for authenticated users only" ON public.albums
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for songs
CREATE POLICY "Enable read access for all users" ON public.songs
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for authenticated users only" ON public.songs
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for blog_posts
CREATE POLICY "Public can read published posts" ON public.blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage posts" ON public.blog_posts
    FOR ALL USING (auth.role() = 'authenticated');
