using Newtonsoft.Json;
using Polymath.Odin.DaisyExpert;
using Polymath.Odin.DaisyExpert.Exceptions;
using Polymath.Odin.HAL.Exceptions;
using Polymath.Odin.HAL.Sale;
using Polymath.Odin.IntegrationShared.Exceptions;
using Serilog;
using System;
using System.IO.Ports;
using System.Linq;

namespace Polymath.Odin.HAL.CashierService.DaisyExpert
{
    public class DaisyExpertService : ICashierService
    {
        private static IDaisyExpertAdapter _device;
        private static string _cashierPort;
        private static ICashierService _instance;

        private DaisyExpertService(string portName = null)
        {
            Log.Information("დეიზისთან პორტით დაკავშირება");
            if (!string.IsNullOrWhiteSpace(portName))
            {
                try
                {
                    _device = DaisyAdapterFactory.GetDaisy(portName);
                }
                catch (WaitTimedOutException e) { throw e; }
                catch { }
            }

            if (_device == null)
            {
                Log.Information("დეიზის ძებნა");
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
                _instance = new DaisyExpertService(portName);
            }

            return _instance;
        }

        public void PrepareOrder(Order order)
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            CheckCashier();

            Log.Debug("დეიზის სტატუსის შემოწმება");
            var deviceStatus = _device.DeviceStatus();
            Log.Debug($"დეიზის სტატუსი: {JsonConvert.SerializeObject(deviceStatus)}");

            if (deviceStatus?.Statuses?.Any(x => x.Byte == 2 && x.Index == 5) == true)
            {
                Log.Warning("არაფისკალური ჩეკი ღიაა, მიმდინარეობს დახურვა...");
                _device.CloseNonFiscalReceipt();
                deviceStatus = _device.DeviceStatus();
                Log.Debug("არაფისკალური ჩეკი დაიხურა");
            }

            while (deviceStatus?.Statuses?.Any(x => x.Byte == 2 && x.Index == 3) == true)
            {
                Log.Warning("ფისკალური ჩეკი ღიაა, მიმდინარეობს დახურვა...");
                _device.CancelReceipt();
                _device.CloseFiscalReceipt();
                deviceStatus = _device.DeviceStatus();
                Log.Debug("ფისკალური ჩეკი დაიხურა");
            }

            if (deviceStatus?.Statuses?.Any(x => x.Byte == 2 && x.Index == 6) != true)
            {
                Log.Error("ჩეკის დაბეჭდვა შეუძლებელია. DiasyNotInFiscalModeException");
                throw new DiasyNotInFiscalModeException();
            }
        }

        public OdinResponse MakePayment(Order order)
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            CheckCashier();

            Log.Debug("ჩეკის გახსნა");
            var response = _device.OpenFiscalReceipt(order.OrderId);

            if (!response.Success)
            {
                Log.Warning($"ჩეკი ვერ გაიხსნა: {JsonConvert.SerializeObject(response)}");
                Log.Debug("მიმდინარეობს დეიზის ჩამოყრა");
                response = _device.CancelReceipt();
                Log.Debug(JsonConvert.SerializeObject(response));
                response = _device.CloseFiscalReceipt();
                Log.Debug(JsonConvert.SerializeObject(response));
                Log.Information("ჩეკის თავიდან გახსბა");
                response = _device.OpenFiscalReceipt(order.OrderId);

                if (!response.Success)
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
                    response = _device.AddOrderItem(item.Name, item.Quantity, item.UnitPrice);
                    if (!response.Success)
                    {
                        Log.Error($"პროდუქტის გატარება ვერ განხორციელდა: {JsonConvert.SerializeObject(response)}");
                        return new OdinResponse(response);
                    }
                    _device.FiscalText(order.ReceiptNumber.ToString());
                }
            }
            else
            {
                Log.Debug($"ჯამური თანხა: {order.TotalPrice}");
                response = _device.AddSale(order.TotalPrice, order.ReceiptNumber.ToString());
                if (!response.Success)
                {
                    Log.Warning($"გატარება ვერ განხორციელდა: {JsonConvert.SerializeObject(response)}");
                    return new OdinResponse(response);
                }
            }

            response = _device.Payment(order.TotalPrice, order.PaymentType == PaymentType.Cash ? 'P' : 'N');

            if (!response.Success)
            {
                Log.Warning($"გადახდა ვერ განხორციელდა: {JsonConvert.SerializeObject(response)}");
                return new OdinResponse(response);
            }

            _device.FiscalText(order.OrderId.ToUpper());
            response = _device.CloseFiscalReceipt();
            Log.Debug(JsonConvert.SerializeObject(response));
            return new OdinResponse(response);
        }

        public void CloseDay()
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            CheckCashier();

            _device.CloseDay();
        }

        public void OpenNonFiscalReceipt()
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            CheckCashier();

            _device.OpenNonFiscalReceipt();
        }

        public void CloseNonFiscalReceipt()
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            CheckCashier();
            _device.CloseNonFiscalReceipt();
        }

        public void PrintNonFiscalText(string text)
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            //CheckCashier();
            _device.NonFiscalText(text);
        }

        public void PrintFiscalText(string text)
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            //CheckCashier();
            _device.FiscalText(text);
        }

        public static string GetCashierPort()
        {
            Log.Debug("დეიზის კავშირის შემოწმება");
            if (IsCashierConnected(_device))
            {
                Log.Debug($"დეიზის პორტი: {_cashierPort}");
                return _cashierPort;
            }

            foreach (var port in SerialPort.GetPortNames())
            {
                // macos fix
                if (port.Contains("Bluetooth"))
                {
                    continue;
                }

                Log.Debug($"დეიზის შემოჭმება პორტზე: {port}");

                if (IsCashierConnected(port))
                {
                    Log.Debug($"დეიზის პორტი: {port}");
                    return port;
                }
            }

            Log.Warning($"დეიზის პორტი ვერ მოიძებნა");
            return null;
        }

        private void Init()
        {
            Log.Debug("დეიზისთან პირველადი კავშირი");
            foreach (var port in SerialPort.GetPortNames())
            {
                // macos fix
                if (port.Contains("Bluetooth"))
                {
                    continue;
                }

                Log.Debug($"დეიზის შემოჭმება პორტზე: {port}");

                if (IsCashierConnected(port))
                {
                    Log.Debug($"დეიზის პორტი ნაპოვნია: {port}");
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
                    Log.Error("დეიზი არაა შეერთებული");
                    throw new DaisyExpertNotConnectedException("Device not found");
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
                using (var daisy = DaisyAdapterFactory.GetDaisy(portName))
                {
                    Log.Debug($"დეიზის შემოწმება პორტზე: {portName}");
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

        private static bool IsCashierConnected(IDaisyExpertAdapter daisyExpert)
        {
            try
            {
                Log.Debug("დეიზის შემოწმება");
                var response = daisyExpert.DiagnosticInformation();
                Log.Debug($"შემოწმების პასუხი: {JsonConvert.SerializeObject(response)}");
                return response.Data != string.Empty && response.Success;
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
            _device = DaisyAdapterFactory.GetDaisy(port);
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
            Log.Information("დეიზის გათიშვა");
            if (disposed)
                return;

            if (disposing)
            {
                _device.Dispose();
            }

            disposed = true;
        }

        ~DaisyExpertService()
        {
            try
            {
                _device.Dispose();
            }
            catch { }
        }
    }
}
