using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly string _connectionString;
    private readonly ILogger<ProductsController> _logger;
    private readonly CloudinaryService _cloudinary;

    public ProductsController(
        IConfiguration configuration,
        ILogger<ProductsController> logger,
        CloudinaryService cloudinary)
    {

        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        _logger = logger;
        _cloudinary = cloudinary;
    }

    private string? GetImageUrl(SqlConnection connection, int productId)
    {
        var cmd = new SqlCommand(
            "SELECT ImageURL FROM Products WHERE ProductID = @ProductID", connection);
        cmd.Parameters.AddWithValue("@ProductID", productId);
        return cmd.ExecuteScalar() as string;
    }

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

    [HttpGet("search")]
    public IActionResult SearchProducts(string? name)
    {
        var products = new List<Product>();

        using (var connection = new SqlConnection(_connectionString))
        {

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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public IActionResult CreateProduct(Product product)
    {

        if (string.IsNullOrWhiteSpace(product.Name))
            return BadRequest(new { message = "Product name is required." });

        if (product.Price <= 0)
            return BadRequest(new { message = "Price must be greater than zero." });

        if (product.StockQuantity < 0)
            return BadRequest(new { message = "Stock quantity cannot be negative." });

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var checkCommand = new SqlCommand(
                "SELECT COUNT(*) FROM Products WHERE Name = @Name", connection);
            checkCommand.Parameters.AddWithValue("@Name", product.Name);

            int existing = (int)checkCommand.ExecuteScalar();
            if (existing > 0)
                return BadRequest(new { message = "A product with this name already exists." });

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

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {

        if (string.IsNullOrWhiteSpace(product.Name))
            return BadRequest(new { message = "Product name is required." });

        if (product.Price <= 0)
            return BadRequest(new { message = "Price must be greater than zero." });

        if (product.StockQuantity < 0)
            return BadRequest(new { message = "Stock quantity cannot be negative." });

        string? oldImageUrl = null;

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            oldImageUrl = GetImageUrl(connection, id);

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

        if (!string.IsNullOrEmpty(oldImageUrl) && oldImageUrl != product.ImageURL)
        {
            try { await _cloudinary.DeleteByUrlAsync(oldImageUrl); }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not delete old Cloudinary image for product {ProductID}", id);
            }
        }

        return Ok(new { message = "Product updated successfully." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        string? imageUrl = null;

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            imageUrl = GetImageUrl(connection, id);

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
            catch (SqlException ex)
            {

                _logger.LogWarning(ex, "Delete blocked for product {ProductID} (referenced by existing orders)", id);
                return BadRequest(new { message = "This product cannot be deleted because it belongs to existing orders." });
            }
        }

        if (!string.IsNullOrEmpty(imageUrl))
        {
            try { await _cloudinary.DeleteByUrlAsync(imageUrl); }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not delete Cloudinary image for product {ProductID}", id);
            }
        }

        return Ok(new { message = "Product deleted successfully." });
    }
}
