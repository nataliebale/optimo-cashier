using System;

namespace ActiveXConnectLib
{
    public interface IActiveXConnectAPI
    {
        void Initialize(Array initParameters);

        void Dispose();

        void PollEvent(int TimeoutInMiliseconds);

        void UnlockDevice(
           string IdleText,
           string Language,
           string OperatorID,
           string OperatorName,
           long Amount,
           string ECRVersion,
           string PrepareForOperation,
           long CashbackAmount);

        void LockDevice(string IdleString);

        void CloseDay(string OperatorID, string OperatorName);

        void Authorize(long Amount, long CashbackAmount, string DocumentNr, string LastFourDigits);

        void Void(string OperationID);

        void DocClosed(string DocumentNr,Array Operations);

        void _VtblGap1_1();

        void Input(string InputValue);

        void GetNextReceipt();

        string OperationResult { get; }

        string OperationID { get; }

        long AmountAuthorized { get; }

        long AmountTips { get; }

        string DocumentNr { get; }

        string Text { get; }

        string AuthCode { get; }

        string RRN { get; }

        string STAN { get; }

        string CardType { get; }

        string ReceiptText { get; }

        bool ReceiptIsMerchantCopy { get; }

        bool ReceiptHasSignatureLine { get; }

        bool ReceiptIsClientData { get; }

        string EventType { get; }

        void _VtblGap2_4();

        string CurrencyCode { get; }

        string KBDKey { get; }

        string PromptText { get; }

        string PromptMask { get; }

        void _VtblGap3_1();

        Array Flags { get; }

        string ReceiptDocumentNr { get; }

        void Credit(
          long Amount,
           string DocumentNr,
           string LastFourDigits,
           string OriginalTime,
           string OriginalStan,
           string OriginalRRN);

        Array Option { get; }

        string MessageBoxText { get; }

        string MessageBoxType { get; }

        void _VtblGap4_1();

        void Click(string ButtonClicked);

        string DisplayText { get; }

        void AuthorizeWithCurrency(
          long Amount,
          long CashbackAmount,
           string DocumentNr,
           string LastFourDigits,
           string CurrencyCode);

        void CreditWithCurrency(
          long Amount,
           string DocumentNr,
           string LastFourDigits,
           string OriginalTime,
           string OriginalStan,
           string OriginalRRN,
           string CurrencyCode);

        void _VtblGap5_1();

        void PrintTotals(string OperatorID, string OperatorName);

        void _VtblGap6_4();

        void Selected(string Option);
    }
}
