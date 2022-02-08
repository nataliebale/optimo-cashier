using Polymath.Odin.IntegrationShared.Exceptions;
using Serilog;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading;

namespace Polymath.Odin.DaisyExpert
{
    public class DaisyExpertAdapter : IDaisyExpertAdapter, IDisposable
    {
        private const byte PREAMBLE = 1;
        private const byte TERMINATOR = 3;
        private const byte SEPARATOR = 4;
        private const byte POSTAMBLE = 5;
        private const byte RESPONSE_DATA_LENGTH = 200;
        private const byte RESPONSE_STATUS_LENGTH = 6;
        private SerialPort _device;
        private DaisyExpertResponse _response;

        public DaisyExpertAdapter(string portName, StopBits stopBits = StopBits.One, int baudrate = 9600, int dataBits = 8, Parity parity = Parity.None, Handshake handshake = Handshake.None)
        {
            _device = new SerialPort(portName);
            _device.StopBits = stopBits;
            _device.BaudRate = baudrate;
            _device.DataBits = dataBits;
            _device.Parity = parity;
            _device.Handshake = handshake;
            _device.ReadTimeout = 100;
        }

        public DaisyExpertAdapter(SerialPort port, StopBits stopBits = StopBits.One, int baudrate = 9600, int dataBits = 8, Parity parity = Parity.None, Handshake handshake = Handshake.None)
        {
            _device = port;
            _device.StopBits = stopBits;
            _device.BaudRate = baudrate;
            _device.DataBits = dataBits;
            _device.Parity = parity;
            _device.Handshake = handshake;
            _device.ReadTimeout = 100;
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
            if (!_device.IsOpen)
            {
                _device.Open();
                _device.DiscardInBuffer();
                _device.DiscardOutBuffer();
            }

            if (sequence == 0)
            {
                sequence = GetRandomNumber();
            }

            _device.DataReceived += DataReceived;

            var counter = 0;
            void DataReceived(object sender, SerialDataReceivedEventArgs e)
            {
                try
                {
                    ReadCommand(command, data, sequence);
                }
                catch
                {
                    if (sender != null || e != null)
                    {
                        DataReceived(null, null);
                    }
                }
            }

            var buffer = PrepareCommand(command, sequence, data);

            var requestToLog = string.Join(" ", buffer.Select((b, i) => $"[{i}] {b.ToString()}"));
            Log.Information("{Type} {Command} {Payload}", "Request", command, requestToLog);

            Thread.Sleep(100);
            _device.Write(buffer, 0, buffer.Length);

            while (_response == null)
            {
                if (counter == 20)
                {
                    DataReceived(null, null);
                }
                Thread.Sleep(100);
                counter++;
            }

            _device.DataReceived -= DataReceived;

            var response = (DaisyExpertResponse)_response.Clone();
            _response = null;

            if (response.Statuses.Any(x => x.Byte == 1 && x.Index == 0))
            {
                throw new SumsOverflowException();
            }
            Thread.Sleep(100);
            return response;
        }

        private void ReadCommand(byte command, string data = "", byte sequence = 0)
        {
            var readData = new byte[_device.ReadBufferSize];
            var bytesToRead = _device.Read(readData, 0, readData.Length);
            var totalBytesToRead = bytesToRead;

            var tempResponse = readData.Take(totalBytesToRead).ToList();

            while (tempResponse.Count > 0 && tempResponse.Last() != 3 && tempResponse.Last() != 22 && tempResponse.Last() != 21)
            {
                readData = new byte[_device.ReadBufferSize];
                bytesToRead = _device.Read(readData, 0, readData.Length);
                tempResponse.AddRange(readData.Take(bytesToRead).ToList());
                totalBytesToRead += bytesToRead;
            }

            var response = tempResponse.ToArray();

            var responseToLog = string.Join(";", response.Select((b, i) => $"[{i}] {b.ToString()}"));
            Log.Information("{Type} {Command} {Payload}", "Response", command, responseToLog);

            var preamble = totalBytesToRead == 0 ? 0 : response[0];

            switch (preamble)
            {
                case 21:
                    SendCommand(command, data, sequence);
                    break;
                case 22:
                    return;
            }

            if (!ValidateMessage(response, totalBytesToRead, sequence, command, out var status))
                throw new Exception($"Corrupted Message: {totalBytesToRead}, {command}, {BitConverter.ToString(response)}");

            _response.Data = Encoding.UTF8.GetString(status, 0, status.Length);

            _device.Close();
        }

        internal byte GetRandomNumber(double minimum = 32.0, double maximum = 255.0)
        {
            return Convert.ToByte(new Random().NextDouble() * (maximum - minimum) + minimum);
        }

