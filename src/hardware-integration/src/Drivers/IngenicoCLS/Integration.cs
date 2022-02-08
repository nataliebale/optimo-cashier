using ActiveXConnectLib;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;

namespace IngenicoCLS
{
    public class Integration : IntegrationDefaults
    {
        private IActiveXConnectAPI _api = null;

        [DefaultValue("999")]
        protected string OperID { get; set; }

        [DefaultValue("John")]
        protected string OperName { get; set; }

        [DefaultValue("EN")]
        protected string Lang { get; set; }

        private Constants.SelectHandler selectHandler { get; set; }

        private Constants.PromptHandler promptHandler { get; set; }

        private Constants.MessageHandler messageHandler { get; set; }

        public IActiveXConnectAPI GetAPI()
        {
            if (this._api == null)
            {
                //x64: 3046CD68-01D5-473A-8A39-70460AC6BC76
                //x86: C35EE0FC-6F7A-40E8-81DD-B7C2E808D2C2
                if (IntPtr.Size == 4)
                {
                    this._api = new ActiveXConnect86API();
                }
                else if (IntPtr.Size == 8)
                {
                    this._api = new ActiveXConnect64API();
                }

                // ISSUE: reference to a compiler-generated method
                this._api.Initialize(new string[4]
                {
                  "OnSelectEventSupported",
                  "ReceiptControlSymbolsNotSupported",
                  "OnDisplayTextEventSupported",
                  "OnMessageBoxEventSupported"
                });
                if (this._api.OperationResult != "OK")
                {
                    this.debug("INIT", "FAIL");
                    // ISSUE: reference to a compiler-generated method
                    this._api.Dispose();
                    this._api = null;
                    // ISSUE: variable of a compiler-generated type
                    IActiveXConnectAPI activeXconnectApi = null;
                    return activeXconnectApi;
                }
                // ISSUE: variable of a compiler-generated type
                var api = this._api;
                return api;
            }
            // ISSUE: variable of a compiler-generated type
            var api1 = this._api;
            return api1;
        }

        public void DisposeAPI()
        {
            if (this._api == null)
                return;
            // ISSUE: reference to a compiler-generated method
            this._api.Dispose();
        }

        public bool ApiPrintTotals()
        {
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
                return false;
            if (!this.UnlockDevice(this.OperID, this.OperName, "", 0L, ""))
            {
                this.debug("UNLOCK", "Failed to unlock device");
                return false;
            }
            this.debug("PRINTTOTALS", "PrintTotals method called");
            // ISSUE: reference to a compiler-generated method
            api.PrintTotals(this.OperID, this.OperName);
            this.debug("PRINTTOTALS", "Waiting for OnPrintTotalsResult event...");
            if (!this.ProcessEventsUntil(api, "OnPrintTotalsResult", 130))
                return false;
            string operationResult = api.OperationResult;
            this.debug("PRINTTOTALS", string.Format("OnPrintTotalsResult received with result={0}", operationResult));
            return operationResult == "OK";
        }

        public bool ApiCloseDay()
        {
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
                return false;
            if (!this.UnlockDevice(this.OperID, this.OperName, "", 0L, ""))
            {
                this.debug("UNLOCK", "Failed to unlock device");
                return false;
            }
            this.debug("CLOSEDAY", "CloseDay method called");
            // ISSUE: reference to a compiler-generated method
            api.CloseDay(this.OperID, this.OperName);
            this.debug("CLOSEDAY", "Waiting for OnCloseDayResult event...");
            if (!this.ProcessEventsUntil(api, "OnCloseDayResult", 130))
                return false;
            string operationResult = api.OperationResult;
            this.debug("CLOSEDAY", string.Format("OnCloseDayResult received with result={0}", operationResult));
            return operationResult == "OK";
        }

