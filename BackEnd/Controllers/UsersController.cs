using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

// Handles Users: list, get one, update and delete.
// (Register and Login moved to AuthController => api/auth)
// Every database operation uses ADO.NET (SqlConnection + SqlCommand).
[Authorize(Roles = "Admin")]  // AUTHORIZATION: only Admins can manage users
[ApiController]
[Route("api/[controller]")]   // => api/users
public class UsersController : ControllerBase
{
    private readonly string _connectionString;

    public UsersController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    // GET: api/users  -> all users (we never return the password)
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

    // GET: api/users/5  -> one user by id
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

    // PUT: api/users/5  -> update a user's name / email / role
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, User user)
    {
        // --- Server side validation ---
        if (string.IsNullOrWhiteSpace(user.FullName))
            return BadRequest(new { message = "Full name is required." });

        if (string.IsNullOrWhiteSpace(user.Email) || !user.Email.Contains("@"))
            return BadRequest(new { message = "A valid email address is required." });

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // Duplicate check: another user with the same email?
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

    // DELETE: api/users/5  -> delete a user
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // First empty this user's shopping cart (foreign key)
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
            catch (SqlException)
            {
                // The user still has orders, so we cannot delete them
                return BadRequest(new { message = "This user cannot be deleted because they have existing orders." });
            }
        }

        return Ok(new { message = "User deleted successfully." });
    }
}
