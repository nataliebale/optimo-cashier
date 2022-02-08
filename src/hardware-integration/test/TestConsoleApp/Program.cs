using Polymath.Odin.DaisyExpert;
using Polymath.Odin.HAL.CashierService.DaisyExpert;
using Polymath.Odin.HAL.Sale;
using Polymath.Odin.HAL.Settings;
using Polymath.Odin.KasaGE;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace TestConsoleApp
{
    class Program
    {

        static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.File(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "odin", "log-dll-.txt"), rollingInterval: RollingInterval.Day)
                .CreateLogger();

            Job().GetAwaiter().GetResult();
        }

        static async Task Job()
        {
            var odin = new Polymath.Odin.HAL.NodeJS.Odin();
            await odin.InitDll(new OdingSettings
            {
                Cashier = OdinCashierProvider.NONE,
                Card = new List<OdinCardProvider> { OdinCardProvider.BOG },
                ReceiptPrinter = OdinPrinterProvider.THERMAL,
                PrinterSettings = new OdinPrinterSettings { Title = "შპს არეა მარკეტი" },
                DeviceId = "000000000000015",
                ProductType = OdinProductType.HORECA
                //CashierPort = "COM4"
            });

            var order = new Order
            {
                PaymentType = PaymentType.Cash,
                OrderId = "02d85d1b-d6f8-46b7-a480-00a5d06f3a55",
                ReceiptNumber = 59814,
                OperatorName = "სოლომონ ომსარაშვილი",
                TaxRate = 2,
                TaxAmount = 10,
                TableName = "მაგიდა",
                SpaceName = "სართული",
                GuestCount = 10,
                OrderItems = new List<OrderItem> {
                    new OrderItem { Name = "ბორჯომი (ქილის) ბორჯომი (ქილის) ბორჯომი (ქილის) ბორჯომი (ქილის) ბორჯომი (ქილის)",  Quantity = 1, UnitPrice = 0.01m },
                    new OrderItem{ Name = "Activia",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "Dirol",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "Parliament Aqua Blue",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "Parliament Night Blue",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "White Board Marker v2",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "იაკობს Dynamix პაკეტი",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "კაიაკი",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "კორონა ექსტრა",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ქალაქური არაქისი",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისი",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიa",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                    //new OrderItem{ Name = "ჩიფსი ლეისიb",  Quantity = 1, UnitPrice = 0.01m },
                },
                IsDetailed = false
            };
            order.TotalPrice = order.OrderItems.Sum(x => x.UnitPrice);
            object resp = null;
            try
            {
                resp = await odin.PreOrder(order);
            }
            catch (Exception e) { Console.WriteLine(e.Message); }
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(resp));

            //odin.CloseDay(null).GetAwaiter().GetResult();
            return;

            //var odin = new Polymath.Odin.HAL.NodeJS.Odin();
            //Console.WriteLine(await odin.GetDaisyExpertPort(null));

            //return;





            //var odin = new Odin();
            //var orderItems = new List<OrderItem>();

            //var order = new Order
            //{
            //    CreditCardPayment = true,
            //    OrderItems = new OrderItem[]
            //    {
            //        new OrderItem
            //        {
            //            Name = "a",
            //            UnitPrice = price,
            //            Quantity =1
            //        }
            //    }
            //};

            //var orderItem = CreateOrderItem();

            //while (orderItem != null)
            //{
            //    orderItems.Add(orderItem);
            //    orderItem = CreateOrderItem();
            //}

            //order.OrderItems = orderItems;

            //order.TotalPrice = order.OrderItems.Sum(x => x.UnitPrice * x.Quantity);
            //var response = odin.Order(order);
            //var response = odin._daisyExpert.DeviceStatus();
            //Console.WriteLine("Success:" + response.Success);
        }

        static OrderItem CreateOrderItem()
        {
            Console.Write("produqtis saxeli:");
            var name = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(name))
            {
                return null;
            }

            Console.Write("produqtis fasi:");
            var _price = Console.ReadLine();
            var price = decimal.Parse(_price);

            Console.Write("produqtis raodenoba:");
            var quantity = int.Parse(Console.ReadLine());

            return new OrderItem
            {
                Name = name,
                UnitPrice = price,
                Quantity = quantity
            };
        }
    }
}
