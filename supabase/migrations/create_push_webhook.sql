-- ============================================================
-- FIX v3: Trigger with error handling + diagnostics
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kmfekxzkbgneqwhukgbh/sql/new
-- ============================================================

-- Step 1: Check if pg_net is available
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
  RAISE NOTICE 'pg_net extension is ready';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_net extension error: %', SQLERRM;
END;
$$;

-- Step 2: Create trigger function with error handling
CREATE OR REPLACE FUNCTION notify_push_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_function_url TEXT := 'https://kmfekxzkbgneqwhukgbh.supabase.co/functions/v1/send-push';
  service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc';
  payload JSONB;
  request_id BIGINT;
BEGIN
  -- Only process pending notifications
  IF NEW.status != 'pending' THEN
    RETURN NEW;
  END IF;

  -- Build the payload
  payload := jsonb_build_object(
    'record', jsonb_build_object(
      'id', NEW.id,
      'user_role', NEW.user_role,
      'user_id', NEW.user_id,
      'title', NEW.title,
      'body', NEW.body,
      'url', COALESCE(NEW.url, '/'),
      'image_url', NEW.image_url
    )
  );

  -- Try to make the HTTP call, but don't block the insert if it fails
  BEGIN
    SELECT net.http_post(
      edge_function_url,
      payload,
      '{}'::jsonb,
      jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      5000
    ) INTO request_id;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't block the insert
    RAISE WARNING 'Push trigger error: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Step 3: Recreate trigger
DROP TRIGGER IF EXISTS trigger_push_notification ON pwa_notifications;

CREATE TRIGGER trigger_push_notification
  AFTER INSERT ON pwa_notifications
  FOR EACH ROW
  EXECUTE FUNCTION notify_push_on_insert();