        public bool CloseDocument(Document document)
        {
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
                return false;
            this.debug("CLOSEDOC", string.Format("Closing document {0}", document.DocumentNr));
            List<string> stringList = new List<string>();
            if (document.Transactions != null)
            {
                foreach (Transaction transaction in document.Transactions)
                    stringList.Add(transaction.OperationID);
            }
            // ISSUE: reference to a compiler-generated method
            api.DocClosed(document.DocumentNr, stringList.ToArray());
            this.debug("CLOSEDOC", "DocClosed method called, waiting for OnDocClosedResult event...");
            if (!this.ProcessEventsUntil(api, "OnDocClosedResult", 15))
            {
                this.debug("CLOSEDOC", "Timeout waiting for OnDocClosedResult");
                return false;
            }
            string operationResult = api.OperationResult;
            this.debug("CLOSEDOC", string.Format("OnDocClosedResult event received with OperationResult={0}", operationResult));
            return operationResult == "OK";
        }

        public bool LockDevice(string text)
        {
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
                return false;
            // ISSUE: reference to a compiler-generated method
            api.LockDevice(text);
            return this.ProcessEventsUntil(api, "OnLockDeviceResult", 15) && !(api.OperationResult != "OK");
        }

        public bool UnlockDevice(
          string operatorID,
          string operatorName,
          string operation,
          long amount,
          string text)
        {
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
                return false;
            // ISSUE: reference to a compiler-generated method
            api.UnlockDevice(text, this.Lang, operatorID, operatorName, amount, "1.0", operation, 0L);
            return this.ProcessEventsUntil(api, "OnUnlockDeviceResult", 15) && !(api.OperationResult != "OK");
        }

        public long Authorize(
          long amount,
          string documentNr,
          string currencyCode,
          out Transaction transaction)
        {
            transaction = new Transaction();
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
            {
                transaction.ErrorText = "Failed to load API library";
                return 0;
            }
            this.debug("AUTHORIZE", "Waiting for OnCard event (insert card)...");
            while (true)
            {
                if (this.ProcessEventsUntil(api, "OnCard", 30))
                {
                    if (!this.ContainsFlag(api.Flags, "AllowAuthorize"))
                        this.debug("AUTHORIZE", "This is not payment card, most probably it's loyalty/discount card, so calculate discount/loyalty points here... and wait for next CARD event");
                    else
                        goto label_5;
                }
                else
                    break;
            }
            transaction.ErrorText = "Timeout waiting for card to be inserted into device";
            return 0;
        label_5:
            this.debug("AUTHORIZE", "CARD is payment card");
            if (api.CurrencyCode != currencyCode)
            {
                transaction.ErrorText = string.Format("Currency '{0}' code is not supported", api.CurrencyCode);
                return 0;
            }
            string LastFourDigits = null;
            if (this.ContainsFlag(api.Flags, "ReqLastFourDigits"))
                LastFourDigits = this.promptHandler("Please enter last 4 digits of the card", "NNNN");
            // ISSUE: reference to a compiler-generated method
            api.Authorize(amount, 0L, documentNr, LastFourDigits);
            this.debug("AUTHORIZE", "Authorize method called, waiting for OnAuthorizeResult event...");
            if (!this.ProcessEventsUntil(api, "OnAuthorizeResult", 100))
            {
                transaction.ErrorText = "Timeout waiting for OnAuthorizeResult";
                return 0;
            }
            string operationResult = api.OperationResult;
            transaction.OperationID = api.OperationID;
            transaction.AmountAuthorized = api.AmountAuthorized;
            transaction.AmountTips = api.AmountTips;
            transaction.OperationResult = operationResult;
            transaction.AuthCode = api.AuthCode;
            transaction.RRN = api.RRN;
            transaction.CardType = api.CardType;
            transaction.DocumentNr = api.DocumentNr;
            transaction.ErrorText = api.Text;
            transaction.STAN = api.STAN;
            return transaction.AmountAuthorized;
        }

