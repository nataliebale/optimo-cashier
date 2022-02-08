using Polymath.Odin.IntegrationShared.Exceptions;
using Polymath.Odin.KasaGE.Commands;
using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Responses;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Ports;
using System.Linq;

namespace Polymath.Odin.KasaGE
{
    public class Dp25 : IDisposable
    {
        private int _sequence = 32;
        private SerialPort _port;
        private bool _innerReadStatusExecuted;
        private readonly Queue<byte> _queue;

        public Dp25(string portName)
        {
            _queue = new Queue<byte>();
            _port = new SerialPort(portName, 115200, Parity.None, 8, StopBits.One)
            {
                ReadTimeout = 500,
                WriteTimeout = 500
            };
            _port.Open();
        }

        public void Dispose()
        {
            if (_port == null)
            {
                return;
            }

            if (_port.IsOpen)
            {
                _port.Close();
            }

            _port.Dispose();
            _port = null;
        }

        private bool ReadByte()
        {
            var num = _port.ReadByte();
            _queue.Enqueue((byte)num);
            return num != 3;
        }

        private IFiscalResponse SendMessage(
          IWrappedMessage msg,
          Func<byte[], IFiscalResponse> responseFactory)
        {
            if (_innerReadStatusExecuted)
            {
                return _SendMessage(msg, responseFactory);
            }

            _SendMessage(new ReadStatusCommand(), bytes => null);
            _innerReadStatusExecuted = true;
            return _SendMessage(msg, responseFactory);
        }

        private IFiscalResponse _SendMessage(
          IWrappedMessage msg,
          Func<byte[], IFiscalResponse> responseFactory)
        {
            IFiscalResponse fiscalResponse = null;
            byte[] statusBytes = null;
            var bytes = msg.GetBytes(_sequence);
            for (var index = 0; index < 3; ++index)
            {
                try
                {
                    _port.Write(bytes, 0, bytes.Length);
                    var source = new List<byte>();
                    while (ReadByte())
                    {
                        var num = _queue.Dequeue();
                        switch (num)
                        {
                            case 21:
                                throw new IOException("Invalid packet checksum or form of messsage.");
                            case 22:
                                continue;
                            default:
                                source.Add(num);
                                continue;
                        }
                    }
                    source.Add(_queue.Dequeue());
                    var array = source.ToArray();
                    fiscalResponse = responseFactory(array);
                    statusBytes = source.Skip<byte>(source.IndexOf(4) + 1).Take<byte>(6).ToArray<byte>();
                    break;
                }
                catch
                {
                    if (index >= 2)
                    {
                        throw;
                    }
                    else
                    {
                        _queue.Clear();
                    }
                }
            }
            ++_sequence;
            if (_sequence > 254)
            {
                _sequence = 32;
            }

            if (msg.Command != 74)
            {
                CheckStatusOnErrors(statusBytes);
            }

            return fiscalResponse;
        }

        private void CheckStatusOnErrors(byte[] statusBytes)
        {
            if (statusBytes == null)
            {
                throw new ArgumentNullException(nameof(statusBytes));
            }

            if (statusBytes.Length == 0)
            {
                throw new ArgumentException("Argument is empty collection", nameof(statusBytes));
            }

            if ((statusBytes[2] & 1) > 0)
            {
                throw new CashierOutOfPaperException();
            }

            if ((statusBytes[0] & 32) > 0)
            {
                throw new FiscalIOException("General error - this is OR of all errors marked with #");
            }

            if ((statusBytes[0] & 2) > 0)
            {
                throw new FiscalIOException("# Command code is invalid.");
            }

            if ((statusBytes[0] & 1) > 0)
            {
                throw new FiscalIOException("# Syntax error.");
            }

            if ((statusBytes[1] & 2) > 0)
            {
                throw new FiscalIOException("# Command is not permitted.");
            }

            if ((statusBytes[1] & 1) > 0)
            {
                throw new FiscalIOException("# Overflow during command execution.");
            }

            if ((statusBytes[4] & 32) > 0)
            {
                throw new FiscalIOException(" OR of all errors marked with ‘*’ from Bytes 4 and 5.");
            }

            if ((statusBytes[4] & 16) > 0)
            {
                throw new FiscalIOException("* Fiscal memory is full.");
            }

            if ((statusBytes[4] & 1) > 0)
            {
                throw new FiscalIOException("* Error while writing in FM.");
            }
        }

        public void ChangePort(string portName)
        {
            _port.Close();
            _port.PortName = portName;
            _port.Open();
        }

