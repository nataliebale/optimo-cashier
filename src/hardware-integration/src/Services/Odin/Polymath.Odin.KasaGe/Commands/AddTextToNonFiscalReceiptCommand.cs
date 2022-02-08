using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class AddTextToNonFiscalReceiptCommand : WrappedMessage
    {
        public AddTextToNonFiscalReceiptCommand(string text)
        {
            Command = 42;
            Data = text + "\t";
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
