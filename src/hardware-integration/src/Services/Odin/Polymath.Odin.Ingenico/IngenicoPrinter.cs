using IngenicoCLS;

namespace Polymath.Odin.Ingenico
{
    public class IngenicoPrinter : IngenicoCLS.Ingenico
    {
        public IngenicoPrinter(Constants.PrintHandler printHandler = null, Constants.DebugHandler debugHandler = null, string docPath = null) : base()
        {
            DebugEnabled = debugHandler != null;
            if (printHandler != null) SetPrintHandler(printHandler);
            if (DebugEnabled) SetDebugHandler(debugHandler);
            DOC_PATH = docPath + "/";
        }
    }
}
