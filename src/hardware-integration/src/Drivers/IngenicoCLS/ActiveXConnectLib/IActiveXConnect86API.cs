using System;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace ActiveXConnectLib
{
    [CompilerGenerated]
    [TypeIdentifier]
    [ComImport, Guid("6481243F-DDE5-4296-9F50-C3F788EE8284")]
    public interface IActiveXConnect86API
    {
        [DispId(1)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Initialize([MarshalAs(UnmanagedType.SafeArray, SafeArraySubType = VarEnum.VT_BSTR), In] Array initParameters);

        [DispId(2)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Dispose();

        [DispId(3)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void PollEvent([In] int TimeoutInMiliseconds);

        [DispId(4)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void UnlockDevice(
          [MarshalAs(UnmanagedType.BStr), In] string IdleText,
          [MarshalAs(UnmanagedType.BStr), In] string Language,
          [MarshalAs(UnmanagedType.BStr), In] string OperatorID,
          [MarshalAs(UnmanagedType.BStr), In] string OperatorName,
          [In] long Amount,
          [MarshalAs(UnmanagedType.BStr), In] string ECRVersion,
          [MarshalAs(UnmanagedType.BStr), In] string PrepareForOperation,
          [In] long CashbackAmount);

        [DispId(5)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void LockDevice([MarshalAs(UnmanagedType.BStr), In] string IdleString);

        [DispId(6)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void CloseDay([MarshalAs(UnmanagedType.BStr), In] string OperatorID, [MarshalAs(UnmanagedType.BStr), In] string OperatorName);

        [DispId(7)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Authorize(long Amount, long CashbackAmount, [MarshalAs(UnmanagedType.BStr)] string DocumentNr, [MarshalAs(UnmanagedType.BStr)] string LastFourDigits);

        [DispId(8)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Void([MarshalAs(UnmanagedType.BStr)] string OperationID);

        [DispId(9)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void DocClosed([MarshalAs(UnmanagedType.BStr)] string DocumentNr, [MarshalAs(UnmanagedType.SafeArray, SafeArraySubType = VarEnum.VT_BSTR)] Array Operations);

        [SpecialName]
        [MethodImpl(MethodCodeType = MethodCodeType.Runtime)]
        void _VtblGap1_1();

        [DispId(11)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Input([MarshalAs(UnmanagedType.BStr)] string InputValue);

        [DispId(12)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void GetNextReceipt();

        [DispId(13)]
        string OperationResult { [DispId(13), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(14)]
        string OperationID { [DispId(14), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(15)]
        long AmountAuthorized { [DispId(15), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] get; }

        [DispId(16)]
        long AmountTips { [DispId(16), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] get; }

        [DispId(17)]
        string DocumentNr { [DispId(17), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(18)]
        string Text { [DispId(18), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(19)]
        string AuthCode { [DispId(19), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(20)]
        string RRN { [DispId(20), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(21)]
        string STAN { [DispId(21), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(22)]
        string CardType { [DispId(22), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(23)]
        string ReceiptText { [DispId(23), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(24)]
        bool ReceiptIsMerchantCopy { [DispId(24), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] get; }

        [DispId(25)]
        bool ReceiptHasSignatureLine { [DispId(25), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] get; }

        [DispId(26)]
        bool ReceiptIsClientData { [DispId(26), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] get; }

        [DispId(27)]
        string EventType { [DispId(27), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [SpecialName]
        [MethodImpl(MethodCodeType = MethodCodeType.Runtime)]
        void _VtblGap2_4();

        [DispId(32)]
        string CurrencyCode { [DispId(32), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(33)]
        string KBDKey { [DispId(33), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(34)]
        string PromptText { [DispId(34), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(35)]
        string PromptMask { [DispId(35), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [SpecialName]
        [MethodImpl(MethodCodeType = MethodCodeType.Runtime)]
        void _VtblGap3_1();

        [DispId(37)]
        Array Flags { [DispId(37), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.SafeArray, SafeArraySubType = VarEnum.VT_BSTR)] get; }

        [DispId(38)]
        string ReceiptDocumentNr { [DispId(38), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(39)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Credit(
          long Amount,
          [MarshalAs(UnmanagedType.BStr)] string DocumentNr,
          [MarshalAs(UnmanagedType.BStr)] string LastFourDigits,
          [MarshalAs(UnmanagedType.BStr)] string OriginalTime,
          [MarshalAs(UnmanagedType.BStr)] string OriginalStan,
          [MarshalAs(UnmanagedType.BStr)] string OriginalRRN);

        [DispId(40)]
        Array Option { [DispId(40), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.SafeArray, SafeArraySubType = VarEnum.VT_BSTR)] get; }

        [DispId(41)]
        string MessageBoxText { [DispId(41), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(42)]
        string MessageBoxType { [DispId(42), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [SpecialName]
        [MethodImpl(MethodCodeType = MethodCodeType.Runtime)]
        void _VtblGap4_1();

        [DispId(44)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Click([MarshalAs(UnmanagedType.BStr)] string ButtonClicked);

        [DispId(45)]
        string DisplayText { [DispId(45), MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)] [return: MarshalAs(UnmanagedType.BStr)] get; }

        [DispId(46)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void AuthorizeWithCurrency(
          long Amount,
          long CashbackAmount,
          [MarshalAs(UnmanagedType.BStr)] string DocumentNr,
          [MarshalAs(UnmanagedType.BStr)] string LastFourDigits,
          [MarshalAs(UnmanagedType.BStr)] string CurrencyCode);

        [DispId(47)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void CreditWithCurrency(
          long Amount,
          [MarshalAs(UnmanagedType.BStr)] string DocumentNr,
          [MarshalAs(UnmanagedType.BStr)] string LastFourDigits,
          [MarshalAs(UnmanagedType.BStr)] string OriginalTime,
          [MarshalAs(UnmanagedType.BStr)] string OriginalStan,
          [MarshalAs(UnmanagedType.BStr)] string OriginalRRN,
          [MarshalAs(UnmanagedType.BStr)] string CurrencyCode);

        [SpecialName]
        [MethodImpl(MethodCodeType = MethodCodeType.Runtime)]
        void _VtblGap5_1();

        [DispId(49)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void PrintTotals([MarshalAs(UnmanagedType.BStr)] string OperatorID, [MarshalAs(UnmanagedType.BStr)] string OperatorName);

        [SpecialName]
        [MethodImpl(MethodCodeType = MethodCodeType.Runtime)]
        void _VtblGap6_4();

        [DispId(54)]
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        void Selected([MarshalAs(UnmanagedType.BStr), In] string Option);
    }
}
