// Represents one row of the Orders table.
// CustomerName comes from a JOIN with the Users table,
// and Items is filled when we load one single order with its items.
public class Order
{
    public int OrderID { get; set; }

    public int UserID { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.Now;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = "Pending";

    // Extra info from the Users table (filled by a JOIN)
    public string? CustomerName { get; set; }

    // The products inside this order (filled from the OrderItems table)
    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
}
