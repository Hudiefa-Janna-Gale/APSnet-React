public class Cart
{
    public int CartID { get; set; }

    public int UserID { get; set; }

    public int ProductID { get; set; }

    public int Quantity { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.Now;

    public string? ProductName { get; set; }

    public decimal Price { get; set; }

    public string? ImageURL { get; set; }

    public string? Category { get; set; }
}
