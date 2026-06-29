-- Add image_url column to pwa_notifications table
ALTER TABLE pwa_notifications ADD COLUMN IF NOT EXISTS image_url text;
