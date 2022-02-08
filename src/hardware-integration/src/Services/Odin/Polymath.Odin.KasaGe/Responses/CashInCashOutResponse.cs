using Polymath.Odin.KasaGE.Core;
using System.Globalization;

namespace Polymath.Odin.KasaGE.Responses
{
    public class CashInCashOutResponse : FiscalResponse
    {
        public CashInCashOutResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            CashSum = decimal.Parse(dataValues[0], CultureInfo.InvariantCulture);
            CashIn = decimal.Parse(dataValues[1], CultureInfo.InvariantCulture);
            CashOut = decimal.Parse(dataValues[2], CultureInfo.InvariantCulture);
            DocNumber = int.Parse(dataValues[3]);
        }

        public decimal CashSum { get; set; }

        public decimal CashIn { get; set; }

        public decimal CashOut { get; set; }

        public int DocNumber { get; set; }
    }
}
