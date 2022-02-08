using Polymath.Odin.HAL.Sale;
using Polymath.Odin.HAL.Settings;
using System;
using System.Collections.Generic;

namespace Polymath.Odin.HAL.Receipts.DataModels
{
    public class PreOrderReceiptModel : IReceiptModel
    {
        public PreOrderReceiptModel()
        {
        }

        public PreOrderReceiptModel(OdingSettings settings, Order order)
        {
            Title = settings.PrinterSettings?.Title ?? "მაღაზია";
            OperatorName = order.OperatorName ?? "მოლარე";
            OrderId = order.OrderId;
            OrderItems = order.OrderItems;
            DeviceId = settings.DeviceId ?? "N/A";
            TotalPrice = order.TotalPrice;
            BasketTotalPrice = order.BasketTotalPrice;
            ReceiptNumber = order.ReceiptNumber;
            PaymentType = order.PaymentType;
            TaxAmount = order.TaxAmount;
            TaxRate = order.TaxRate;
            CheckDate = order.CheckDate;
            OrderDate = order.OrderDate;
            TableName = order.TableName;
            SpaceName = order.SpaceName;
            GuestCount = order.GuestCount;
        }

        public string Title { get; set; }

        public string OperatorName { get; set; }

        public string OrderId { get; set; }

        public int ReceiptNumber { get; set; }

        public string DeviceId { get; set; }

        public IEnumerable<OrderItem> OrderItems { get; set; }

        public string RRN { get; set; }

        public PaymentType PaymentType { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal BasketTotalPrice { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TaxRate { get; set; }

        public DateTimeOffset CheckDate { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;

        public string TableName { get; set; }

        public string SpaceName { get; set; }

        public int? GuestCount { get; set; }
    }
}
