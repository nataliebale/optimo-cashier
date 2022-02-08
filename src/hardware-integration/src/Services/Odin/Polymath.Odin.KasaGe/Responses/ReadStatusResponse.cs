using Polymath.Odin.KasaGE.Core;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Responses
{
    public class ReadStatusResponse : FiscalResponse
    {
        public ReadStatusResponse(byte[] buffer)
          : base(buffer)
        {
            if (!CommandPassed)
            {
                return;
            }

            var stringList = new List<string>();
            for (var byteIndex = 0; byteIndex < 6; ++byteIndex)
            {
                stringList.Add(getStatusValue(Data[byteIndex], byteIndex));
            }

            stringList.RemoveAll(x => x == string.Empty);
            Status = stringList.ToArray();
        }

        public string[] Status { get; set; }

        private string getStatusValue(byte statusByte, int byteIndex)
        {
            switch (byteIndex)
            {
                case 0:
                    if ((statusByte & 32) > 0)
                    {
                        return "General error - this is OR of all errors marked with #";
                    }

                    if ((statusByte & 2) > 0)
                    {
                        return "# Command code is invalid.";
                    }

                    if ((statusByte & 1) > 0)
                    {
                        return "# Syntax error.";
                    }

                    goto case 3;
                case 1:
                    if ((statusByte & 2) > 0)
                    {
                        return "# Command is not permitted.";
                    }

                    if ((statusByte & 1) > 0)
                    {
                        return "# Overflow during command execution.";
                    }

                    goto case 3;
                case 2:
                    if ((statusByte & 32) > 0)
                    {
                        return "Nonfiscal receipt is open.";
                    }

                    if ((statusByte & 16) > 0)
                    {
                        return "EJ nearly full.";
                    }

                    if ((statusByte & 8) > 0)
                    {
                        return "Fiscal receipt is open.";
                    }

                    if ((statusByte & 4) > 0)
                    {
                        return "EJ is full.";
                    }

                    if ((statusByte & 1) > 0)
                    {
                        return "# End of paper.";
                    }

                    goto case 3;
                case 3:
                    return string.Empty;
                case 4:
                    if ((statusByte & 32) > 0)
                    {
                        return " OR of all errors marked with ‘*’ from Bytes 4 and 5.";
                    }

                    if ((statusByte & 16) > 0)
                    {
                        return "* Fiscal memory is full.";
                    }

                    if ((statusByte & 8) > 0)
                    {
                        return "There is space for less then 50 reports in Fiscal memory.";
                    }

                    if ((statusByte & 4) > 0)
                    {
                        return "FM module doesn't exist.";
                    }

                    if ((statusByte & 2) > 0)
                    {
                        return "Tax number is set.";
                    }

                    if ((statusByte & 1) > 0)
                    {
                        return "* Error while writing in FM.";
                    }

                    return string.Empty;
                case 5:
                    if ((statusByte & 16) > 0)
                    {
                        return "VAT are set at least once.";
                    }

                    if ((statusByte & 8) > 0)
                    {
                        return "ECR is fiscalized.";
                    }

                    if ((statusByte & 2) > 0)
                    {
                        return "FM is formated.";
                    }

                    goto case 3;
                default:
                    return string.Empty;
            }
        }
    }
}
