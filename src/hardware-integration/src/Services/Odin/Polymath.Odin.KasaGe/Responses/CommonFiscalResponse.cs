using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Responses
{
    public class CommonFiscalResponse : FiscalResponse
    {
        public CommonFiscalResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            DocNumber = int.Parse(dataValues[0]);
        }

        public int DocNumber { get; set; }
    }
}
