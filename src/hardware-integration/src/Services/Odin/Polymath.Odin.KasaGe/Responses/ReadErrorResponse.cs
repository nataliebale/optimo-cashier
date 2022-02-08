using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Responses
{
    public class ReadErrorResponse : FiscalResponse
    {
        public ReadErrorResponse(byte[] buffer)
          : base(buffer)
        {
            var dataValues = GetDataValues();
            if (dataValues.Length == 0)
            {
                return;
            }

            Code = dataValues[0];
            ErrorMessage = dataValues[1];
        }

        public string Code { get; set; }

        public string ErrorMessage { get; set; }
    }
}
