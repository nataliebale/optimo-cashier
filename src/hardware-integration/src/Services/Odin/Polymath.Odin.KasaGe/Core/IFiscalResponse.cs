using Polymath.Odin.IntegrationShared;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Core
{
    public interface IFiscalResponse
    {
        bool CommandPassed { get; }

        string ErrorCode { get; set; }

        List<CashierResponseBytes> Statuses { get; set; }
    }
}
