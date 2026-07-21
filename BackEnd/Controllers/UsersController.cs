using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly string _connectionString;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IConfiguration configuration, ILogger<UsersController> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = new List<object>();

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "SELECT UserID, FullName, Email, Role, CreatedAt FROM Users ORDER BY UserID", connection);

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    users.Add(new
                    {
                        UserID = (int)reader["UserID"],
                        FullName = (string)reader["FullName"],
                        Email = (string)reader["Email"],
                        Role = (string)reader["Role"],
                        CreatedAt = (DateTime)reader["CreatedAt"]
                    });
                }
            }
        }

        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetUserById(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "SELECT UserID, FullName, Email, Role, CreatedAt FROM Users WHERE UserID = @UserID", connection);
            command.Parameters.AddWithValue("@UserID", id);

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return Ok(new
                    {
                        UserID = (int)reader["UserID"],
                        FullName = (string)reader["FullName"],
                        Email = (string)reader["Email"],
                        Role = (string)reader["Role"],
                        CreatedAt = (DateTime)reader["CreatedAt"]
                    });
                }
            }
        }

        return NotFound(new { message = "User not found." });
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, User user)
    {

        if (string.IsNullOrWhiteSpace(user.FullName))
            return BadRequest(new { message = "Full name is required." });

        if (string.IsNullOrWhiteSpace(user.Email) || !user.Email.Contains("@"))
            return BadRequest(new { message = "A valid email address is required." });

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Users WHERE Email = @Email AND UserID <> @UserID", connection);
            checkCommand.Parameters.AddWithValue("@Email", user.Email);
            checkCommand.Parameters.AddWithValue("@UserID", id);

            int existing = (int)checkCommand.ExecuteScalar();
            if (existing > 0)
                return BadRequest(new { message = "Another user already uses this email." });

            var updateCommand = new SqlCommand(
                @"UPDATE Users
                  SET FullName = @FullName, Email = @Email, Role = @Role
                  WHERE UserID = @UserID", connection);

            updateCommand.Parameters.AddWithValue("@FullName", user.FullName);
            updateCommand.Parameters.AddWithValue("@Email", user.Email);
            updateCommand.Parameters.AddWithValue("@Role", string.IsNullOrWhiteSpace(user.Role) ? "Customer" : user.Role);
            updateCommand.Parameters.AddWithValue("@UserID", id);

            int rowsAffected = updateCommand.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "User not found." });
        }

        return Ok(new { message = "User updated successfully." });
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var roleCommand = new SqlCommand(
                "SELECT Role FROM Users WHERE UserID = @UserID", connection);
            roleCommand.Parameters.AddWithValue("@UserID", id);
            var role = roleCommand.ExecuteScalar() as string;

            if (role is null)
                return NotFound(new { message = "User not found." });

            if (role == "Admin")
            {
                _logger.LogWarning("Blocked attempt to delete admin user {UserID}", id);
                return BadRequest(new { message = "Admin accounts cannot be deleted." });
            }

            var deleteCartCommand = new SqlCommand(
                "DELETE FROM Cart WHERE UserID = @UserID", connection);
            deleteCartCommand.Parameters.AddWithValue("@UserID", id);
            deleteCartCommand.ExecuteNonQuery();

            var deleteCommand = new SqlCommand(
                "DELETE FROM Users WHERE UserID = @UserID", connection);
            deleteCommand.Parameters.AddWithValue("@UserID", id);

            try
            {
                int rowsAffected = deleteCommand.ExecuteNonQuery();

                if (rowsAffected == 0)
                    return NotFound(new { message = "User not found." });
            }
            catch (SqlException ex)
            {

                _logger.LogWarning(ex, "Delete blocked for user {UserID} (referenced by existing orders)", id);
                return BadRequest(new { message = "This user cannot be deleted because they have existing orders." });
            }
        }

        return Ok(new { message = "User deleted successfully." });
    }
}
