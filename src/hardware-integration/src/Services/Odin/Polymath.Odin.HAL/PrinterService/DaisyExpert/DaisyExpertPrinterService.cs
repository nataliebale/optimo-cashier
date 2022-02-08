using Polymath.Odin.HAL.CashierService;

namespace Polymath.Odin.HAL.PrinterService.DaisyExpert
{
    public class DaisyExpertPrinterService : PrinterService
    {
        public DaisyExpertPrinterService(ICashierService cashierService) : base(cashierService)
        {
        }

        public override void IngenicoPrintingHandler(string Type, string Details, string Text)
        {
            if (Type == "OnPrint" && Details == "TEXT")
            {
                if (!printing && Text == "--------------------------")
                {
                    printing = true;
                    _cashier.PrepareOrder(null);
                    _cashier.OpenNonFiscalReceipt();
                    return;
                }

                if (printing && Text != "--------------------------")
                {

                    PrintText(Text);
                    return;
                }

                if (printing && Text == "--------------------------")
                {
                    printing = false;
                    _cashier.CloseNonFiscalReceipt();
                    return;
                }
            }
        }

        public override void ReceiptPrintingHandler<TReceipt, TRceiptModel>(TReceipt receipt, TRceiptModel rceiptModel) { }
    }
}
