-- Only the number of update checks per day: the app sends nothing to count by.
CREATE TABLE checks (
  day TEXT PRIMARY KEY,
  n INTEGER NOT NULL DEFAULT 0
) WITHOUT ROWID;

INSERT INTO checks (day, n)
SELECT day, SUM(n) FROM counts WHERE kind = 'plain' GROUP BY day;

DROP TABLE counts;