        public long AuthorizeWithCurrency(
          long amount,
          string documentNr,
          string currencyCode,
          out Transaction transaction)
        {
            transaction = new Transaction();
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
            {
                transaction.ErrorText = "Failed to load API library";
                return 0;
            }
            this.debug("AUTHORIZEWCURR", "Waiting for OnCard event (insert card)...");
            while (true)
            {
                if (this.ProcessEventsUntil(api, "OnCard", 30))
                {
                    if (!this.ContainsFlag(api.Flags, "AllowAuthorize"))
                        this.debug("AUTHORIZEWCURR", "This is not payment card, most probably it's loyalty/discount card, so calculate discount/loyalty points here... and wait for next CARD event");
                    else
                        goto label_5;
                }
                else
                    break;
            }
            transaction.ErrorText = "Timeout waiting for card to be inserted into device";
            return 0;
        label_5:
            this.debug("AUTHORIZEWCURR", "CARD is payment card");
            string LastFourDigits = null;
            if (this.ContainsFlag(api.Flags, "ReqLastFourDigits"))
            {
                //Console.WriteLine("Please enter last 4 digits of the card");
                LastFourDigits = Console.ReadLine();
            }
            // ISSUE: reference to a compiler-generated method
            api.AuthorizeWithCurrency(amount, 0L, documentNr, LastFourDigits, currencyCode);
            this.debug("AUTHORIZEWCURR", "AuthorizeWithCurrency  method called, waiting for OnAuthorizeResult event...");
            if (!this.ProcessEventsUntil(api, "OnAuthorizeResult", 100))
            {
                transaction.ErrorText = "Timeout waiting for OnAuthorizeResult";
                return 0;
            }
            string operationResult = api.OperationResult;
            transaction.OperationID = api.OperationID;
            transaction.AmountAuthorized = api.AmountAuthorized;
            transaction.AmountTips = api.AmountTips;
            transaction.OperationResult = operationResult;
            transaction.AuthCode = api.AuthCode;
            transaction.RRN = api.RRN;
            transaction.CardType = api.CardType;
            transaction.DocumentNr = api.DocumentNr;
            transaction.ErrorText = api.Text;
            transaction.STAN = api.STAN;
            return transaction.AmountAuthorized;
        }

        public long Credit(
          long amount,
          string documentNr,
          string currencyCode,
          out Transaction transaction)
        {
            transaction = new Transaction();
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
            {
                transaction.ErrorText = "Failed to load API library";
                return 0;
            }
            this.debug("CREDIT", "Waiting for OnCard event (insert card)...");
            while (true)
            {
                if (this.ProcessEventsUntil(api, "OnCard", 30))
                {
                    if (!this.ContainsFlag(api.Flags, "AllowAuthorize"))
                        this.debug("CREDIT", "This is not payment card, most probably it's loyalty/discount card, so calculate discount/loyalty points here... and wait for next CARD event");
                    else
                        goto label_5;
                }
                else
                    break;
            }
            transaction.ErrorText = "Timeout waiting for card to be inserted into device";
            return 0;
        label_5:
            this.debug("CREDIT", "CARD is payment card");
            if (api.CurrencyCode != currencyCode)
            {
                transaction.ErrorText = string.Format("Currency '{0}' code is not supported", api.CurrencyCode);
                return 0;
            }
            string LastFourDigits = null;
            if (this.ContainsFlag(api.Flags, "ReqLastFourDigits"))
            {
                //Console.WriteLine("Please enter last 4 digits of the card");
                LastFourDigits = Console.ReadLine();
            }
            // ISSUE: reference to a compiler-generated method
            api.Credit(amount, documentNr, LastFourDigits, null, null, null);
            this.debug("CREDIT", "Credit method called, waiting for OnAuthorizeResult event...");
            if (!this.ProcessEventsUntil(api, "OnCreditResult", 100))
            {
                transaction.ErrorText = "Timeout waiting for OnAuthorizeResult";
                return 0;
            }
            string operationResult = api.OperationResult;
            transaction.OperationID = api.OperationID;
            transaction.AmountAuthorized = api.AmountAuthorized;
            transaction.AmountTips = api.AmountTips;
            transaction.OperationResult = operationResult;
            transaction.AuthCode = api.AuthCode;
            transaction.RRN = api.RRN;
            transaction.CardType = api.CardType;
            transaction.DocumentNr = api.DocumentNr;
            transaction.ErrorText = api.Text;
            transaction.STAN = api.STAN;
            return transaction.AmountAuthorized;
        }

