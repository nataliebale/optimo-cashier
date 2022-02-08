using System;
using System.Runtime.InteropServices;

namespace ActiveXConnectLib
{
    public class ActiveXConnect64API : IActiveXConnectAPI
    {
        private readonly IActiveXConnect64API _api;

        public ActiveXConnect64API()
        {
            _api = (IActiveXConnect64API)Activator.CreateInstance(Marshal.GetTypeFromCLSID(new Guid("3046CD68-01D5-473A-8A39-70460AC6BC76")));
        }

        public string OperationResult => _api.OperationResult;

        public string OperationID => _api.OperationID;

        public long AmountAuthorized => _api.AmountAuthorized;

        public long AmountTips => _api.AmountTips;

        public string DocumentNr => _api.DocumentNr;

        public string Text => _api.Text;

        public string AuthCode => _api.AuthCode;

        public string RRN => _api.RRN;

        public string STAN => _api.STAN;

        public string CardType => _api.CardType;

        public string ReceiptText => _api.ReceiptText;

        public bool ReceiptIsMerchantCopy => _api.ReceiptIsMerchantCopy;

        public bool ReceiptHasSignatureLine => _api.ReceiptHasSignatureLine;

        public bool ReceiptIsClientData => _api.ReceiptIsClientData;

        public string EventType => _api.EventType;

        public string CurrencyCode => _api.CurrencyCode;

        public string KBDKey => _api.KBDKey;

        public string PromptText => _api.PromptText;

        public string PromptMask => _api.PromptText;

        public Array Flags => _api.Flags;

        public string ReceiptDocumentNr => _api.ReceiptDocumentNr;

        public Array Option => _api.Option;

        public string MessageBoxText => _api.MessageBoxText;

        public string MessageBoxType => _api.MessageBoxType;

        public string DisplayText => _api.DisplayText;

        public void Authorize(long Amount, long CashbackAmount, string DocumentNr, string LastFourDigits)
            => _api.Authorize(Amount, CashbackAmount, DocumentNr, LastFourDigits);

        public void AuthorizeWithCurrency(long Amount, long CashbackAmount, string DocumentNr, string LastFourDigits, string CurrencyCode)
            => _api.AuthorizeWithCurrency(Amount, CashbackAmount, DocumentNr, LastFourDigits, CurrencyCode);

        public void Click(string ButtonClicked)
            => _api.Click(ButtonClicked);

        public void CloseDay(string OperatorId, string OperatorName)
            => _api.CloseDay(OperatorId, OperatorName);

        public void Credit(long Amount, string DocumentNr, string LastFourDigits, string OriginalTime, string OriginalStan, string OriginalRRN)
            => _api.Credit(Amount, DocumentNr, LastFourDigits, OriginalTime, OriginalStan, OriginalRRN);

        public void CreditWithCurrency(long Amount, string DocumentNr, string LastFourDigits, string OriginalTime, string OriginalStan, string OriginalRRN, string CurrencyCode)
            => _api.CreditWithCurrency(Amount, DocumentNr, LastFourDigits, OriginalTime, OriginalStan, OriginalRRN, CurrencyCode);

        public void Dispose()
            => _api.Dispose();

        public void DocClosed(string DocumentNr, Array Operations)
            => _api.DocClosed(DocumentNr, Operations);

        public void GetNextReceipt()
            => _api.GetNextReceipt();

        public void Initialize(Array initParameters)
            => _api.Initialize(initParameters);

        public void Input(string InputValue)
            => _api.Input(InputValue);

        public void LockDevice(string IdleString)
            => _api.LockDevice(IdleString);

        public void PollEvent(int TimeoutInMiliseconds)
            => _api.PollEvent(TimeoutInMiliseconds);

        public void PrintTotals(string OperatorID, string OperatorName)
            => _api.PrintTotals(OperatorID, OperatorName);

        public void Selected(string Option)
            => _api.Selected(Option);

        public void UnlockDevice(string IdleText, string Language, string OperatorID, string OperatorName, long Amount, string ECRVersion, string PrepareForOperation, long CashbackAmount)
            => _api.UnlockDevice(IdleText, Language, OperatorID, OperatorName, Amount, ECRVersion, PrepareForOperation, CashbackAmount);

        public void Void(string OperationID)
            => _api.Void(OperationID);

        public void _VtblGap1_1()
            => _api._VtblGap1_1();

        public void _VtblGap2_4()
            => _api._VtblGap2_4();

        public void _VtblGap3_1()
            => _api._VtblGap3_1();

        public void _VtblGap4_1()
            => _api._VtblGap4_1();

        public void _VtblGap5_1()
            => _api._VtblGap5_1();

        public void _VtblGap6_4()
            => _api._VtblGap6_4();
    }
}
