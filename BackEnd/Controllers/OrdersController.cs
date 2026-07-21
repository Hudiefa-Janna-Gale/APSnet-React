using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : SecureController
{
    private readonly string _connectionString;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IConfiguration configuration, ILogger<OrdersController> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        _logger = logger;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public IActionResult GetAllOrders()
    {
        var orders = new List<Order>();

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                @"SELECT o.OrderID, o.UserID, o.OrderDate, o.TotalAmount, o.Status,
                         u.FullName AS CustomerName
                  FROM Orders o
                  INNER JOIN Users u ON o.UserID = u.UserID
                  ORDER BY o.OrderDate DESC", connection);

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    orders.Add(new Order
                    {
                        OrderID = (int)reader["OrderID"],
                        UserID = (int)reader["UserID"],
                        OrderDate = (DateTime)reader["OrderDate"],
                        TotalAmount = (decimal)reader["TotalAmount"],
                        Status = (string)reader["Status"],
                        CustomerName = (string)reader["CustomerName"]
                    });
                }
            }
        }

        return Ok(orders);
    }

    [HttpGet("mine")]
    public IActionResult GetMyOrders()
    {
        var orders = new List<Order>();

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var command = new SqlCommand(
                @"SELECT o.OrderID, o.UserID, o.OrderDate, o.TotalAmount, o.Status,
                         u.FullName AS CustomerName
                  FROM Orders o
                  INNER JOIN Users u ON o.UserID = u.UserID
                  WHERE o.UserID = @UserID
                  ORDER BY o.OrderDate DESC", connection);
            command.Parameters.AddWithValue("@UserID", CurrentUserId);

            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    orders.Add(new Order
                    {
                        OrderID = (int)reader["OrderID"],
                        UserID = (int)reader["UserID"],
                        OrderDate = (DateTime)reader["OrderDate"],
                        TotalAmount = (decimal)reader["TotalAmount"],
                        Status = (string)reader["Status"],
                        CustomerName = (string)reader["CustomerName"]
                    });
                }
            }

            foreach (var order in orders)
            {
                var itemsCommand = new SqlCommand(
                    @"SELECT oi.OrderItemID, oi.OrderID, oi.ProductID, oi.Quantity, oi.UnitPrice,
                             p.Name AS ProductName
                      FROM OrderItems oi
                      INNER JOIN Products p ON oi.ProductID = p.ProductID
                      WHERE oi.OrderID = @OrderID", connection);
                itemsCommand.Parameters.AddWithValue("@OrderID", order.OrderID);

                using (SqlDataReader reader = itemsCommand.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        order.Items.Add(new OrderItem
                        {
                            OrderItemID = (int)reader["OrderItemID"],
                            OrderID = (int)reader["OrderID"],
                            ProductID = (int)reader["ProductID"],
                            Quantity = (int)reader["Quantity"],
                            UnitPrice = (decimal)reader["UnitPrice"],
                            ProductName = (string)reader["ProductName"]
                        });
                    }
                }
            }
        }

        return Ok(orders);
    }

    [HttpGet("{id}")]
    public IActionResult GetOrderById(int id)
    {
        Order? order = null;

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var orderCommand = new SqlCommand(
                @"SELECT o.OrderID, o.UserID, o.OrderDate, o.TotalAmount, o.Status,
                         u.FullName AS CustomerName
                  FROM Orders o
                  INNER JOIN Users u ON o.UserID = u.UserID
                  WHERE o.OrderID = @OrderID", connection);
            orderCommand.Parameters.AddWithValue("@OrderID", id);

            using (SqlDataReader reader = orderCommand.ExecuteReader())
            {
                if (reader.Read())
                {
                    order = new Order
                    {
                        OrderID = (int)reader["OrderID"],
                        UserID = (int)reader["UserID"],
                        OrderDate = (DateTime)reader["OrderDate"],
                        TotalAmount = (decimal)reader["TotalAmount"],
                        Status = (string)reader["Status"],
                        CustomerName = (string)reader["CustomerName"]
                    };
                }
            }

            if (order == null)
                return NotFound(new { message = "Order not found." });

            if (!IsAdmin && order.UserID != CurrentUserId)
                return Forbid();

            var itemsCommand = new SqlCommand(
                @"SELECT oi.OrderItemID, oi.OrderID, oi.ProductID, oi.Quantity, oi.UnitPrice,
                         p.Name AS ProductName
                  FROM OrderItems oi
                  INNER JOIN Products p ON oi.ProductID = p.ProductID
                  WHERE oi.OrderID = @OrderID", connection);
            itemsCommand.Parameters.AddWithValue("@OrderID", id);

            using (SqlDataReader reader = itemsCommand.ExecuteReader())
            {
                while (reader.Read())
                {
                    order.Items.Add(new OrderItem
                    {
                        OrderItemID = (int)reader["OrderItemID"],
                        OrderID = (int)reader["OrderID"],
                        ProductID = (int)reader["ProductID"],
                        Quantity = (int)reader["Quantity"],
                        UnitPrice = (decimal)reader["UnitPrice"],
                        ProductName = (string)reader["ProductName"]
                    });
                }
            }
        }

        return Ok(order);
    }

    [HttpPost("checkout")]
    public IActionResult Checkout()
    {
        int userId = CurrentUserId;
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            using (SqlTransaction transaction = connection.BeginTransaction())
            {
                try
                {

                    var cartItems = new List<Cart>();

                    var cartCommand = new SqlCommand(
                        @"SELECT c.ProductID, c.Quantity, p.Price
                          FROM Cart c
                          INNER JOIN Products p ON c.ProductID = p.ProductID
                          WHERE c.UserID = @UserID", connection, transaction);
                    cartCommand.Parameters.AddWithValue("@UserID", userId);

                    using (SqlDataReader reader = cartCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            cartItems.Add(new Cart
                            {
                                ProductID = (int)reader["ProductID"],
                                Quantity = (int)reader["Quantity"],
                                Price = (decimal)reader["Price"]
                            });
                        }
                    }

                    if (cartItems.Count == 0)
                        return BadRequest(new { message = "The cart is empty. Add products before checkout." });

                    decimal totalAmount = 0;
                    foreach (var item in cartItems)
                    {
                        totalAmount += item.Price * item.Quantity;
                    }

                    var orderCommand = new SqlCommand(
                        @"INSERT INTO Orders (UserID, TotalAmount, Status)
                          VALUES (@UserID, @TotalAmount, 'Pending');
                          SELECT CAST(SCOPE_IDENTITY() AS INT);", connection, transaction);
                    orderCommand.Parameters.AddWithValue("@UserID", userId);
                    orderCommand.Parameters.AddWithValue("@TotalAmount", totalAmount);

                    int newOrderId = (int)orderCommand.ExecuteScalar();

                    foreach (var item in cartItems)
                    {
                        var itemCommand = new SqlCommand(
                            @"INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice)
                              VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice)", connection, transaction);
                        itemCommand.Parameters.AddWithValue("@OrderID", newOrderId);
                        itemCommand.Parameters.AddWithValue("@ProductID", item.ProductID);
                        itemCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                        itemCommand.Parameters.AddWithValue("@UnitPrice", item.Price);
                        itemCommand.ExecuteNonQuery();
                    }

                    var clearCommand = new SqlCommand(
                        "DELETE FROM Cart WHERE UserID = @UserID", connection, transaction);
                    clearCommand.Parameters.AddWithValue("@UserID", userId);
                    clearCommand.ExecuteNonQuery();

                    transaction.Commit();

                    return Ok(new
                    {
                        message = "Order placed successfully!",
                        orderId = newOrderId,
                        totalAmount
                    });
                }
                catch (Exception ex)
                {

                    _logger.LogError(ex, "Checkout failed for user {UserId}", userId);
                    transaction.Rollback();
                    return StatusCode(500, new { message = "Checkout failed. Please try again." });
                }
            }
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public IActionResult UpdateStatus(int id, Order order)
    {

        var allowedStatuses = new[] { "Pending", "Completed", "Cancelled" };
        if (!allowedStatuses.Contains(order.Status))
            return BadRequest(new { message = "Status must be Pending, Completed or Cancelled." });

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "UPDATE Orders SET Status = @Status WHERE OrderID = @OrderID", connection);
            command.Parameters.AddWithValue("@Status", order.Status);
            command.Parameters.AddWithValue("@OrderID", id);

            connection.Open();
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Order not found." });
        }

        return Ok(new { message = "Order status updated." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public IActionResult DeleteOrder(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "DELETE FROM Orders WHERE OrderID = @OrderID", connection);
            command.Parameters.AddWithValue("@OrderID", id);

            connection.Open();
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Order not found." });
        }

        return Ok(new { message = "Order deleted successfully." });
    }
}
