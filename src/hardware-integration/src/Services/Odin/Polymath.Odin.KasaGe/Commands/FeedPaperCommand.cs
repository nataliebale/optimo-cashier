using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class FeedPaperCommand : WrappedMessage
    {
        public FeedPaperCommand(int lines)
        {
            Command = 44;
            Data = lines.ToString() + "\t";
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
