using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Utils;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class PlaySoundCommand : WrappedMessage
    {
        public PlaySoundCommand(int frequency, int interval)
        {
            Command = 80;
            Data = ((IEnumerable<object>)new object[2]
            {
                 frequency,
                 interval
            }).StringJoin("\t");
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
