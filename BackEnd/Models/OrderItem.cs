// Represents one row of the OrderItems table.
// ProductName comes from a JOIN with the Products table.
public class OrderItem
{
    public int OrderItemID { get; set; }

    public int OrderID { get; set; }

    public int ProductID { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    // Extra info from the Products table (filled by a JOIN)
    public string? ProductName { get; set; }
}
