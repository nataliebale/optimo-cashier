using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Responses
{
    public class SubTotalResponse : FiscalResponse
    {
        public SubTotalResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            decimal result;
            if (dataValues.Length == 0 || !decimal.TryParse(dataValues[1], out result))
            {
                return;
            }

            SubTotal = result;
        }

        public decimal SubTotal { get; set; }

        public string TaxX { get; set; }

        public int SlipNumber { get; set; }

        public int DocNumber { get; set; }
    }
}
