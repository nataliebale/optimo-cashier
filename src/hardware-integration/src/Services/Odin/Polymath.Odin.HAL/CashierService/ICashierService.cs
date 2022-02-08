using Polymath.Odin.DaisyExpert;
using Polymath.Odin.HAL.Sale;
using System;

namespace Polymath.Odin.HAL.CashierService
{
    public interface ICashierService : IDisposable
    {
        void PrepareOrder(Order order);

        OdinResponse MakePayment(Order order);

        void CloseDay();

        void PrintNonFiscalText(string text);

        void PrintFiscalText(string text);

        void OpenNonFiscalReceipt();

        void CloseNonFiscalReceipt();
    }
}
