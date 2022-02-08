namespace IngenicoCLS
{
    public class Transaction
    {
        public long AmountAuthorized = 0;
        public string OperationResult;
        public string OperationID;
        public long AmountTips;
        public string DocumentNr;
        public string ErrorText;
        public string AuthCode;
        public string RRN;
        public string STAN;
        public string CardType;
        public bool IsVoided;

        public override string ToString()
        {
            return string.Format("/{0}={1}", "OperationResult", OperationResult) + string.Format("/{0}={1}", "OperationID", OperationID) + string.Format("/{0}={1}", "AmountAuthorized", AmountAuthorized) + string.Format("/{0}={1}", "AmountTips", AmountTips) + string.Format("/{0}={1}", "DocumentNr", DocumentNr) + string.Format("/{0}={1}", "ErrorText", ErrorText) + string.Format("/{0}={1}", "AuthCode", AuthCode) + string.Format("/{0}={1}", "RRN", RRN) + string.Format("/{0}={1}", "STAN", STAN) + string.Format("/{0}={1}", "CardType", CardType) + string.Format("/{0}={1}/", "IsVoided", IsVoided);
        }

        public bool isAuthorized()
        {
            return !(this.OperationResult != "OK") && this.AmountAuthorized != 0L;
        }
    }
}
