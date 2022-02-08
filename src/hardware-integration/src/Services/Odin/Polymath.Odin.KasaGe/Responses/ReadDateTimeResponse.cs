using Polymath.Odin.KasaGE.Core;
using System;
using System.Globalization;

namespace Polymath.Odin.KasaGE.Responses
{
    public class ReadDateTimeResponse : FiscalResponse
    {
        public ReadDateTimeResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            DateTime = DateTime.ParseExact(dataValues[0], "dd-MM-yy HH:mm:ss", CultureInfo.InvariantCulture);
        }

        public DateTime DateTime { get; set; }
    }
}
