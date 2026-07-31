-- ============================================================
-- SQL: Fix foreign key constraint violation on order deletion/update
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kmfekxzkbgneqwhukgbh/sql/new
-- ============================================================

CREATE OR REPLACE FUNCTION handle_order_stock_change()
RETURNS TRIGGER AS $$
DECLARE
  item jsonb;
  prod_id bigint;
  item_qty integer;
  item_bchcode integer;
  prod_exists boolean;
BEGIN
  -- Revert stock for OLD items (on DELETE or UPDATE)
  IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') THEN
    FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
      prod_id := (item->>'id')::bigint;
      item_qty := (item->>'qty')::integer;
      item_bchcode := COALESCE((item->>'bchcode')::integer, 0);

      -- Check if the product exists in the products table
      SELECT EXISTS (SELECT 1 FROM products WHERE id = prod_id) INTO prod_exists;

      IF prod_exists THEN
        UPDATE product_batches
        SET stock = stock + item_qty
        WHERE product_id = prod_id AND bchcode = item_bchcode;

        IF NOT FOUND THEN
          INSERT INTO product_batches (product_id, bchcode, batch, mrp, stock)
          VALUES (prod_id, item_bchcode, '', COALESCE((item->>'mrp')::numeric, 0), item_qty)
          ON CONFLICT (product_id, bchcode) DO UPDATE
          SET stock = product_batches.stock + item_qty;
        END IF;

        -- Update main products stock to sum of all batches
        UPDATE products
        SET stock = (SELECT COALESCE(SUM(stock), 0) FROM product_batches WHERE product_id = prod_id)
        WHERE id = prod_id;
      END IF;
    END LOOP;
  END IF;

  -- Deduct stock for NEW items (on INSERT or UPDATE)
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
      prod_id := (item->>'id')::bigint;
      item_qty := (item->>'qty')::integer;
      item_bchcode := COALESCE((item->>'bchcode')::integer, 0);

      -- Check if the product exists in the products table
      SELECT EXISTS (SELECT 1 FROM products WHERE id = prod_id) INTO prod_exists;

      IF prod_exists THEN
        UPDATE product_batches
        SET stock = stock - item_qty
        WHERE product_id = prod_id AND bchcode = item_bchcode;

        IF NOT FOUND THEN
          INSERT INTO product_batches (product_id, bchcode, batch, mrp, stock)
          VALUES (prod_id, item_bchcode, '', COALESCE((item->>'mrp')::numeric, 0), -item_qty)
          ON CONFLICT (product_id, bchcode) DO UPDATE
          SET stock = product_batches.stock - item_qty;
        END IF;

        -- Update main products stock to sum of all batches
        UPDATE products
        SET stock = (SELECT COALESCE(SUM(stock), 0) FROM product_batches WHERE product_id = prod_id)
        WHERE id = prod_id;
      END IF;
    END LOOP;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
