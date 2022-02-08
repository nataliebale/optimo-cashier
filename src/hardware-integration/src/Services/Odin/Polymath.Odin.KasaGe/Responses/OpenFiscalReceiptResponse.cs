using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Responses
{
    public class OpenFiscalReceiptResponse : FiscalResponse
    {
        public OpenFiscalReceiptResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            int result;
            if (int.TryParse(dataValues[0], out result))
            {
                SlipNumber = result;
            }

            if (!int.TryParse(dataValues[1], out result))
            {
                return;
            }

            DocNumber = result;
        }

        public int SlipNumber { get; set; }

        public int DocNumber { get; set; }
    }
}
