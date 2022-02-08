using System;
using System.Collections.Generic;

namespace Polymath.Odin.HAL.Sale
{
    public class Order
    {
        public string OrderId { get; set; } = "";
        public int ReceiptNumber { get; set; }
        public IEnumerable<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public decimal TotalPrice { get; set; } = 0;
        public decimal BasketTotalPrice { get; set; } = 0;
        public decimal TaxAmount { get; set; } = 0;
        public decimal TaxRate { get; set; } = 0;
        public PaymentType PaymentType { get; set; } = PaymentType.Cash;
        public bool IsDetailed { get; set; } = false;
        public string OperatorName { get; set; }
        public DateTimeOffset CheckDate { get; set; } = DateTimeOffset.Now;
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public string TableName { get; set; }
        public string SpaceName { get; set; }
        public int? GuestCount { get; set; }
    }
}
