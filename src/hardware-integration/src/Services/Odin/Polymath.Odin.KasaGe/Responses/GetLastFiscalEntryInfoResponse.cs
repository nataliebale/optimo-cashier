using Polymath.Odin.KasaGE.Core;
using System;
using System.Globalization;

namespace Polymath.Odin.KasaGE.Responses
{
    public class GetLastFiscalEntryInfoResponse : FiscalResponse
    {
        public GetLastFiscalEntryInfoResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            nRep = int.Parse(dataValues[0]);
            Sum = decimal.Parse(dataValues[1], CultureInfo.InvariantCulture);
            Vat = decimal.Parse(dataValues[2], CultureInfo.InvariantCulture);
            Date = DateTime.ParseExact(dataValues[3], "dd-MM-yy", CultureInfo.InvariantCulture);
        }

        public int nRep { get; set; }

        public decimal Sum { get; set; }

        public decimal Vat { get; set; }

        public DateTime Date { get; set; }
    }
}
