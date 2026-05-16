-- Optional: align profiles.is_admin with operational reality (reporting / future use).
-- Route guards (/admin) use only ADMIN_EMAILS in application code — this does NOT grant access by itself.
--
-- BEFORE: list current flags
-- SELECT id, email, is_admin FROM public.profiles WHERE is_admin = true ORDER BY email;
--
-- Revoke admin flag for everyone, then set only the authorized operator.

UPDATE public.profiles
SET is_admin = false
WHERE is_admin = true;

UPDATE public.profiles
SET is_admin = true
WHERE lower(trim(coalesce(email, ''))) = 'hugomarcianoleite@gmail.com';

-- AFTER: verify exactly one row (or zero if that user has no profile row yet)
-- SELECT id, email, is_admin FROM public.profiles WHERE is_admin = true ORDER BY email;
