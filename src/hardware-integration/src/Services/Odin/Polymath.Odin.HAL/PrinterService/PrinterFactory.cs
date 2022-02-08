using Polymath.Odin.HAL.CashierService;
using Polymath.Odin.HAL.PrinterService.DaisyExpert;
using Polymath.Odin.HAL.PrinterService.Kasa;
using Polymath.Odin.HAL.PrinterService.None;
using Polymath.Odin.HAL.PrinterService.Thermal;
using Polymath.Odin.HAL.Settings;

namespace Polymath.Odin.HAL.PrinterService
{
    public class PrinterFactory
    {
        public static IPrinterService GetPrinter(OdinPrinterProvider odinPrinterProvider, ICashierService cashierService)
        {
            switch (odinPrinterProvider)
            {
                case OdinPrinterProvider.DAISY:
                    return new DaisyExpertPrinterService(cashierService);
                case OdinPrinterProvider.KASA:
                    return new KasaPrinterService(cashierService);
                case OdinPrinterProvider.THERMAL:
                    return new ThermalPrinterService(cashierService);
                default:
                    return new NoPrinterService(cashierService);
            }
        }
    }
}
