using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class VoidOpenFiscalReceiptCommand : WrappedMessage
    {
        public VoidOpenFiscalReceiptCommand()
        {
            Command = 60;
            Data = string.Empty;
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
