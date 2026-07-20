
UPDATE Users
SET PasswordHash = 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI='   
WHERE LEN(PasswordHash) < 40;  


UPDATE Users SET Role = 'Admin' WHERE Email = 'admin@shop.com';


IF NOT EXISTS (SELECT 1 FROM Users WHERE Role = 'Admin')
BEGIN
    INSERT INTO Users (FullName, Email, PasswordHash, Role)
    VALUES ('Admin', 'admin@shop.com', 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=', 'Admin');
END

SELECT UserID, FullName, Email, Role FROM Users;
