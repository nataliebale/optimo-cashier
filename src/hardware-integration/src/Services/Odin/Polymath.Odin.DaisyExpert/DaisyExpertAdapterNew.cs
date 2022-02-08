using Polymath.Odin.DaisyExpert.FiscalCommon;
using Polymath.Odin.DaisyExpert.FiscalCommon.Windows;
using Polymath.Odin.IntegrationShared.Exceptions;
using Serilog;
using System;
using System.Globalization;
using System.IO.Ports;
using System.Linq;

namespace Polymath.Odin.DaisyExpert
{
    public class DaisyExpertAdapterNew : IDisposable, IDaisyExpertAdapter
    {
        private const byte PREAMBLE = 1;
        private const byte TERMINATOR = 3;
        private const byte SEPARATOR = 4;
        private const byte POSTAMBLE = 5;
        private const byte RESPONSE_DATA_LENGTH = 200;
        private const byte RESPONSE_STATUS_LENGTH = 6;
        private FiscalPrinter _device;
        //private DaisyExpertResponse _response;

        public DaisyExpertAdapterNew(string portName, StopBits stopBits = StopBits.One, int baudrate = 9600, int dataBits = 8, Parity parity = Parity.None, Handshake handshake = Handshake.None)
        {

            _device = new FiscalPrinter(new FiscalCommWin(portName, baudrate), FiscalPrinterProtocol.Legacy, 1251);
            _device.Connect();
        }

        public DaisyExpertResponse CancelReceipt()
            => SendCommand(130);

        public DaisyExpertResponse PaperFeed(int line)
            => SendCommand(44, line);

        public DaisyExpertResponse OpenFiscalReceipt(string orderId, int operatorId = 1, string operatorPassword = "1")
            => SendCommand(48, $"{operatorId},{operatorPassword}");

        public DaisyExpertResponse AddOrderItem(string itemName, decimal quantity, decimal price)
            => SendCommand(49, $"{itemName}\tA{price.ToString("0.00", CultureInfo.InvariantCulture)}*{quantity.ToString("0.00", CultureInfo.InvariantCulture)}");

        public DaisyExpertResponse AddSale(decimal price, string description = "")
            => SendCommand(49, $"{description}\tA{price.ToString("0.00", CultureInfo.InvariantCulture)}");

        public DaisyExpertResponse Payment(decimal totalPrice, char type = 'P')
            => SendCommand(53, $"\t{type}{totalPrice.ToString("0.00", CultureInfo.InvariantCulture)}");

        public DaisyExpertResponse CloseFiscalReceipt()
            => SendCommand(56);

        public DaisyExpertResponse CloseDay()
            => ZReport();

        public DaisyExpertResponse ZReport()
            => SendCommand(69, 0);

        public DaisyExpertResponse XReport()
            => SendCommand(69, 2);

        public DaisyExpertResponse DeviceStatus()
            => SendCommand(74);

        public DaisyExpertResponse DiagnosticInformation()
            => SendCommand(90);

        public DaisyExpertResponse OpenNonFiscalReceipt()
            => SendCommand(38);

        public DaisyExpertResponse NonFiscalText(string text)
        {
            DaisyExpertResponse response = default;
            while (text.Length > 0)
            {
                var length = Math.Min(28, text.Length);
                response = SendCommand(42, text.Substring(0, length));
                text = text.Substring(length);

                if (!response.Success)
                {
                    break;
                }
            }

            return response;
        }

        public DaisyExpertResponse FiscalText(string text)
        {
            DaisyExpertResponse response = default;
            while (text.Length > 0)
            {
                var length = Math.Min(28, text.Length);
                response = SendCommand(54, text.Substring(0, length));
                text = text.Substring(length);

                if (!response.Success)
                {
                    break;
                }
            }

            return response;
        }

        public DaisyExpertResponse CloseNonFiscalReceipt()
            => SendCommand(39);

        private DaisyExpertResponse SendCommand(byte command, int data, byte sequence = 0)
            => SendCommand(command, data.ToString(), sequence);

        private DaisyExpertResponse SendCommand(byte command, string data = "", byte sequence = 0)
        {
            var resp = new DaisyExpertResponse();
            Log.Information($"დეიზის ბრძანება: {command}");
            resp.Data = _device.CustomCommand(command, data);
            Log.Information($"მიღებულია პასუხი");
            for (var statusI = 0; statusI < _device.StatusBytes.Length; statusI++)
            {
                var status = _device.StatusBytes[statusI];
                for (var index = 0; index < 8; index++)
                {
                    if ((status & (1 << index)) != 0)
                    {
                        resp.SetData(index, statusI);
                    }
                }
            }

            if (command == 90 && !resp.Success)
            {
                resp.Success = true;
                return resp;
            }

            if (resp.Statuses.Any(x => x.Byte == 2 && x.Index == 0))
            {
                throw new CashierOutOfPaperException();
            }

            if (resp.Statuses.Any(x => x.Byte == 1 && x.Index == 0)
                && command != 130
                && command != 39
                && command != 56)
            {
                throw new SumsOverflowException();
            }

            Log.Information($"Data Processed");
            return resp;
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
            Log.Information("Disposing adapter");
            if (disposed)
                return;

            if (disposing)
            {
                _device.Disconnect();
            }

            disposed = true;
        }

        ~DaisyExpertAdapterNew()
        {
            try
            {
                _device.Disconnect();
            }
            catch { }
        }
    }
}
