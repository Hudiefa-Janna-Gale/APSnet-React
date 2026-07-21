public class Order
{
    public int OrderID { get; set; }

    public int UserID { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.Now;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = "Pending";

    public string? CustomerName { get; set; }

    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
}
