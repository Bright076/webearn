-- Check the current constraint on client_requests status column
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'client_requests'::regclass 
AND conname LIKE '%status%';

-- To see all columns and their constraints
\d client_requests;
