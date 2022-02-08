using System;

namespace Polymath.Odin.DaisyExpert
{
    public interface IDaisyExpertAdapter : IDisposable
    {
        DaisyExpertResponse AddOrderItem(string itemName, decimal quantity, decimal price);
        DaisyExpertResponse AddSale(decimal price, string description = "");
        DaisyExpertResponse CancelReceipt();
        DaisyExpertResponse CloseDay();
        DaisyExpertResponse CloseFiscalReceipt();
        DaisyExpertResponse CloseNonFiscalReceipt();
        DaisyExpertResponse DeviceStatus();
        DaisyExpertResponse DiagnosticInformation();
        DaisyExpertResponse NonFiscalText(string text);
        DaisyExpertResponse OpenFiscalReceipt(string orderId, int operatorId = 1, string operatorPassword = "1");
        DaisyExpertResponse OpenNonFiscalReceipt();
        DaisyExpertResponse PaperFeed(int line);
        DaisyExpertResponse Payment(decimal totalPrice, char type = 'P');
        DaisyExpertResponse XReport();
        DaisyExpertResponse ZReport();
        DaisyExpertResponse FiscalText(string text);
    }
}