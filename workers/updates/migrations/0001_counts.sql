-- Daily totals of update checks (src/count.ts). One row per day, kind, version
-- and platform; nothing about a single request or install is stored.
CREATE TABLE counts (
  day TEXT NOT NULL,
  kind TEXT NOT NULL,
  version TEXT NOT NULL,
  os TEXT NOT NULL,
  arch TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, kind, version, os, arch)
) WITHOUT ROWID;
