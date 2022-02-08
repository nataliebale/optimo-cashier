using Polymath.Odin.KasaGE.Core;
using System.Globalization;

namespace Polymath.Odin.KasaGE.Responses
{
    public class PrintReportResponse : FiscalResponse
    {
        public PrintReportResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            nRep = int.Parse(dataValues[0]);
            TotX = decimal.Parse(dataValues[1], CultureInfo.InvariantCulture);
            TotNegX = decimal.Parse(dataValues[2], CultureInfo.InvariantCulture);
        }

        public int nRep { get; set; }

        public decimal TotX { get; set; }

        public decimal TotNegX { get; set; }
    }
}
