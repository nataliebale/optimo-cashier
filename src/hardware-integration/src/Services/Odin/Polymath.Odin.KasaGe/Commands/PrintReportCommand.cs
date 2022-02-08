using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class PrintReportCommand : WrappedMessage
    {
        public PrintReportCommand(string type)
        {
            Command = 69;
            Data = type + "\t";
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
