SELECT id,
       username,
       email,
       "passwordHash",
       role,
       status,
       "firstName",
       "lastName",
       phone,
       "profileImage",
       "createdAt",
       "updatedAt"
FROM public.users
LIMIT 1000;