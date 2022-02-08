namespace IngenicoCLS
{
    public class IntegrationTools
    {
        protected bool DebugEnabled = true;

        private Constants.PrintHandler printHandler { get; set; }

        private Constants.DebugHandler debugHandler { get; set; }

        protected void SetPrintHandler(Constants.PrintHandler printHandler)
        {
            this.printHandler = printHandler;
        }

        protected void SetDebugHandler(Constants.DebugHandler debugHandler)
        {
            this.debugHandler = debugHandler;
        }

        public void print(string Type, string Details, string Text)
        {
            if (this.printHandler == null)
                return;
            this.printHandler(Type, Details, Text);
        }

        public void debug(string Details, string Text)
        {
            if (!this.DebugEnabled)
                return;
            this.debugHandler("DEBUG", Details, Text);
        }
    }
}
