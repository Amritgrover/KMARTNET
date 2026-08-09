-- Migration: Add is_visible column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
