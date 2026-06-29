-- ============================================================
-- SQL: Send push notification to customer on order dispatch
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kmfekxzkbgneqwhukgbh/sql/new
-- ============================================================

-- Create trigger function
CREATE OR REPLACE FUNCTION handle_order_dispatch_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if order status changed to 'Dispatched'
  IF NEW.status = 'Dispatched' AND (OLD.status IS DISTINCT FROM 'Dispatched' OR OLD.status IS NULL) THEN
    INSERT INTO pwa_notifications (user_role, user_id, title, body, status, url)
    VALUES (
      'customer',
      NEW.customer_id,
      'Order Dispatched 🚚',
      'Your order is going to be delivered today.',
      'pending',
      '/'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists (safe re-run)
DROP TRIGGER IF EXISTS trg_order_dispatch_notification ON orders;

-- Create the trigger on the orders table
CREATE TRIGGER trg_order_dispatch_notification
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_dispatch_notification();
