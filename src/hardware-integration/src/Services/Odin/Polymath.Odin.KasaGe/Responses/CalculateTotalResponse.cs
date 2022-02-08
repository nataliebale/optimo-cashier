using Polymath.Odin.KasaGE.Core;
using System.Globalization;

namespace Polymath.Odin.KasaGE.Responses
{
    public class CalculateTotalResponse : FiscalResponse
    {
        public CalculateTotalResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            Status = dataValues[0];
            Amount = decimal.Parse(dataValues[1], CultureInfo.InvariantCulture);
            SlipNumber = int.Parse(dataValues[2]);
            DocNumber = int.Parse(dataValues[3]);
        }

        public string Status { get; set; }

        public decimal Amount { get; set; }

        public int SlipNumber { get; set; }

        public int DocNumber { get; set; }
    }
}
