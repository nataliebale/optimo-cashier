using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class OpenDrawerCommand : WrappedMessage
    {
        public OpenDrawerCommand(int impulseLength)
        {
            Command = 106;
            Data = impulseLength.ToString() + "\t";
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
