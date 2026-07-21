using System.Security.Cryptography;
using System.Text;

namespace BackEnd.Services;

public static class PasswordHelper
{

    public static string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public static bool Verify(string password, string storedHash)
    {
        if (string.IsNullOrEmpty(storedHash))
            return false;

        if (IsBCryptHash(storedHash))
            return BCrypt.Net.BCrypt.Verify(password, storedHash);

        return LegacySha256(password) == storedHash;
    }

    public static bool NeedsUpgrade(string storedHash)
    {
        return !string.IsNullOrEmpty(storedHash) && !IsBCryptHash(storedHash);
    }

    private static bool IsBCryptHash(string hash) => hash.StartsWith("$2");

    private static string LegacySha256(string password)
    {
        byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashBytes);
    }
}
