using Polymath.Odin.HAL.PrinterService;
using System.Collections.Generic;

namespace Polymath.Odin.HAL.Receipts
{
    public interface IReceipt<T> where T : IReceiptModel
    {
        IEnumerable<PrinterPageLine> PrepareReceipt(T receiptModel);
    }
}
