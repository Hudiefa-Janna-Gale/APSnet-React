using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

// Handles everything about Products:
// list, get one, search by name, create, update and delete.
// READING is open to everyone (the shop must show products),
// but CREATE / UPDATE / DELETE are Admin-only.
// Every database operation uses ADO.NET (SqlConnection + SqlCommand).
[ApiController]
[Route("api/[controller]")]   // => api/products
public class ProductsController : ControllerBase
{
    private readonly string _connectionString;

    public ProductsController(IConfiguration configuration)
    {
        // Read the connection string from appsettings.json
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    // Helper: turn the current row of a SqlDataReader into a Product object
    private static Product ReadProduct(SqlDataReader reader)
    {
        return new Product
        {
            ProductID = (int)reader["ProductID"],
            Name = (string)reader["Name"],
            Description = reader["Description"] as string,
            Price = (decimal)reader["Price"],
            StockQuantity = (int)reader["StockQuantity"],
            Category = reader["Category"] as string,
            ImageURL = reader["ImageURL"] as string,
            CreatedAt = (DateTime)reader["CreatedAt"]
        };
    }

    // GET: api/products  -> all products
    [HttpGet]
    public IActionResult GetAllProducts()
    {
        var products = new List<Product>();

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "SELECT * FROM Products ORDER BY ProductID DESC", connection);

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    products.Add(ReadProduct(reader));
                }
            }
        }

        return Ok(products);
    }

    // GET: api/products/5  -> one product by id
    [HttpGet("{id}")]
    public IActionResult GetProductById(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                "SELECT * FROM Products WHERE ProductID = @ProductID", connection);
            command.Parameters.AddWithValue("@ProductID", id);

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return Ok(ReadProduct(reader));
                }
            }
        }

        return NotFound(new { message = "Product not found." });
    }

    // GET: api/products/search?name=shirt  -> search products by name
    [HttpGet("search")]
    public IActionResult SearchProducts(string? name)
    {
        var products = new List<Product>();

        using (var connection = new SqlConnection(_connectionString))
        {
            // LIKE with % on both sides = "contains" search
            var command = new SqlCommand(
                "SELECT * FROM Products WHERE Name LIKE @Name ORDER BY Name", connection);
            command.Parameters.AddWithValue("@Name", "%" + (name ?? "") + "%");

            connection.Open();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    products.Add(ReadProduct(reader));
                }
            }
        }

        return Ok(products);
    }

    // POST: api/products  -> create a new product (Admin only)
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public IActionResult CreateProduct(Product product)
    {
        // --- Server side validation ---
        if (string.IsNullOrWhiteSpace(product.Name))
            return BadRequest(new { message = "Product name is required." });

        if (product.Price <= 0)
            return BadRequest(new { message = "Price must be greater than zero." });

        if (product.StockQuantity < 0)
            return BadRequest(new { message = "Stock quantity cannot be negative." });

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // --- Duplicate check: is there already a product with this name? ---
            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Products WHERE Name = @Name", connection);
            checkCommand.Parameters.AddWithValue("@Name", product.Name);

            int existing = (int)checkCommand.ExecuteScalar();
            if (existing > 0)
                return BadRequest(new { message = "A product with this name already exists." });

            // --- Insert the new product and get its new ID back ---
            var insertCommand = new SqlCommand(
                @"INSERT INTO Products (Name, Description, Price, StockQuantity, Category, ImageURL)
                  VALUES (@Name, @Description, @Price, @StockQuantity, @Category, @ImageURL);
                  SELECT CAST(SCOPE_IDENTITY() AS INT);", connection);

            insertCommand.Parameters.AddWithValue("@Name", product.Name);
            insertCommand.Parameters.AddWithValue("@Description", (object?)product.Description ?? DBNull.Value);
            insertCommand.Parameters.AddWithValue("@Price", product.Price);
            insertCommand.Parameters.AddWithValue("@StockQuantity", product.StockQuantity);
            insertCommand.Parameters.AddWithValue("@Category", (object?)product.Category ?? DBNull.Value);
            insertCommand.Parameters.AddWithValue("@ImageURL", (object?)product.ImageURL ?? DBNull.Value);

            int newId = (int)insertCommand.ExecuteScalar();
            product.ProductID = newId;
        }

        return Ok(new { message = "Product created successfully.", product });
    }

    // PUT: api/products/5  -> update an existing product (Admin only)
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public IActionResult UpdateProduct(int id, Product product)
    {
        // --- Server side validation ---
        if (string.IsNullOrWhiteSpace(product.Name))
            return BadRequest(new { message = "Product name is required." });

        if (product.Price <= 0)
            return BadRequest(new { message = "Price must be greater than zero." });

        if (product.StockQuantity < 0)
            return BadRequest(new { message = "Stock quantity cannot be negative." });

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // Duplicate check: another product (different id) with the same name?
            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Products WHERE Name = @Name AND ProductID <> @ProductID", connection);
            checkCommand.Parameters.AddWithValue("@Name", product.Name);
            checkCommand.Parameters.AddWithValue("@ProductID", id);

            int existing = (int)checkCommand.ExecuteScalar();
            if (existing > 0)
                return BadRequest(new { message = "Another product with this name already exists." });

            var updateCommand = new SqlCommand(
                @"UPDATE Products
                  SET Name = @Name,
                      Description = @Description,
                      Price = @Price,
                      StockQuantity = @StockQuantity,
                      Category = @Category,
                      ImageURL = @ImageURL
                  WHERE ProductID = @ProductID", connection);

            updateCommand.Parameters.AddWithValue("@Name", product.Name);
            updateCommand.Parameters.AddWithValue("@Description", (object?)product.Description ?? DBNull.Value);
            updateCommand.Parameters.AddWithValue("@Price", product.Price);
            updateCommand.Parameters.AddWithValue("@StockQuantity", product.StockQuantity);
            updateCommand.Parameters.AddWithValue("@Category", (object?)product.Category ?? DBNull.Value);
            updateCommand.Parameters.AddWithValue("@ImageURL", (object?)product.ImageURL ?? DBNull.Value);
            updateCommand.Parameters.AddWithValue("@ProductID", id);

            int rowsAffected = updateCommand.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Product not found." });
        }

        return Ok(new { message = "Product updated successfully." });
    }

    // DELETE: api/products/5  -> delete a product (Admin only)
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public IActionResult DeleteProduct(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // First remove it from any shopping cart (foreign key)
            var deleteCartCommand = new SqlCommand(
                "DELETE FROM Cart WHERE ProductID = @ProductID", connection);
            deleteCartCommand.Parameters.AddWithValue("@ProductID", id);
            deleteCartCommand.ExecuteNonQuery();

            var deleteCommand = new SqlCommand(
                "DELETE FROM Products WHERE ProductID = @ProductID", connection);
            deleteCommand.Parameters.AddWithValue("@ProductID", id);

            try
            {
                int rowsAffected = deleteCommand.ExecuteNonQuery();

                if (rowsAffected == 0)
                    return NotFound(new { message = "Product not found." });
            }
            catch (SqlException)
            {
                // The product is used inside an old order, so we cannot delete it
                return BadRequest(new { message = "This product cannot be deleted because it belongs to existing orders." });
            }
        }

        return Ok(new { message = "Product deleted successfully." });
    }
}