        internal byte[] PrepareCommand(byte command, byte sequence, string data = "")
        {
            byte[] request;

            if (string.IsNullOrEmpty(data))
            {
                request = PrepareCommand(command, sequence, (byte[])null);
            }
            else
            {
                var byteData = Encoding.Unicode.GetBytes(data).Where((value, index) => index % 2 == 0).ToArray();
                request = PrepareCommand(command, sequence, byteData);
            }

            return request;
        }

        internal byte[] PrepareCommand(byte command, byte sequence, byte[] byteData = null)
        {
            var request = new byte[10 + (byteData?.Length ?? 0)];
            var length = 36;
            var index = 4;
            byte[] bcc;

            if (byteData != null)
            {
                length += byteData.Length;
                var dataSum = 0;

                foreach (var item in byteData)
                {
                    request[index] = item;
                    dataSum += item;
                    ++index;
                }

                bcc = GetBcc(length + sequence + POSTAMBLE + command + dataSum);
            }
            else
            {
                bcc = GetBcc(length + sequence + POSTAMBLE + command);
            }

            request[0] = PREAMBLE;
            request[1] = Convert.ToByte(length);
            request[2] = sequence;
            request[3] = command;

            request[index] = POSTAMBLE;
            ++index;

            foreach (var item in bcc)
            {
                request[index] = item;
                ++index;
            }

            request[index] = TERMINATOR;

            return request;
        }

        private byte[] GetBcc(int number)
        {
            return number.ToString("X").PadLeft(4, '0').Select(x => Convert.ToByte("3" + x, 16)).ToArray();
        }

        internal bool ValidateMessage(byte[] response, int bytesToRead, byte sequence, byte command, out byte[] dataFromResponse)
        {
            dataFromResponse = new byte[0];
            _response = new DaisyExpertResponse();

            if (bytesToRead == 0)
            {
                return true;
            }

            var lengthFromResponse = response[1];
            var sequenceFromResponse = response[2];
            var commandFromResponse = response[3];
            var terminatorFromResponse = response[bytesToRead - 1];
            var bccFromResponse = new byte[4];

            try
            {
                bccFromResponse = new byte[] {
                response[bytesToRead - 5],
                response[bytesToRead - 4],
                response[bytesToRead - 3],
                response[bytesToRead - 2]
            };
            }
            catch (Exception e)
            {
                Log.Error(e.Message);
                Log.Warning(e.StackTrace);
                Log.Error("{Response} {Bytes} {Sequence} {Command}", string.Join(";", response.Select((b, i) => $"[{i}] {b.ToString()}")), bytesToRead, sequence, command);
                throw e;
            }

            var dataIndex = 4;
            var _dataFromResponse = new byte[RESPONSE_DATA_LENGTH];

            while (dataIndex <= 4 + RESPONSE_DATA_LENGTH && response[dataIndex] != 4 && response[dataIndex] != 0)
            {
                _dataFromResponse[dataIndex - 4] = response[dataIndex];
                ++dataIndex;
            }

            dataFromResponse = _dataFromResponse.Take(dataIndex - 4).ToArray();
            ++dataIndex;

            var statusFromResponse = new byte[RESPONSE_STATUS_LENGTH];
            var statusIndex = dataIndex;

            while (statusIndex <= dataIndex + RESPONSE_STATUS_LENGTH && response[statusIndex] != 5 && response[statusIndex] != 0)
            {
                statusFromResponse[statusIndex - dataIndex] = response[statusIndex];
                statusIndex++;
            }

            if (!CheckBCC(dataFromResponse, statusFromResponse.ToArray(), lengthFromResponse, commandFromResponse, sequenceFromResponse, bccFromResponse)
                || (sequenceFromResponse != sequence || commandFromResponse != command || terminatorFromResponse != TERMINATOR))
            {
                return false;
            }

            try
            {
                for (int index2 = 1; index2 < statusFromResponse.Length + 1; ++index2)
                    _response.SetOldData(statusFromResponse[index2 - 1], index2 - 1);
            }
            catch (Exception) { }

            return true;
        }

        private bool CheckBCC(byte[] data, byte[] status, int length, int command, int sequence, byte[] bccCheck)
        {
            int dataSum = 0;
            int statusSum = 0;

            foreach (byte num2 in data)
            {
                dataSum += num2;
            }

            foreach (byte num2 in status)
            {
                statusSum += num2;
            }

            var bccStrHex = GetBcc(length + sequence + command + dataSum + SEPARATOR + statusSum + POSTAMBLE);

            return ((IEnumerable<byte>)bccStrHex).SequenceEqual(bccCheck);
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
            }

            disposed = true;
        }
    }
}
