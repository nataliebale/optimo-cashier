using Polymath.Odin.IntegrationShared;
using Polymath.Odin.IntegrationShared.Exceptions;
using Polymath.Odin.KasaGE.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Polymath.Odin.KasaGE.Core
{
    public abstract class FiscalResponse : IFiscalResponse
    {
        protected FiscalResponse(byte[] buffer)
        {
            var ioException = new IOException("Invalid packet received.");
            if (buffer.Length < 27)
            {
                throw ioException;
            }

            if (buffer[0] != 1)
            {
                throw ioException;
            }

            if (buffer[buffer.Length - 1] != 3)
            {
                throw ioException;
            }

            var num1 = Array.IndexOf<byte>(buffer, 4);
            var num2 = Array.IndexOf<byte>(buffer, 5);
            if (num1 == -1 || num2 == -1)
            {
                throw ioException;
            }

            if (num2 - num1 != 9)
            {
                throw ioException;
            }

            var array = ((IEnumerable<byte>)buffer).Skip<byte>(10).Take<byte>(num1 - 10).ToArray<byte>();
            if (array.Length < 2)
            {
                throw ioException;

            }

            var statuses = buffer.Skip(num1 + 1).Take(8).ToArray();
            for (var byteNum = 0; byteNum < 8; byteNum++)
            {
                var indexes = Convert.ToString(statuses[byteNum], 2).ToCharArray();
                Array.Reverse(indexes);
                var responses = new List<CashierResponseBytes>();
                byte i = 0;

                foreach (var index in indexes)
                {
                    if (index == '1')
                    {
                        responses.Add(CashierResponseBytes.Bytes[byteNum][i]);
                    }

                    ++i;
                }

                Statuses.AddRange(responses);
            }

            if (((IEnumerable<byte>)array).First<byte>() != 48)
            {
                ErrorCode = array.GetString().Trim();
                switch (ErrorCode)
                {
                    case "-111024":
                        throw new SumsOverflowException();
                }
            }
            else
            {
                Data = ((IEnumerable<byte>)array).Skip<byte>(2).Take<byte>(array.Length - 2).ToArray<byte>();
            }
        }

        public bool CommandPassed
        {
            get
            {
                return string.IsNullOrEmpty(ErrorCode);
            }
        }

        public string ErrorCode { get; set; }
        public List<CashierResponseBytes> Statuses { get; set; } = new List<CashierResponseBytes>();
        protected byte[] Data { get; set; }

        protected string[] GetDataValues()
        {
            if (!CommandPassed)
            {
                return new string[0];
            }

            return Data.GetString().Split('\t');
        }
    }
}
