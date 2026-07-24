
CREATE POLICY "Anyone can upload to try/ prefix" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'project-uploads' AND (storage.foldername(name))[1] = 'try');
CREATE POLICY "Anyone can read metadata of try/ uploads" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-uploads' AND (storage.foldername(name))[1] = 'try');
