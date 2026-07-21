using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController : SecureController
{
    private readonly string _connectionString;
    private readonly ILogger<CartController> _logger;

    public CartController(IConfiguration configuration, ILogger<CartController> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetMyCart()
    {
        var cartItems = new List<Cart>();

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                @"SELECT c.CartID, c.UserID, c.ProductID, c.Quantity, c.AddedAt,
                         p.Name AS ProductName, p.Price, p.ImageURL, p.Category
                  FROM Cart c
                  INNER JOIN Products p ON c.ProductID = p.ProductID
                  WHERE c.UserID = @UserID
                  ORDER BY c.AddedAt DESC", connection);
            command.Parameters.AddWithValue("@UserID", CurrentUserId);

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    cartItems.Add(new Cart
                    {
                        CartID = (int)reader["CartID"],
                        UserID = (int)reader["UserID"],
                        ProductID = (int)reader["ProductID"],
                        Quantity = (int)reader["Quantity"],
                        AddedAt = (DateTime)reader["AddedAt"],
                        ProductName = (string)reader["ProductName"],
                        Price = (decimal)reader["Price"],
                        ImageURL = reader["ImageURL"] as string,
                        Category = reader["Category"] as string
                    });
                }
            }
        }

        return Ok(cartItems);
    }

    [HttpPost]
    public IActionResult AddToCart(Cart item)
    {

        int userId = CurrentUserId;

        if (item.ProductID <= 0)
            return BadRequest(new { message = "ProductID is required." });

        if (item.Quantity <= 0)
            item.Quantity = 1;

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var productExistsCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Products WHERE ProductID = @ProductID", connection);
            productExistsCommand.Parameters.AddWithValue("@ProductID", item.ProductID);

            if ((int)productExistsCommand.ExecuteScalar() == 0)
            {
                _logger.LogWarning("AddToCart rejected: product {ProductID} does not exist (user {UserID})",
                    item.ProductID, userId);
                return NotFound(new { message = "Product not found." });
            }

            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Cart WHERE UserID = @UserID AND ProductID = @ProductID", connection);
            checkCommand.Parameters.AddWithValue("@UserID", userId);
            checkCommand.Parameters.AddWithValue("@ProductID", item.ProductID);

            int existing = (int)checkCommand.ExecuteScalar();

            if (existing > 0)
            {

                var updateCommand = new SqlCommand(
                    @"UPDATE Cart SET Quantity = Quantity + @Quantity
                      WHERE UserID = @UserID AND ProductID = @ProductID", connection);
                updateCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                updateCommand.Parameters.AddWithValue("@UserID", userId);
                updateCommand.Parameters.AddWithValue("@ProductID", item.ProductID);
                updateCommand.ExecuteNonQuery();
            }
            else
            {

                var insertCommand = new SqlCommand(
                    @"INSERT INTO Cart (UserID, ProductID, Quantity)
                      VALUES (@UserID, @ProductID, @Quantity)", connection);
                insertCommand.Parameters.AddWithValue("@UserID", userId);
                insertCommand.Parameters.AddWithValue("@ProductID", item.ProductID);
                insertCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                insertCommand.ExecuteNonQuery();
            }
        }

        return Ok(new { message = "Product added to cart." });
    }

    [HttpPut("{cartId}")]
    public IActionResult UpdateQuantity(int cartId, Cart item)
    {

        if (item.Quantity <= 0)
            return BadRequest(new { message = "Quantity must be at least 1." });

        using (var connection = new SqlConnection(_connectionString))
        {

            var command = new SqlCommand(
                "UPDATE Cart SET Quantity = @Quantity WHERE CartID = @CartID AND UserID = @UserID", connection);
            command.Parameters.AddWithValue("@Quantity", item.Quantity);
            command.Parameters.AddWithValue("@CartID", cartId);
            command.Parameters.AddWithValue("@UserID", CurrentUserId);

            connection.Open();
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Cart item not found." });
        }

        return Ok(new { message = "Quantity updated." });
    }

    [HttpDelete("{cartId}")]
    public IActionResult RemoveFromCart(int cartId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {

            var command = new SqlCommand(
                "DELETE FROM Cart WHERE CartID = @CartID AND UserID = @UserID", connection);
            command.Parameters.AddWithValue("@CartID", cartId);
            command.Parameters.AddWithValue("@UserID", CurrentUserId);

            connection.Open();
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Cart item not found." });
        }

        return Ok(new { message = "Item removed from cart." });
    }

    [HttpDelete]
    public IActionResult ClearMyCart()
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "DELETE FROM Cart WHERE UserID = @UserID", connection);
            command.Parameters.AddWithValue("@UserID", CurrentUserId);

            connection.Open();
            command.ExecuteNonQuery();
        }

        return Ok(new { message = "Cart cleared." });
    }
}
