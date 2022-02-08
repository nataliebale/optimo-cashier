using System.Collections.Generic;

namespace Polymath.Odin.HAL.Settings
{
    public class OdingSettings
    {
        public OdinPrinterProvider ReceiptPrinter { get; set; }
        public OdinCashierProvider Cashier { get; set; }
        public IEnumerable<OdinCardProvider> Card { get; set; }
        public OdinPrinterSettings PrinterSettings { get; set; } 
        public string CashierPort { get; set; }
        public string DeviceId { get; set; }
        public OdinProductType? ProductType { get; set; }
        public OdinEnvironment Env { get; set; }
    }
}
