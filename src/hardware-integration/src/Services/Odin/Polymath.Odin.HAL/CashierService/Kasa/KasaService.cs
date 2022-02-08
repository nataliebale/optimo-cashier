using Newtonsoft.Json;
using Polymath.Odin.HAL.Exceptions;
using Polymath.Odin.HAL.Sale;
using Polymath.Odin.KasaGE;
using Polymath.Odin.KasaGE.Commands;
using Polymath.Odin.KasaGE.Core;
using Serilog;
using System;
using System.IO.Ports;
using System.Linq;

namespace Polymath.Odin.HAL.CashierService.Kasa
{
    public class KasaService : ICashierService
    {
        private static Dp25 _device;
        private static string _cashierPort;
        private static ICashierService _instance;

        private KasaService(string portName = null)
        {
            Log.Information("კასასთან პორტით დაკავშირება");
            if (!string.IsNullOrWhiteSpace(portName))
            {
                try
                {
                    _device = new Dp25(portName);
                }
                catch { }
            }

            if (_device == null)
            {
                Log.Information("კასას ძებნა");
                Init();
            }
            else
            {
                _cashierPort = portName;
            }
        }

        public static ICashierService GetInstance(string portName)
        {
            if (_instance == null)
            {
                _instance = new KasaService(portName);
            }

            return _instance;
        }
        public void PrepareOrder(Order order)
        {
            Log.Debug("კასას კავშირის შემოწმება");
            CheckCashier();

            Log.Debug("კასას სტატუსი შემოწმება");
            FiscalResponse deviceStatus = _device.ReadStatus();

            Log.Debug($"კასას სტატუსი: {JsonConvert.SerializeObject(deviceStatus)}");
            if (deviceStatus?.Statuses?.Any(x => x.Byte == 2 && x.Index == 5) == true)
            {
                Log.Warning("არაფისკალური ჩეკი ღიაა, მიმდინარეობს დახურვა...");
                _device.CloseNonFiscalReceipt();
                deviceStatus = _device.ReadStatus();
                Log.Debug("არაფისკალური ჩეკი დაიხურა");
            }

            while (deviceStatus?.Statuses?.Any(x => x.Byte == 2 && x.Index == 3) == true)
            {
                Log.Warning("ფისკალური ჩეკი ღიაა, მიმდინარეობს დახურვა...");
                _device.VoidOpenFiscalReceipt();
                _device.CloseNonFiscalReceipt();
                deviceStatus = _device.ReadStatus();
                Log.Debug("ფისკალური ჩეკი დაიხურა");
            }
        }

        public OdinResponse MakePayment(Order order)
        {
            Log.Debug("კასას კავშირის შემოწმება");
            CheckCashier();

            Log.Debug("ჩეკის გახსნა");
            FiscalResponse response = _device.OpenFiscalReceipt("1", "1");

            if (!response.CommandPassed)
            {
                Log.Warning($"ჩეკი ვერ გაიხსნა: {JsonConvert.SerializeObject(response)}");
                Log.Debug("მიმდინარეობს კასას ჩამოყრა");
                response = _device.VoidOpenFiscalReceipt();
                Log.Debug(JsonConvert.SerializeObject(response));
                response = _device.CloseFiscalReceipt();
                Log.Debug(JsonConvert.SerializeObject(response));
                Log.Information("ჩეკის თავიდან გახსბა");
                response = _device.OpenFiscalReceipt("1", "1", ReceiptType.Sale);
                if (!response.CommandPassed)
                {
                    Log.Error($"ჩეკი ვერ გაიხსნა: {JsonConvert.SerializeObject(response)}");
                    return new OdinResponse(response);

                }
            }

            if (order.IsDetailed)
            {
                Log.Debug("დეტალური ჩეკის ბეჭდვა");
                foreach (var item in order.OrderItems)
                {
                    response = _device.RegisterSale(item.Name, item.Quantity, item.UnitPrice, 1);
                    if (!response.CommandPassed)
                    {
                        Log.Error($"პროდუქტის გატარება ვერ განხორციელდა: {JsonConvert.SerializeObject(response)}");
                        Log.Warning(JsonConvert.SerializeObject(response));
                        return new OdinResponse(response);
                    }
                    _device.AddTextToFiscalReceipt(order.ReceiptNumber.ToString());
                }
            }
            else
            {
                Log.Debug($"ჯამური თანხა: {order.TotalPrice}");
                response = _device.RegisterSale(order.ReceiptNumber.ToString(), order.TotalPrice, 1, 1);
                if (!response.CommandPassed)
                {
                    Log.Warning($"გატარება ვერ განხორციელდა: {JsonConvert.SerializeObject(response)}");
                    return new OdinResponse(response);
                }
            }

            response = _device.AddTextToFiscalReceipt(order.OrderId.ToUpper());
            response = _device.Total(order.PaymentType == PaymentType.Cash ? PaymentMode.Cash : PaymentMode.Card);

            if (!response.CommandPassed)
            {
                Log.Warning($"გადახდა ვერ განხორციელდა: {JsonConvert.SerializeObject(response)}");
                return new OdinResponse(response);
            }

            response = _device.CloseFiscalReceipt();
            Log.Information(JsonConvert.SerializeObject(response));
            return new OdinResponse(response);
        }

