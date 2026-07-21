using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly string _connectionString;

    public ReportsController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        int totalProducts, totalUsers, totalOrders;
        decimal totalSales;

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            var productsCommand = new SqlCommand("SELECT COUNT(*) FROM Products", connection);
            totalProducts = (int)productsCommand.ExecuteScalar();

            var usersCommand = new SqlCommand("SELECT COUNT(*) FROM Users", connection);
            totalUsers = (int)usersCommand.ExecuteScalar();

            var ordersCommand = new SqlCommand("SELECT COUNT(*) FROM Orders", connection);
            totalOrders = (int)ordersCommand.ExecuteScalar();

            var salesCommand = new SqlCommand(
                "SELECT ISNULL(SUM(TotalAmount), 0) FROM Orders", connection);
            totalSales = (decimal)salesCommand.ExecuteScalar();
        }

        return Ok(new { totalProducts, totalUsers, totalOrders, totalSales });
    }

    [HttpGet("sales-by-category")]
    public IActionResult GetSalesByCategory()
    {
        var table = new DataTable();

        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand(
                @"SELECT p.Category AS Name,
                         SUM(oi.Quantity * oi.UnitPrice) AS Sales
                  FROM OrderItems oi
                  INNER JOIN Products p ON oi.ProductID = p.ProductID
                  GROUP BY p.Category
                  ORDER BY Sales DESC", connection);

            var adapter = new SqlDataAdapter(command);
            adapter.Fill(table);
        }

        var result = new List<object>();
        foreach (DataRow row in table.Rows)
        {
            result.Add(new
            {
                name = row["Name"] == DBNull.Value ? "Other" : (string)row["Name"],
                sales = (decimal)row["Sales"]
            });
        }

        return Ok(result);
    }
}
