using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class SubTotalCommand : WrappedMessage
    {
        public SubTotalCommand()
        {
            Command = 51;
            Data = string.Empty;
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
