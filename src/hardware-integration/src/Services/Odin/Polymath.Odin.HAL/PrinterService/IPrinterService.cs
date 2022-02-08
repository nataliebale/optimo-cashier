using Polymath.Odin.HAL.Receipts;

namespace Polymath.Odin.HAL.PrinterService
{
    public interface IPrinterService
    {
        void IngenicoPrintingHandler(string Type, string Details, string Text);

        void ReceiptPrintingHandler<TReceipt, TRceiptModel>(TReceipt receipt, TRceiptModel rceiptModel)
            where TReceipt : IReceipt<TRceiptModel>
            where TRceiptModel : IReceiptModel;
    }
}
