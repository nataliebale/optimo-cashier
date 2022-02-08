using Polymath.Odin.HAL.CashierService.DaisyExpert;
using Polymath.Odin.HAL.CashierService.Kasa;
using Polymath.Odin.HAL.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Polymath.Odin.HAL.CashierService
{
    public class CashierFactory
    {
        public static ICashierService GetCashier(OdinCashierProvider cashierProvider, string portName)
        {
            switch (cashierProvider)
            {
                case OdinCashierProvider.DAISY:
                    return DaisyExpertService.GetInstance(portName);
                case OdinCashierProvider.KASA:
                    return KasaService.GetInstance(portName);
                default:
                    return null;
            }
        }

        public static string GetCashierPort(OdinCashierProvider cashierProvider)
        {
            switch (cashierProvider)
            {
                case OdinCashierProvider.DAISY:
                    return DaisyExpertService.GetCashierPort();
                case OdinCashierProvider.KASA:
                    return KasaService.GetCashierPort();
                default:
                    return null;
            }
        }
    }
}
