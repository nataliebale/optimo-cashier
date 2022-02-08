namespace IngenicoCLS
{
    public class IngenicoAPI : Ingenico
    {
        public IngenicoAPI EnableDebug()
        {
            this.DebugEnabled = true;
            return this;
        }

        public IngenicoAPI DisableDebug()
        {
            this.DebugEnabled = false;
            return this;
        }

        public IngenicoAPI SelectFormHandler()
        {
            this.SelectCustomHandler(new Constants.SelectHandler((this).FormSelect));
            return this;
        }

        public IngenicoAPI SelectCustomHandler(Constants.SelectHandler selectHandler)
        {
            this.SetSelectHandler(selectHandler);
            return this;
        }

        public IngenicoAPI PromptFormHandler()
        {
            this.PromptCustomHandler(new Constants.PromptHandler((this).FormPrompt));
            return this;
        }

        public IngenicoAPI PromptCustomHandler(Constants.PromptHandler promptHandler)
        {
            this.SetPromptHandler(promptHandler);
            return this;
        }

        public IngenicoAPI PrintConsoleHandler()
        {
            this.PrintCustomHandler(new Constants.PrintHandler((this).ConsolePrint));
            return this;
        }

        public IngenicoAPI PrintCustomHandler(Constants.PrintHandler printHandler)
        {
            this.SetPrintHandler(printHandler);
            return this;
        }

        public IngenicoAPI MessageCustomHandler(Constants.MessageHandler messageHandler)
        {
            this.SetMessageHandler(messageHandler);
            return this;
        }

        public IngenicoAPI MessageFormHandler()
        {
            this.MessageCustomHandler(new Constants.MessageHandler((this).FormMessageBox));
            return this;
        }

        public IngenicoAPI Language(string lang)
        {
            this.Lang = lang;
            return this;
        }

        public IngenicoAPI OperatoriID(string OperatorID)
        {
            this.OperID = OperatorID;
            return this;
        }

        public IngenicoAPI OperatorName(string OperatoriName)
        {
            this.OperName = OperatoriName;
            return this;
        }
    }
}
