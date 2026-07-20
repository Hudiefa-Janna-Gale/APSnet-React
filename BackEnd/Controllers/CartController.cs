using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

// Handles the shopping cart: view a user's cart, add a product,
// change the quantity, remove one item, or clear the whole cart.
// Every database operation uses ADO.NET (SqlConnection + SqlCommand).
[Authorize]                   // AUTHORIZATION: you must be logged in to use the cart
[ApiController]
[Route("api/[controller]")]   // => api/cart
public class CartController : ControllerBase
{
    private readonly string _connectionString;

    public CartController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    // GET: api/cart/user/2  -> all cart items of one user
    // We JOIN with Products so the front-end also gets name, price and image.
    [HttpGet("user/{userId}")]
    public IActionResult GetCartByUser(int userId)
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
            command.Parameters.AddWithValue("@UserID", userId);

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

    // POST: api/cart  -> add a product to a user's cart
    // If the product is already in the cart we just increase the quantity.
    [HttpPost]
    public IActionResult AddToCart(Cart item)
    {
        // --- Server side validation ---
        if (item.UserID <= 0 || item.ProductID <= 0)
            return BadRequest(new { message = "UserID and ProductID are required." });

        if (item.Quantity <= 0)
            item.Quantity = 1;   // default quantity

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // Is this product already in the user's cart?
            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Cart WHERE UserID = @UserID AND ProductID = @ProductID", connection);
            checkCommand.Parameters.AddWithValue("@UserID", item.UserID);
            checkCommand.Parameters.AddWithValue("@ProductID", item.ProductID);

            int existing = (int)checkCommand.ExecuteScalar();

            if (existing > 0)
            {
                // Already in the cart -> increase the quantity
                var updateCommand = new SqlCommand(
                    @"UPDATE Cart SET Quantity = Quantity + @Quantity
                      WHERE UserID = @UserID AND ProductID = @ProductID", connection);
                updateCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                updateCommand.Parameters.AddWithValue("@UserID", item.UserID);
                updateCommand.Parameters.AddWithValue("@ProductID", item.ProductID);
                updateCommand.ExecuteNonQuery();
            }
            else
            {
                // Not in the cart yet -> insert a new row
                var insertCommand = new SqlCommand(
                    @"INSERT INTO Cart (UserID, ProductID, Quantity)
                      VALUES (@UserID, @ProductID, @Quantity)", connection);
                insertCommand.Parameters.AddWithValue("@UserID", item.UserID);
                insertCommand.Parameters.AddWithValue("@ProductID", item.ProductID);
                insertCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                insertCommand.ExecuteNonQuery();
            }
        }

        return Ok(new { message = "Product added to cart." });
    }

    // PUT: api/cart/7  -> change the quantity of one cart item
    [HttpPut("{cartId}")]
    public IActionResult UpdateQuantity(int cartId, Cart item)
    {
        // --- Server side validation ---
        if (item.Quantity <= 0)
            return BadRequest(new { message = "Quantity must be at least 1." });

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "UPDATE Cart SET Quantity = @Quantity WHERE CartID = @CartID", connection);
            command.Parameters.AddWithValue("@Quantity", item.Quantity);
            command.Parameters.AddWithValue("@CartID", cartId);

            connection.Open();
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Cart item not found." });
        }

        return Ok(new { message = "Quantity updated." });
    }

    // DELETE: api/cart/7  -> remove one item from the cart
    [HttpDelete("{cartId}")]
    public IActionResult RemoveFromCart(int cartId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "DELETE FROM Cart WHERE CartID = @CartID", connection);
            command.Parameters.AddWithValue("@CartID", cartId);

            connection.Open();
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Cart item not found." });
        }

        return Ok(new { message = "Item removed from cart." });
    }

    // DELETE: api/cart/user/2  -> empty the whole cart of one user
    [HttpDelete("user/{userId}")]
    public IActionResult ClearCart(int userId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "DELETE FROM Cart WHERE UserID = @UserID", connection);
            command.Parameters.AddWithValue("@UserID", userId);

            connection.Open();
            command.ExecuteNonQuery();
        }

        return Ok(new { message = "Cart cleared." });
    }
}
