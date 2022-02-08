namespace IngenicoCLS
{
    public static class Constants
    {
        public const string WelcomeText = "Welcome";
        public const string UnlockText = "Please insert or swipe card";
        public const string GEL = "981";
        public const string MRG = "102";
        public const string PLC = "106";
        public const string DEBUG = "DEBUG";

        public delegate string SelectHandler(string Message, string[] Option);

        public delegate string PromptHandler(string Message, string Mask);

        public delegate string MessageHandler(string Message, string MessageBoxType);

        public delegate void PrintHandler(string Type, string Details, string Text);

        public delegate void DebugHandler(string Type, string Details, string Text);
    }
}
