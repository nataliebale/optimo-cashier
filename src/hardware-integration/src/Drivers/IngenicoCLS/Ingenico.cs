using System;

namespace IngenicoCLS
{
    public class Ingenico : Integration
    {
        public static string GUID;
        public static string DOC_PATH { get; protected set; } = "";

        public Transaction MakePayment(long amountToPay)
        {
            Document document = new Document();
            document.GenerateNewUniqueDocumentNr();
            DocumentManager.SaveDocument(document);
            if (!this.UnlockDevice(this.OperID, this.OperName, "AUTHORIZE", amountToPay, "Please insert or swipe card"))
            {
                this.debug("UNLOCK", "Failed to unlock device, payment cannot be performed");
                return null;
            }
            try
            {
                long num = this.Authorize(amountToPay, document.DocumentNr, "981", out Transaction transaction);
                this.debug("MAKEPAYMENT", "AuthorizedAmount:" + num);
                if (num == 0L)
                {
                    this.debug("MAKEPAYMENT", string.Format("Authorization failed. Error {0}", transaction.ErrorText));
                    return transaction;
                }
                if (num == amountToPay)
                {
                    this.debug("MAKEPAYMENT", string.Format("Authorized sucessfully {0}", num));
                    document.Transactions.Add(transaction);
                    DocumentManager.SaveDocument(document);
                    if (this.CloseDocument(document))
                    {
                        document.ChangeStateToClosed();
                        DocumentManager.SaveDocument(document);
                    }
                    return transaction;
                }
                this.debug("MAKEPAYMENT", string.Format("Authorization partially allowed. In general we fail. Error {0}", transaction.ErrorText));
                return transaction;
            }
            finally
            {
                this.LockDevice("Welcome");
            }
        }

        public Transaction MakeMRGPayment(long amountToPay)
        {
            return this.MakePaymentWithCurrency(amountToPay, "102");
        }

        public Transaction MakePLCPayment(long amountToPay)
        {
            return this.MakeCreditWithCurrency(amountToPay, "106");
        }

        public Transaction MakePaymentWithCurrency(long amountToPay, string currencyCode)
        {
            Document document = new Document();
            document.GenerateNewUniqueDocumentNr();
            DocumentManager.SaveDocument(document);
            if (!this.UnlockDevice(this.OperID, this.OperName, "AUTHORIZE", amountToPay, "Please insert or swipe card"))
            {
                this.debug("MAKEPAYMENTWCURR", "Failed to unlock device, payment cannot be performed");
                return null;
            }
            try
            {
                long num = this.AuthorizeWithCurrency(amountToPay, document.DocumentNr, currencyCode, out Transaction transaction);
                this.debug("MAKEPAYMENTWCURR", "AuthorizedAmount:" + num);
                if (num == 0L)
                {
                    this.debug("MAKEPAYMENTWCURR", string.Format("Authorization failed. Error {0}", transaction.ErrorText));
                    return transaction;
                }
                if (num == amountToPay)
                {
                    this.debug("MAKEPAYMENTWCURR", string.Format("Authorized sucessfully {0}", num));
                    document.Transactions.Add(transaction);
                    DocumentManager.SaveDocument(document);
                    if (this.CloseDocument(document))
                    {
                        document.ChangeStateToClosed();
                        DocumentManager.SaveDocument(document);
                    }
                    return transaction;
                }
                this.debug("MAKEPAYMENTWCURR", string.Format("Authorization partially allowed. In general we fail. Error {0}", transaction.ErrorText));
                return transaction;
            }
            finally
            {
                this.LockDevice("Welcome");
            }
        }

