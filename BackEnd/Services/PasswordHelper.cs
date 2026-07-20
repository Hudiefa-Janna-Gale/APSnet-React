using System.Security.Cryptography;
using System.Text;

namespace BackEnd.Services;

// Turns a plain password (e.g. "123456") into a SHA256 hash
// so we never store the real password in the database.
public static class PasswordHelper
{
    public static string Hash(string password)
    {
        // 1. Convert the password text to bytes
        byte[] bytes = Encoding.UTF8.GetBytes(password);

        // 2. Hash the bytes with SHA256 (one-way: cannot be reversed)
        byte[] hashBytes = SHA256.HashData(bytes);

        // 3. Convert the hash to a Base64 string so it fits in an NVARCHAR column
        return Convert.ToBase64String(hashBytes);
    }

    // Compare a plain password with the hash saved in the database
    public static bool Verify(string password, string storedHash)
    {
        return Hash(password) == storedHash;
    }
}
