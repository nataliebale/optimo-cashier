using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class GetLastFiscalEntryInfoCommand : WrappedMessage
    {
        public GetLastFiscalEntryInfoCommand(int type)
        {
            Command = 64;
            Data = type.ToString() + "\t";
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
