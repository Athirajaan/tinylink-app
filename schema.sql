-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);

-- Add check constraint for code format (6-8 alphanumeric characters)
ALTER TABLE links ADD CONSTRAINT code_format_check 
  CHECK (code ~ '^[A-Za-z0-9]{6,8}$');

-- Add comment to table
COMMENT ON TABLE links IS 'Stores shortened URL links with click analytics';
COMMENT ON COLUMN links.code IS 'Unique short code (6-8 alphanumeric characters)';
COMMENT ON COLUMN links.target_url IS 'Original URL to redirect to';
COMMENT ON COLUMN links.total_clicks IS 'Total number of times this link was clicked';
COMMENT ON COLUMN links.last_clicked_at IS 'Timestamp of most recent click';