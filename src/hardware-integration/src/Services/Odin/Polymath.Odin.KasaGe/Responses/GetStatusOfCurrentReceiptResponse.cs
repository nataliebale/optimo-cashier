using Polymath.Odin.KasaGE.Core;
using System.Globalization;

namespace Polymath.Odin.KasaGE.Responses
{
    public class GetStatusOfCurrentReceiptResponse : FiscalResponse
    {
        public GetStatusOfCurrentReceiptResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            switch (dataValues[0])
            {
                case "0":
                    Value = "Receipt is closed;";
                    break;
                case "1":
                    Value = "Sales receipt is open;";
                    break;
                case "2":
                    Value = "Return receipt is open;";
                    break;
                case "3":
                    Value = "Sales receipt is open and payment is executed (already closed in SAM) - closing command (command 56) should be used;";
                    break;
                case "4":
                    Value = "Return receipt is open and payment is executed (already closed in SAM) - closing command (command 56) should be used;";
                    break;
                case "5":
                    Value = "Sales or return receipt was open, but all void is executed and receipt is turned to a non fiscal - closing command (commands 39 or 56) should be used;";
                    break;
                case "6":
                    Value = "Non fiscal receipt is open - closing command (command 39) should be used;";
                    break;
                default:
                    Value = "Unknown";
                    break;
            }
            Items = int.Parse(dataValues[1]);
            Amount = decimal.Parse(dataValues[2], CultureInfo.InvariantCulture);
            Sum = decimal.Parse(dataValues[3], CultureInfo.InvariantCulture);
            SlipNumber = int.Parse(dataValues[4]);
            DocNumber = int.Parse(dataValues[5]);
        }

        public string Value { get; set; }

        public int Items { get; set; }

        public decimal Amount { get; set; }

        public decimal Sum { get; set; }

        public int SlipNumber { get; set; }

        public int DocNumber { get; set; }
    }
}
