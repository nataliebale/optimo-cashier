using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Responses
{
    public class CloseFiscalReceiptResponse : FiscalResponse
    {
        public CloseFiscalReceiptResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length < 3)
            {
                return;
            }

            int result;
            if (int.TryParse(dataValues[0], out result))
            {
                SlipNumber = result;
            }

            if (int.TryParse(dataValues[1], out result))
            {
                SlipNumberOfThisType = result;
            }

            if (!int.TryParse(dataValues[2], out result))
            {
                return;
            }

            DocNumber = result;
        }

        public int SlipNumber { get; set; }

        public int SlipNumberOfThisType { get; set; }

        public int DocNumber { get; set; }
    }
}
