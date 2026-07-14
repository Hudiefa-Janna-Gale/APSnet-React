// Represents one row of the Cart table.
// The last four properties do not exist in the Cart table itself:
// they come from a JOIN with the Products table so the front-end
// can show the product name, price and image of each cart item.
public class Cart
{
    public int CartID { get; set; }

    public int UserID { get; set; }

    public int ProductID { get; set; }

    public int Quantity { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.Now;

    // Extra info from the Products table (filled by a JOIN)
    public string? ProductName { get; set; }

    public decimal Price { get; set; }

    public string? ImageURL { get; set; }

    public string? Category { get; set; }
}