        public T ExecuteCustomCommand<T>(WrappedMessage cmd) where T : FiscalResponse
        {
            return (T)SendMessage(cmd, bytes => (IFiscalResponse)Activator.CreateInstance(typeof(T), (object)bytes));
        }

        public CommonFiscalResponse OpenNonFiscalReceipt()
        {
            return (CommonFiscalResponse)SendMessage(new OpenNonFiscalReceiptCommand(), bytes => new CommonFiscalResponse(bytes));
        }

        public CommonFiscalResponse AddTextToNonFiscalReceipt(string text)
        {
            CommonFiscalResponse response = default;

            while (text.Length > 0)
            {
                var length = Math.Min(28, text.Length);
                response = (CommonFiscalResponse)SendMessage(new AddTextToNonFiscalReceiptCommand(text.Substring(0, length)), bytes => new CommonFiscalResponse(bytes));
                text = text.Substring(length);

                if (!response.CommandPassed)
                {
                    break;
                }
            }

            return response;
        }

        public CommonFiscalResponse CloseNonFiscalReceipt()
        {
            return (CommonFiscalResponse)SendMessage(new CloseNonFiscalReceiptCommand(), bytes => new CommonFiscalResponse(bytes));
        }

        public SubTotalResponse SubTotal()
        {
            return (SubTotalResponse)SendMessage(new SubTotalCommand(), bytes => new SubTotalResponse(bytes));
        }

        public OpenFiscalReceiptResponse OpenFiscalReceipt(
          string opCode,
          string opPwd)
        {
            return (OpenFiscalReceiptResponse)SendMessage(new OpenFiscalReceiptCommand(opCode, opPwd), bytes => new OpenFiscalReceiptResponse(bytes));
        }

        public OpenFiscalReceiptResponse OpenFiscalReceipt(
          string opCode,
          string opPwd,
          ReceiptType type)
        {
            return (OpenFiscalReceiptResponse)SendMessage(new OpenFiscalReceiptCommand(opCode, opPwd, (int)type), bytes => new OpenFiscalReceiptResponse(bytes));
        }

        public OpenFiscalReceiptResponse OpenFiscalReceipt(
          string opCode,
          string opPwd,
          ReceiptType type,
          int tillNumber)
        {
            return (OpenFiscalReceiptResponse)SendMessage(new OpenFiscalReceiptCommand(opCode, opPwd, (int)type, tillNumber), bytes => new OpenFiscalReceiptResponse(bytes));
        }

        public RegisterSaleResponse RegisterSale(
          string pluName,
          decimal price,
          decimal quantity,
          int departmentNumber,
          TaxCode taxCode = TaxCode.A)
        {
            return (RegisterSaleResponse)SendMessage(new RegisterSaleCommand(pluName, (int)taxCode, price, departmentNumber, quantity), bytes => new RegisterSaleResponse(bytes));
        }

        public RegisterSaleResponse RegisterSale(
          string pluName,
          decimal price,
          decimal quantity,
          int departmentNumber,
          DiscountType discountType,
          decimal discountValue,
          TaxCode taxCode = TaxCode.A)
        {
            return (RegisterSaleResponse)SendMessage(new RegisterSaleCommand(pluName, (int)taxCode, price, departmentNumber, quantity, (int)discountType, discountValue), bytes => new RegisterSaleResponse(bytes));
        }

        public RegisterSaleResponse RegisterProgrammedItemSale(
          int pluCode,
          decimal quantity)
        {
            return (RegisterSaleResponse)SendMessage(new RegisterProgrammedItemSaleCommand(pluCode, quantity), bytes => new RegisterSaleResponse(bytes));
        }

        public RegisterSaleResponse RegisterProgrammedItemSale(
          int pluCode,
          decimal price,
          decimal quantity,
          DiscountType discountType,
          decimal discountValue)
        {
            return (RegisterSaleResponse)SendMessage(new RegisterProgrammedItemSaleCommand(pluCode, price, quantity, (int)discountType, discountValue), bytes => new RegisterSaleResponse(bytes));
        }

        public CalculateTotalResponse Total(PaymentMode paymentMode = PaymentMode.Cash)
        {
            return (CalculateTotalResponse)SendMessage(new CalculateTotalCommand((int)paymentMode, decimal.Zero), bytes => new CalculateTotalResponse(bytes));
        }

        public CalculateTotalResponse Total(
          PaymentMode paymentMode,
          decimal cashMoney)
        {
            return (CalculateTotalResponse)SendMessage(new CalculateTotalCommand((int)paymentMode, cashMoney), bytes => new CalculateTotalResponse(bytes));
        }