        public long CreditWithCurrency(
          long amount,
          string documentNr,
          string currencyCode,
          out Transaction transaction)
        {
            transaction = new Transaction();
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
            {
                transaction.ErrorText = "Failed to load API library";
                return 0;
            }
            this.debug("CREDITWCURR", "Waiting for OnCard event (insert card)...");
            while (true)
            {
                if (this.ProcessEventsUntil(api, "OnCard", 30))
                {
                    if (!this.ContainsFlag(api.Flags, "AllowAuthorize"))
                        this.debug("CREDITWCURR", "This is not payment card, most probably it's loyalty/discount card, so calculate discount/loyalty points here... and wait for next CARD event");
                    else
                        goto label_5;
                }
                else
                    break;
            }
            transaction.ErrorText = "Timeout waiting for card to be inserted into device";
            return 0;
        label_5:
            this.debug("CREDITWCURR", "CARD is payment card");
            string LastFourDigits = null;
            if (this.ContainsFlag(api.Flags, "ReqLastFourDigits"))
                LastFourDigits = this.promptHandler("Please enter last 4 digits of the card", "NNNN");
            // ISSUE: reference to a compiler-generated method
            api.CreditWithCurrency(amount, documentNr, LastFourDigits, null, null, null, currencyCode);
            this.debug("CREDITWCURR", "Credit with currency (" + currencyCode + ") method called, waiting for OnAuthorizeResult event...");
            if (!this.ProcessEventsUntil(api, "OnCreditResult", 100))
            {
                transaction.ErrorText = "Timeout waiting for OnAuthorizeResult";
                return 0;
            }
            string operationResult = api.OperationResult;
            transaction.OperationID = api.OperationID;
            transaction.AmountAuthorized = api.AmountAuthorized;
            transaction.AmountTips = api.AmountTips;
            transaction.OperationResult = operationResult;
            transaction.AuthCode = api.AuthCode;
            transaction.RRN = api.RRN;
            transaction.CardType = api.CardType;
            transaction.DocumentNr = api.DocumentNr;
            transaction.ErrorText = api.Text;
            transaction.STAN = api.STAN;
            return transaction.AmountAuthorized;
        }

        public bool VoidTransaction(string operationID, out string errorText)
        {
            errorText = null;
            // ISSUE: variable of a compiler-generated type
            var api = this.GetAPI();
            if (api == null)
            {
                errorText = "Failed to load API library...";
                return false;
            }
            // ISSUE: reference to a compiler-generated method
            api.Void(operationID);
            if (!this.ProcessEventsUntil(api, "OnVoidResult", 100))
            {
                errorText = "Timeout waiting for OnVoidResult";
                return false;
            }
            if (!(api.OperationResult != "OK"))
                return true;
            errorText = api.Text;
            return false;
        }

        private bool ContainsFlag(Array array, string flag)
        {
            if (array == null)
                return false;
            foreach (string str in array)
            {
                if (str == flag)
                    return true;
            }
            return false;
        }