        public void CloseDay()
        {
            Log.Debug("კასას კავშირის შემოწმება");
            CheckCashier();

            _device.PrintReport(ReportType.Z);
        }

        public void OpenNonFiscalReceipt()
        {
            Log.Debug("კასას კავშირის შემოწმება");
            CheckCashier();

            _device.OpenNonFiscalReceipt();
        }

        public void CloseNonFiscalReceipt()
        {
            Log.Debug("კასას კავშირის შემოწმება");
            CheckCashier();

            _device.CloseNonFiscalReceipt();
        }

        public void PrintNonFiscalText(string text)
            => _device.AddTextToNonFiscalReceipt(text);

        public void PrintFiscalText(string text)
            => _device.AddTextToFiscalReceipt(text);

        public static string GetCashierPort()
        {
            Log.Debug("კასას კავშირის შემოწმება");
            if (IsCashierConnected(_device))
            {
                Log.Debug($"კასას პორტი: {_cashierPort}");
                return _cashierPort;
            }

            foreach (var port in SerialPort.GetPortNames())
            {
                // macos fix
                if (port.Contains("Bluetooth"))
                {
                    continue;
                }

                Log.Debug($"კასას შემოჭმება პორტზე: {port}");

                if (IsCashierConnected(port))
                {
                    Log.Debug($"დეიზის პორტი: {port}");
                    return port;
                }
            }

            return null;
        }

        private void Init()
        {
            Log.Debug("კასასთან პირველადი კავშირი");
            foreach (var port in SerialPort.GetPortNames())
            {
                // macos fix
                if (port.Contains("Bluetooth"))
                {
                    continue;
                }

                Log.Debug($"კასას შემოჭმება პორტზე: {port}");

                if (IsCashierConnected(port))
                {
                    Log.Debug($"კასას პორტი ნაპოვნია: {port}");
                    SetCashierPort(port);
                    return;
                }
            }
        }

        private void CheckCashier()
        {
            if (!IsCashierConnected(_device))
            {
                var cashierPort = GetCashierPort();

                if (string.IsNullOrEmpty(cashierPort))
                {
                    Log.Error("კასა არაა შეერთებული");
                    throw new KasaNotConnectedException();
                }
                else
                {
                    SetCashierPort(cashierPort);
                }
            }
        }

        private static bool IsCashierConnected(string portName)
        {
            try
            {
                using (var daisy = new Dp25(portName))
                {
                    Log.Debug($"კასას შემოწმება პორტზე: {portName}");
                    return IsCashierConnected(daisy);
                }
            }
            catch (Exception e)
            {
                //Console.WriteLine(e);
                Log.Warning(e, JsonConvert.SerializeObject(e));
                return false;
            }
        }

        private static bool IsCashierConnected(Dp25 cashier)
        {
            try
            {
                Log.Debug("კასას შემოწმება");
                var response = cashier.ReadStatus();
                Log.Debug($"შემოწმების პასუხი: {JsonConvert.SerializeObject(response)}");
                return response.Status.Length > 0;
            }
            catch (Exception e)
            {
                Log.Warning(e.Message);
                Log.Warning(e.StackTrace);
            }

            return false;
        }

        private void SetCashierPort(string port)
        {
            if (_device != null)
            {
                _device.Dispose();
            }

            _cashierPort = port;
            _device = new Dp25(port);
        }

        public void Dispose()
        {
            Dispose(true);
            // Suppress finalization.
            GC.SuppressFinalize(this);
        }

        bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            Log.Information("კასას გათიშვა");
            if (disposed)
                return;

            if (disposing)
            {
                _device.Dispose();
            }

            disposed = true;
        }

        ~KasaService()
        {
            try
            {
                _device.Dispose();
            }
            catch { }
        }
    }
}
