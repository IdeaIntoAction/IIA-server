SELECT 'CREATE DATABASE iia'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'iia')\gexec

SELECT 'CREATE DATABASE iia'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'iia')\gexec

