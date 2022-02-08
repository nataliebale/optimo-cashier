using IngenicoCLS;
using Polymath.Odin.DaisyExpert;
using Polymath.Odin.KasaGE.Core;
using System.Collections.Generic;
using System.Linq;

namespace Polymath.Odin.HAL
{
    public class OdinResponse
    {
        public OdinResponse()
        {
        }

        public OdinResponse(FiscalResponse response)
        {
            Success = response.CommandPassed;
            Errors = new List<object>
            {
                response
            };
        }

        public OdinResponse(DaisyExpertResponse response)
        {
            Success = response.Success;
            Errors = response.Errors.Select(x => (object)x).ToList();
        }

        public bool Success { get; set; } = true;
        public List<object> Errors { get; set; } = new List<object>();
        public string ExternalId { get; set; }
        public Transaction Transaction { get; set; }
    }
}
