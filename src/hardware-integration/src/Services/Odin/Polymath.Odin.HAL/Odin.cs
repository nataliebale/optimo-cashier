using IngenicoCLS;
using Newtonsoft.Json;
using Polymath.Odin.HAL.CashierService;
using Polymath.Odin.HAL.Exceptions;
using Polymath.Odin.HAL.PrinterService;
using Polymath.Odin.HAL.Receipts.DataModels;
using Polymath.Odin.HAL.Receipts.Templates;
using Polymath.Odin.HAL.Sale;
using Polymath.Odin.HAL.Settings;
using Polymath.Odin.Ingenico;
using Polymath.Odin.Ingenico.Exceptions;
using Polymath.Odin.IntegrationShared.Exceptions;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;

namespace Polymath.Odin.HAL
{
    public class Odin : IDisposable
    {
        private static IngenicoAdapter _ingenico;
        private static ICashierService _cashier;
        private static IPrinterService _printer;
        private static Odin _instance;
        private static OdingSettings _settings;
        public static OdinProductType ProductType = OdinProductType.Retail;

        private Odin(OdingSettings settings)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            Log.Debug(JsonConvert.SerializeObject(settings));
            _settings = settings;
            ProductType = _settings.ProductType.HasValue ? _settings.ProductType.Value : OdinProductType.Retail;

            Log.Debug("ფისკალურ პრინტერთან დაკავშირება");
            _cashier = CashierFactory.GetCashier(_settings.Cashier, _settings.CashierPort);
            _printer = PrinterFactory.GetPrinter(_settings.ReceiptPrinter, _cashier);

            if (_settings.Card?.Any(x => x == OdinCardProvider.BOG) == true)
            {
                Log.Debug("საქართველოს ბანკის აპარატთან დაკავშირება");
                _ingenico = new IngenicoAdapter(new IngenicoCLS.Constants.PrintHandler(_printer.IngenicoPrintingHandler), (string type, string details, string text) =>
                {
                    Log.Debug($"ingenico: {type}: {details}:\t{text}");
                }, false, Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Optimo", "logs"));
            }
        }

        public static Odin GetInstance(OdingSettings settings)
        {
            if (_instance == null)
            {
                _instance = new Odin(settings);
            }

            return _instance;
        }

        public OdinResponse PreOrder(Order order)
        {
            if (order.OrderItems == null || order.OrderItems.Count() == 0)
            {
                throw new CartIsEmprtyException();
            }

            _printer.ReceiptPrintingHandler(new PreOrderReceipt(), new PreOrderReceiptModel(_settings, order));

            return new OdinResponse
            {
                Success = true
            };
        }

        /// <summary>
        /// Make order
        /// </summary>
        /// <param name="order"></param>
        /// <exception cref="global::Odin.Ingenico.Exceptions.IngenicoNotConnectedException"></exception>
        /// <exception cref="BOGNotConfiguredException"></exception>
        /// <returns></returns>
        public OdinResponse Order(Order order)
        {
            if (order.OrderItems == null || order.OrderItems.Count() == 0)
            {
                throw new CartIsEmprtyException();
            }
            //_printer.ReceiptPrintingHandler(new DetailedOrderReceipt(), new DetailedOrderReceiptModel(_settings, order));
            //return null;

            Result payment = null;
            OdinResponse response = null;

            if (_cashier != null)
            {
                Log.Debug("გაყიდვის მომზადება");
                _cashier.PrepareOrder(order);
                Log.Debug("გაყიდვა მომზადებულია");
            }

            switch (order.PaymentType)
            {
                case PaymentType.Cash:
                    {
                        Log.Debug("გაყიდვის გატარება ფისკალურზე");
                        if (_cashier != null)
                        {
                            response = _cashier.MakePayment(order);
                            if (response.Success)
                            {
                                _printer.ReceiptPrintingHandler(new DetailedOrderReceipt(), new DetailedOrderReceiptModel(_settings, order));
                            }

                            return response;
                        }
                        else
                        {
                            _printer.ReceiptPrintingHandler(new DetailedOrderReceipt(), new DetailedOrderReceiptModel(_settings, order));

                            return new OdinResponse
                            {
                                Success = true
                            };
                        }
                    }
                case PaymentType.BOG:
                    {
                        Log.Debug("გაყიდვის გატარება საქართველოს აპარატზე");
                        if (_ingenico == null)
                        {
                            Log.Error("საქართველოს აპარატი არა არის დაკონფიგურირებული");
                            throw new BOGNotConfiguredException();
                        }

                        payment = _ingenico.MakePayment(order.TotalPrice);

                        if (!payment.Success)
                        {
                            return new OdinResponse
                            {
                                Success = false,
                                Errors = new List<object>
                                {
                                    new
                                    {
                                        Description = payment.Message
                                    }
                                }
                            };
                        }
                        else
                        {
                            _printer.ReceiptPrintingHandler(new DetailedOrderReceipt(), new DetailedOrderReceiptModel(_settings, order)
                            {
                                RRN = payment.Transaction.RRN
                            });

                            return new OdinResponse
                            {
                                Success = true,
                                Transaction = payment.Transaction,
                                ExternalId = payment.Transaction.OperationID
                            };
                        }
                    }
                case PaymentType.BOGExternal:
                case PaymentType.Other:
                    Log.Debug("გაყიდვის გატარება სხვა აპარატზე");
                    _printer.ReceiptPrintingHandler(new DetailedOrderReceipt(), new DetailedOrderReceiptModel(_settings, order));

                    return new OdinResponse
                    {
                        Success = true
                    };
                default:
                    Log.Debug("გაყიდვის გატარება აპარატის გარეშე");
                    _printer.ReceiptPrintingHandler(new DetailedOrderReceipt(), new DetailedOrderReceiptModel(_settings, order));

                    return new OdinResponse
                    {
                        Success = true
                    };
            }
        }

