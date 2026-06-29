-- ============================================================
-- SQL: Auto-dispatch orders when a trip is activated
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kmfekxzkbgneqwhukgbh/sql/new
-- ============================================================

-- Create trigger function
CREATE OR REPLACE FUNCTION handle_trip_activation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if trip status changed to 'active'
  IF NEW.status = 'active' AND (OLD.status IS DISTINCT FROM 'active') THEN
    -- Update all orders associated with this trip to 'Dispatched'
    UPDATE orders
    SET status = 'Dispatched'
    WHERE id IN (
      SELECT order_id
      FROM trip_orders
      WHERE trip_id = NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists (safe re-run)
DROP TRIGGER IF EXISTS trg_trip_activation ON trips;

-- Create the trigger on the trips table
CREATE TRIGGER trg_trip_activation
  AFTER UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION handle_trip_activation();
