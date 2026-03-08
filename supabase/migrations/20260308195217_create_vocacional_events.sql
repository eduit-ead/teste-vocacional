/*
  # Create vocacional_events table

  1. New Tables
    - `vocacional_events`
      - `id` (uuid, primary key, auto-generated)
      - `event_name` (text, required) - name of the event being tracked
      - `created_at` (timestamptz) - timestamp of when the event occurred

  2. Security
    - Enable RLS on `vocacional_events` table
    - Add policy to allow anonymous inserts (public-facing quiz events)
*/

CREATE TABLE IF NOT EXISTS vocacional_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vocacional_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON vocacional_events
  FOR INSERT
  TO anon
  WITH CHECK (true);