        /// <summary>
        /// Reverse card transaction
        /// </summary>
        /// <param name="ReverseCardTransaction"></param>
        /// <exception cref="global::Odin.Ingenico.Exceptions.IngenicoNotConnectedException"></exception>
        /// <exception cref="BOGNotConfiguredException"></exception>
        /// <returns></returns>
        public OdinResponse ReverseCardTransaction(CardReversal cardReversal)
        {
            switch (cardReversal.CardProvider)
            {
                case OdinCardProvider.BOG:
                    {
                        if (_ingenico == null)
                        {
                            Log.Error("საქართველოს აპარატი არა არის დაკონფიგურირებული");
                            throw new BOGNotConfiguredException();
                        }

                        _ingenico.ReverseTransaction(new Transaction() { OperationID = cardReversal.ExternalId });

                        return new OdinResponse
                        {
                            Success = true
                        };
                    }
                default: throw new NotImplementedException();
            }
        }

        public void Test()
        {
            _cashier.OpenNonFiscalReceipt();
            _cashier.PrintNonFiscalText("solo");
            _cashier.CloseNonFiscalReceipt();
        }

        public void CloseDay()
        {
            if (_cashier != null)
            {
                _cashier.PrepareOrder(null);
            }

            if (_settings.Card != null)
            {
                foreach (var card in _settings.Card)
                {
                    if (card == OdinCardProvider.BOG)
                    {
                        Log.Debug("საქართველოს ტერმინალის შემოწმება");
                        _ingenico.CheckDevice();
                        Log.Debug("საქართველოს ტერმინალი შემოწმებულია");
                    }
                }
            }

            if (_cashier != null)
            {
                Log.Debug("დღის დახურვა ფისკალურზე");
                _cashier.PrepareOrder(null);
                _cashier.CloseDay();
                Log.Debug("დღე დაიხურა ფისკალურზე");
            }

            if (_settings.Card != null)
            {
                foreach (var card in _settings.Card)
                {
                    if (card == OdinCardProvider.BOG)
                    {
                        Log.Debug("დღის დახურვა საქართველოზე");
                        if (!_ingenico.CloseDay())
                        {
                            throw new IngenicoNotConnectedException();
                        }
                        Log.Debug("დღე დაიხურა საქართველოზე");
                    }
                }
            }
        }

        public static string GetCashierPort()
            => CashierFactory.GetCashierPort(_settings.Cashier);

        public void ShutDown()
        {
            StartShutDown("-f -s -t 5");
        }

        public void Reboot()
        {
            StartShutDown("-f -r -t 5");
        }

        private static void StartShutDown(string param)
        {
            var proc = new ProcessStartInfo();
            proc.FileName = "cmd";
            proc.WindowStyle = ProcessWindowStyle.Hidden;
            proc.Arguments = "/C shutdown " + param;
            Process.Start(proc);
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
            Log.Information("Disposing");
            if (disposed)
                return;

            if (disposing)
            {
                Log.Information("Disposing _daisyExpert");
                _cashier.Dispose();
                Log.Information("Disposing _ingenico");
                _ingenico.Dispose();
            }

            disposed = true;
        }
    }
}
