using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

// Provides the numbers for the Dashboard / Report page.
// This controller demonstrates ExecuteScalar() (single values)
// and SqlDataAdapter + DataTable (a small report table).
[Authorize(Roles = "Admin")]  // AUTHORIZATION: only Admins can see the reports
[ApiController]
[Route("api/[controller]")]   // => api/reports
public class ReportsController : ControllerBase
{
    private readonly string _connectionString;

    public ReportsController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    // GET: api/reports/summary  -> total counts for the dashboard cards
    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        int totalProducts, totalUsers, totalOrders;
        decimal totalSales;

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            // ExecuteScalar returns exactly one value (first row, first column)
            var productsCommand = new SqlCommand("SELECT COUNT(*) FROM Products", connection);
            totalProducts = (int)productsCommand.ExecuteScalar();

            var usersCommand = new SqlCommand("SELECT COUNT(*) FROM Users", connection);
            totalUsers = (int)usersCommand.ExecuteScalar();

            var ordersCommand = new SqlCommand("SELECT COUNT(*) FROM Orders", connection);
            totalOrders = (int)ordersCommand.ExecuteScalar();

            // ISNULL protects us when there are no orders yet
            var salesCommand = new SqlCommand(
                "SELECT ISNULL(SUM(TotalAmount), 0) FROM Orders", connection);
            totalSales = (decimal)salesCommand.ExecuteScalar();
        }

        return Ok(new { totalProducts, totalUsers, totalOrders, totalSales });
    }

    // GET: api/reports/sales-by-category  -> small report for the chart
    // Here we use SqlDataAdapter + DataTable to fill a whole result at once.
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

            // The adapter opens the connection, runs the query
            // and fills the DataTable for us.
            var adapter = new SqlDataAdapter(command);
            adapter.Fill(table);
        }

        // Convert the DataTable rows into a simple list for JSON
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
