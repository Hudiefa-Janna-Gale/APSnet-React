using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

// Handles Orders: list all orders, load one order with its items,
// checkout (turn a user's cart into a real order), update the status
// and delete an order.
// Every database operation uses ADO.NET (SqlConnection + SqlCommand).
[Authorize]                   // AUTHORIZATION: you must be logged in to work with orders
[ApiController]
[Route("api/[controller]")]   // => api/orders
public class OrdersController : ControllerBase
{
    private readonly string _connectionString;

    public OrdersController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    // GET: api/orders  -> all orders with the customer's name
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

    // GET: api/orders/1  -> one order together with its items
    [HttpGet("{id}")]
    public IActionResult GetOrderById(int id)
    {
        Order? order = null;

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // 1) Load the order itself
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

            // 2) Load the items of this order
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

    // POST: api/orders/checkout/2  -> turn the user's cart into an order
    // Steps: read the cart, calculate the total, create the order,
    // copy the cart rows into OrderItems, then empty the cart.
    [HttpPost("checkout/{userId}")]
    public IActionResult Checkout(int userId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // A transaction makes sure all steps succeed together or not at all
            using (SqlTransaction transaction = connection.BeginTransaction())
            {
                try
                {
                    // 1) Read the user's cart (with the current product prices)
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

                    // 2) Calculate the total amount
                    decimal totalAmount = 0;
                    foreach (var item in cartItems)
                    {
                        totalAmount += item.Price * item.Quantity;
                    }

                    // 3) Create the order and get the new OrderID
                    var orderCommand = new SqlCommand(
                        @"INSERT INTO Orders (UserID, TotalAmount, Status)
                          VALUES (@UserID, @TotalAmount, 'Pending');
                          SELECT CAST(SCOPE_IDENTITY() AS INT);", connection, transaction);
                    orderCommand.Parameters.AddWithValue("@UserID", userId);
                    orderCommand.Parameters.AddWithValue("@TotalAmount", totalAmount);

                    int newOrderId = (int)orderCommand.ExecuteScalar();

                    // 4) Copy every cart row into the OrderItems table
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

                    // 5) Empty the user's cart
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
                catch
                {
                    // Something went wrong -> undo everything
                    transaction.Rollback();
                    return StatusCode(500, new { message = "Checkout failed. Please try again." });
                }
            }
        }
    }

    // PUT: api/orders/1/status  -> change the status of an order
    [HttpPut("{id}/status")]
    public IActionResult UpdateStatus(int id, Order order)
    {
        // --- Server side validation ---
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

    // DELETE: api/orders/1  -> delete an order
    // (OrderItems are removed automatically thanks to ON DELETE CASCADE)
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
