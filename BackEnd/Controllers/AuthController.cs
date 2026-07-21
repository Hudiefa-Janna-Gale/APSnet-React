using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly string _connectionString;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, TokenService tokenService, ILogger<AuthController> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        _tokenService = tokenService;
        _logger = logger;
    }

    [HttpPost("register")]
    public IActionResult Register(User user)
    {

        if (string.IsNullOrWhiteSpace(user.FullName))
            return BadRequest(new { message = "Full name is required." });

        if (string.IsNullOrWhiteSpace(user.Email) || !user.Email.Contains("@"))
            return BadRequest(new { message = "A valid email address is required." });

        if (string.IsNullOrWhiteSpace(user.PasswordHash) || user.PasswordHash.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters." });

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Users WHERE Email = @Email", connection);
            checkCommand.Parameters.AddWithValue("@Email", user.Email);

            int existing = (int)checkCommand.ExecuteScalar();
            if (existing > 0)
                return BadRequest(new { message = "This email is already registered." });

            var insertCommand = new SqlCommand(
                @"INSERT INTO Users (FullName, Email, PasswordHash, Role)
                  VALUES (@FullName, @Email, @PasswordHash, 'Customer');
                  SELECT CAST(SCOPE_IDENTITY() AS INT);", connection);

            insertCommand.Parameters.AddWithValue("@FullName", user.FullName);
            insertCommand.Parameters.AddWithValue("@Email", user.Email);

            insertCommand.Parameters.AddWithValue("@PasswordHash", PasswordHelper.Hash(user.PasswordHash));

            int newId = (int)insertCommand.ExecuteScalar();

            string token = _tokenService.CreateToken(newId, user.FullName, user.Email, "Customer");

            return Ok(new
            {
                message = "Account created successfully.",
                token,
                user = new { UserID = newId, user.FullName, user.Email, Role = "Customer" }
            });
        }
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {

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

            int userId = 0;
            string fullName = "", email = "", role = "", storedHash = "";
            bool found = false;

            using (SqlDataReader reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    found = true;
                    userId = (int)reader["UserID"];
                    fullName = (string)reader["FullName"];
                    email = (string)reader["Email"];
                    role = (string)reader["Role"];
                    storedHash = (string)reader["PasswordHash"];
                }
            }

            if (found && PasswordHelper.Verify(request.Password, storedHash))
            {

                if (PasswordHelper.NeedsUpgrade(storedHash))
                {
                    var upgradeCommand = new SqlCommand(
                        "UPDATE Users SET PasswordHash = @Hash WHERE UserID = @UserID", connection);
                    upgradeCommand.Parameters.AddWithValue("@Hash", PasswordHelper.Hash(request.Password));
                    upgradeCommand.Parameters.AddWithValue("@UserID", userId);
                    upgradeCommand.ExecuteNonQuery();
                    _logger.LogInformation("Upgraded password hash to BCrypt for user {UserId}", userId);
                }

                string token = _tokenService.CreateToken(userId, fullName, email, role);

                return Ok(new
                {
                    message = "Login successful.",
                    token,
                    user = new { UserID = userId, FullName = fullName, Email = email, Role = role }
                });
            }
        }

        _logger.LogWarning("Failed login attempt for email {Email}", request.Email);
        return Unauthorized(new { message = "Wrong email or password." });
    }
}
