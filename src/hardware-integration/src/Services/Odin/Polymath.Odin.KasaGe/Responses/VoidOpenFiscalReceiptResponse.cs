using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Responses
{
    public class VoidOpenFiscalReceiptResponse : FiscalResponse
    {
        public VoidOpenFiscalReceiptResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            SlipNumber = int.Parse(dataValues[0]);
            DocNumber = int.Parse(dataValues[1]);
        }

        public int SlipNumber { get; set; }

        public int DocNumber { get; set; }
    }
}
