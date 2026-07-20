using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

// AUTHENTICATION controller: register + login.
// On success it returns a JWT token that the React app sends back
// with every request ("Authorization: Bearer <token>").
[ApiController]
[Route("api/[controller]")]   // => api/auth
public class AuthController : ControllerBase
{
    private readonly string _connectionString;
    private readonly TokenService _tokenService;

    public AuthController(IConfiguration configuration, TokenService tokenService)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        _tokenService = tokenService;
    }

    // POST: api/auth/register  -> create a new account (always role "Customer")
    [HttpPost("register")]
    public IActionResult Register(User user)
    {
        // --- Server side validation ---
        if (string.IsNullOrWhiteSpace(user.FullName))
            return BadRequest(new { message = "Full name is required." });

        if (string.IsNullOrWhiteSpace(user.Email) || !user.Email.Contains("@"))
            return BadRequest(new { message = "A valid email address is required." });

        if (string.IsNullOrWhiteSpace(user.PasswordHash) || user.PasswordHash.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters." });

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // --- Duplicate check: email already registered? ---
            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Users WHERE Email = @Email", connection);
            checkCommand.Parameters.AddWithValue("@Email", user.Email);

            int existing = (int)checkCommand.ExecuteScalar();
            if (existing > 0)
                return BadRequest(new { message = "This email is already registered." });

            // SECURITY: the client can NEVER choose his own role here.
            // New accounts are always "Customer"; only an Admin can promote a user.
            var insertCommand = new SqlCommand(
                @"INSERT INTO Users (FullName, Email, PasswordHash, Role)
                  VALUES (@FullName, @Email, @PasswordHash, 'Customer');
                  SELECT CAST(SCOPE_IDENTITY() AS INT);", connection);

            insertCommand.Parameters.AddWithValue("@FullName", user.FullName);
            insertCommand.Parameters.AddWithValue("@Email", user.Email);
            // SECURITY: hash the password before saving it
            insertCommand.Parameters.AddWithValue("@PasswordHash", PasswordHelper.Hash(user.PasswordHash));

            int newId = (int)insertCommand.ExecuteScalar();

            // Create the token immediately so the user is logged in after register
            string token = _tokenService.CreateToken(newId, user.FullName, user.Email, "Customer");

            return Ok(new
            {
                message = "Account created successfully.",
                token,
                user = new { UserID = newId, user.FullName, user.Email, Role = "Customer" }
            });
        }
    }

    // POST: api/auth/login  -> check email + password, return JWT token
    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        // --- Server side validation ---
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Password is required." });

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                @"SELECT UserID, FullName, Email, Role, PasswordHash
                  FROM Users
                  WHERE Email = @Email", connection);
            command.Parameters.AddWithValue("@Email", request.Email);

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    string storedHash = (string)reader["PasswordHash"];

                    // Compare the hash of the typed password with the saved hash
                    if (PasswordHelper.Verify(request.Password, storedHash))
                    {
                        int userId = (int)reader["UserID"];
                        string fullName = (string)reader["FullName"];
                        string email = (string)reader["Email"];
                        string role = (string)reader["Role"];

                        string token = _tokenService.CreateToken(userId, fullName, email, role);

                        return Ok(new
                        {
                            message = "Login successful.",
                            token,
                            user = new { UserID = userId, FullName = fullName, Email = email, Role = role }
                        });
                    }
                }
            }
        }

        // Same message for "email not found" and "wrong password"
        // so an attacker cannot guess which emails exist.
        return Unauthorized(new { message = "Wrong email or password." });
    }
}