        private bool ProcessEventsUntil(
          IActiveXConnectAPI api,
          string expectedEventType,
          int timeoutInSeconds)
        {
            Stopwatch stopwatch = Stopwatch.StartNew();
            // ISSUE: reference to a compiler-generated method
            api.PollEvent(200);
            string eventType = api.EventType;
            this.debug("PROCESSEVENTS", "Wait for:" + expectedEventType);
            for (; eventType != expectedEventType; eventType = api.EventType)
            {
                string str = eventType;
                if (!(str == "OnPrompt"))
                {
                    if (!(str == "OnPrint"))
                    {
                        if (!(str == "OnSelect"))
                        {
                            if (!(str == "OnDisplayText"))
                            {
                                if (!(str == "OnMessageBox"))
                                {
                                    if (str == "OnKBD")
                                    {
                                        if (expectedEventType == "OnCard" && api.KBDKey == "FR")
                                        {
                                            this.debug(eventType, "Red button pressed. Authorization aborted.");
                                            return false;
                                        }
                                    }
                                    else if (!string.IsNullOrEmpty(eventType))
                                        this.debug(eventType, string.Format("Ignoring event: {0}", eventType));
                                }
                                else
                                {
                                    this.debug(eventType, api.MessageBoxText);
                                    // ISSUE: reference to a compiler-generated method
                                    api.Click(this.messageHandler(api.MessageBoxText, api.MessageBoxType));
                                    this.ProcessEventsUntil(api, "OnClickResult", 15);
                                }
                            }
                            else
                                this.debug(eventType, api.DisplayText);
                        }
                        else
                        {
                            this.debug(eventType, api.Text);
                            string[] array = api.Option.OfType<object>().Select<object, string>(o => o.ToString()).ToArray<string>();
                            string Option = this.selectHandler(api.Text, array);
                            // ISSUE: reference to a compiler-generated method
                            api.Selected(Option);
                            if (!this.ProcessEventsUntil(api, "OnSelectedResult", 15) || api.OperationResult != "OK")
                                return false;
                        }
                    }
                    else
                    {
                        // ISSUE: reference to a compiler-generated method
                        api.GetNextReceipt();
                        while (!string.IsNullOrEmpty(api.ReceiptText))
                        {
                            this.print(eventType, "START", "");
                            this.print(eventType, "CLIENTCOPY", string.Format("{0}", api.ReceiptIsClientData));
                            this.print(eventType, "MERCHANTCOPY", string.Format("{0}", api.ReceiptIsMerchantCopy));
                            this.print(eventType, "SIGNATUTELINE", string.Format("{0}", api.ReceiptHasSignatureLine));
                            this.print(eventType, "#", api.ReceiptDocumentNr);
                            this.print(eventType, "TEXT", "--------------------------");
                            this.print(eventType, "TEXT", api.ReceiptText);
                            this.print(eventType, "TEXT", "--------------------------");
                            this.print(eventType, "FINISH", "");
                            // ISSUE: reference to a compiler-generated method
                            api.GetNextReceipt();
                        }
                    }
                }
                else
                {
                    this.debug(eventType, api.PromptText);
                    string InputValue = this.promptHandler(api.PromptText, api.PromptMask);
                    // ISSUE: reference to a compiler-generated method
                    api.Input(InputValue);
                    if (!this.ProcessEventsUntil(api, "OnInputResult", 15) || api.OperationResult != "OK")
                        return false;
                }
                if (stopwatch.ElapsedMilliseconds > timeoutInSeconds * 1000)
                    return false;
                // ISSUE: reference to a compiler-generated method
                api.PollEvent((int)(timeoutInSeconds * 1000 - stopwatch.ElapsedMilliseconds));
            }
            return true;
        }

        public void SetSelectHandler(Constants.SelectHandler selectHandler)
        {
            this.selectHandler = selectHandler;
        }

        public void SetPromptHandler(Constants.PromptHandler promptHandler)
        {
            this.promptHandler = promptHandler;
        }

        public void SetMessageHandler(Constants.MessageHandler messageHandler)
        {
            this.messageHandler = messageHandler;
        }
    }
}