        public VoidOpenFiscalReceiptResponse VoidOpenFiscalReceipt()
        {
            return (VoidOpenFiscalReceiptResponse)SendMessage(new VoidOpenFiscalReceiptCommand(), bytes => new VoidOpenFiscalReceiptResponse(bytes));
        }

        public AddTextToFiscalReceiptResponse AddTextToFiscalReceipt(string text)
        {
            AddTextToFiscalReceiptResponse response = default;

            while (text.Length > 0)
            {
                var length = Math.Min(28, text.Length);
                response = (AddTextToFiscalReceiptResponse)SendMessage(new AddTextToFiscalReceiptCommand(text.Substring(0, length)), bytes => new AddTextToFiscalReceiptResponse(bytes));
                text = text.Substring(length);

                if (!response.CommandPassed)
                {
                    break;
                }
            }

            return response;
        }

        public CloseFiscalReceiptResponse CloseFiscalReceipt()
        {
            return (CloseFiscalReceiptResponse)SendMessage(new CloseFiscalReceiptCommand(), bytes => new CloseFiscalReceiptResponse(bytes));
        }

        public GetLastFiscalEntryInfoResponse GetLastFiscalEntryInfo(
          FiscalEntryInfoType type = FiscalEntryInfoType.CashDebit)
        {
            return (GetLastFiscalEntryInfoResponse)SendMessage(new GetLastFiscalEntryInfoCommand((int)type), bytes => new GetLastFiscalEntryInfoResponse(bytes));
        }

        public CashInCashOutResponse CashInCashOutOperation(
          Cash operationType,
          decimal amount)
        {
            return (CashInCashOutResponse)SendMessage(new CashInCashOutCommand((int)operationType, amount), bytes => new CashInCashOutResponse(bytes));
        }

        public ReadStatusResponse ReadStatus()
        {
            return (ReadStatusResponse)SendMessage(new ReadStatusCommand(), bytes => new ReadStatusResponse(bytes));
        }

        public EmptyFiscalResponse FeedPaper(int lines = 1)
        {
            return (EmptyFiscalResponse)SendMessage(new FeedPaperCommand(lines), bytes => new EmptyFiscalResponse(bytes));
        }

        public EmptyFiscalResponse PrintBuffer()
        {
            return (EmptyFiscalResponse)SendMessage(new FeedPaperCommand(0), bytes => new EmptyFiscalResponse(bytes));
        }

        public ReadErrorResponse ReadError(string errorCode)
        {
            return (ReadErrorResponse)SendMessage(new ReadErrorCommand(errorCode), bytes => new ReadErrorResponse(bytes));
        }

        public EmptyFiscalResponse PlaySound(int frequency, int interval)
        {
            return (EmptyFiscalResponse)SendMessage(new PlaySoundCommand(frequency, interval), bytes => new EmptyFiscalResponse(bytes));
        }

        public PrintReportResponse PrintReport(ReportType type)
        {
            return (PrintReportResponse)SendMessage(new PrintReportCommand(type.ToString()), bytes => new PrintReportResponse(bytes));
        }

        public EmptyFiscalResponse OpenDrawer(int impulseLength)
        {
            return (EmptyFiscalResponse)SendMessage(new OpenDrawerCommand(impulseLength), bytes => new EmptyFiscalResponse(bytes));
        }

        public EmptyFiscalResponse SetDateTime(DateTime dateTime)
        {
            return (EmptyFiscalResponse)SendMessage(new SetDateTimeCommand(dateTime), bytes => new EmptyFiscalResponse(bytes));
        }

        public ReadDateTimeResponse ReadDateTime()
        {
            return (ReadDateTimeResponse)SendMessage(new ReadDateTimeCommand(), bytes => new ReadDateTimeResponse(bytes));
        }

        public GetStatusOfCurrentReceiptResponse GetStatusOfCurrentReceipt()
        {
            return (GetStatusOfCurrentReceiptResponse)SendMessage(new GetStatusOfCurrentReceiptCommand(), bytes => new GetStatusOfCurrentReceiptResponse(bytes));
        }

        public EmptyFiscalResponse ProgramItem(
          string name,
          int plu,
          TaxGr taxGr,
          int dep,
          int group,
          decimal price,
          decimal quantity = 9999M,
          PriceType priceType = PriceType.FixedPrice)
        {
            return (EmptyFiscalResponse)SendMessage(new ProgramItemCommand(name, plu, taxGr, dep, group, price, quantity, priceType), bytes => new EmptyFiscalResponse(bytes));
        }
    }
}
