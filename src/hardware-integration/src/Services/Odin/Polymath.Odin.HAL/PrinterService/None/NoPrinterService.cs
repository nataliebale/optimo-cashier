using Polymath.Odin.HAL.CashierService;

namespace Polymath.Odin.HAL.PrinterService.None
{
    public class NoPrinterService : PrinterService
    {
        public NoPrinterService(ICashierService cashierService) : base(cashierService)
        {
        }

        public override void IngenicoPrintingHandler(string Type, string Details, string Text) { }

        public override void ReceiptPrintingHandler<TReceipt, TRceiptModel>(TReceipt receipt, TRceiptModel rceiptModel) { }
    }
}