        public Transaction MakeCredit(long amountToPay)
        {
            Document document = new Document();
            document.GenerateNewUniqueDocumentNr();
            DocumentManager.SaveDocument(document);
            if (!this.UnlockDevice(this.OperID, this.OperName, "CREDIT", amountToPay, "Please insert or swipe card"))
            {
                this.debug("MAKECREDIT", "Failed to unlock device, payment cannot be performed");
                return null;
            }
            try
            {
                long num = this.Credit(amountToPay, document.DocumentNr, "981", out Transaction transaction);
                this.debug("MAKECREDIT", "AuthorizedAmount:" + num);
                if (num == 0L)
                {
                    this.debug("MAKECREDIT", string.Format("Authorization failed. Error {0}", transaction.ErrorText));
                    return transaction;
                }
                if (num == amountToPay)
                {
                    this.debug("MAKECREDIT", string.Format("Authorized sucessfully {0}", num));
                    document.Transactions.Add(transaction);
                    DocumentManager.SaveDocument(document);
                    if (this.CloseDocument(document))
                    {
                        document.ChangeStateToClosed();
                        DocumentManager.SaveDocument(document);
                    }
                    return transaction;
                }
                this.debug("MAKECREDIT", string.Format("Authorization partially allowed. In general we fail. Error {0}", transaction.ErrorText));
                return transaction;
            }
            finally
            {
                this.LockDevice("Welcome");
            }
        }

        public Transaction MakeCreditWithCurrency(long amountToPay, string currencyCode)
        {
            Document document = new Document();
            document.GenerateNewUniqueDocumentNr();
            DocumentManager.SaveDocument(document);
            if (!this.UnlockDevice(this.OperID, this.OperName, "CREDIT", amountToPay, "Please insert or swipe card"))
            {
                this.debug("MAKECREDITWCURR", "Failed to unlock device, payment cannot be performed");
                return null;
            }
            try
            {
                long num = this.CreditWithCurrency(amountToPay, document.DocumentNr, currencyCode, out Transaction transaction);
                this.debug("MAKECREDITWCURR", "AuthorizedAmount:" + num);
                if (num == 0L)
                {
                    this.debug("MAKECREDITWCURR", string.Format("Authorization failed. Error {0}", transaction.ErrorText));
                    return transaction;
                }
                if (num == amountToPay)
                {
                    this.debug("MAKECREDITWCURR", string.Format("Authorized sucessfully {0}", num));
                    document.Transactions.Add(transaction);
                    DocumentManager.SaveDocument(document);
                    if (this.CloseDocument(document))
                    {
                        document.ChangeStateToClosed();
                        DocumentManager.SaveDocument(document);
                    }
                    return transaction;
                }
                this.debug("MAKECREDITWCURR", string.Format("Authorization partially allowed. In general we fail. Error {0}", transaction.ErrorText));
                return transaction;
            }
            finally
            {
                this.LockDevice("Welcome");
            }
        }

        public bool CloseDay()
        {
            try
            {
                if (this.AttemptToCloseUnclosedDocuments())
                    return this.ApiCloseDay();
                this.debug("CLOSEDAY", "Cannot perform close day because one of the documents was not closed");
                return false;
            }
            catch(Exception e)
            {
                throw e;
            }
            finally
            {
                this.LockDevice("Welcome");
            }
        }

        public bool PrintTotals()
        {
            try
            {
                if (this.AttemptToCloseUnclosedDocuments())
                    return this.ApiPrintTotals();
                this.debug("CLOSEDOCUMENTS", "Cannot perform close day because one of the documents was not closed");
                return false;
            }
            finally
            {
                this.LockDevice("Welcome");
            }
        }

        private bool AttemptToCloseUnclosedDocuments()
        {
            foreach (Document allDocument in DocumentManager.GetAllDocuments())
            {
                if (!allDocument.IsClosed())
                {
                    if (!this.CloseDocument(allDocument))
                        return false;
                    allDocument.ChangeStateToClosed();
                    DocumentManager.SaveDocument(allDocument);
                }
            }
            return true;
        }

        public bool PerformVoid(Document document, Transaction transaction)
        {
            if (!this.UnlockDevice(this.OperID, this.OperName, "VOID", 0L, ""))
            {
                this.debug("VOID", "Failed to unlock device. Void will not be performed");
                return false;
            }
            try
            {
                if (this.VoidTransaction(transaction.OperationID, out string errorText))
                {
                    transaction.IsVoided = true;
                    DocumentManager.SaveDocument(document);
                    this.debug("VOID", "Transaction was voided");
                    return true;
                }
                this.debug("VOID", "Failed to void transaction: " + errorText);
                return false;
            }
            finally
            {
                this.LockDevice("Welcome");
            }
        }
    }
}
