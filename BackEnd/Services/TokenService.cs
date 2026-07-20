using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace BackEnd.Services;

// Creates the JWT token that is returned after a successful login.
// The token carries WHO the user is (id, name, email) and WHAT he is (role).
public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreateToken(int userId, string fullName, string email, string role)
    {
        // 1. Claims = the information stored INSIDE the token
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, fullName),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role) // used by [Authorize(Roles = "Admin")]
        };

        // 2. The secret key from appsettings.json signs the token
        //    so nobody can fake or edit it
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // 3. Build the token with an expiry date
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(int.Parse(_configuration["Jwt:ExpireHours"] ?? "8")),
            signingCredentials: credentials);

        // 4. Turn it into the final string: "eyJhbGciOi..."
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
