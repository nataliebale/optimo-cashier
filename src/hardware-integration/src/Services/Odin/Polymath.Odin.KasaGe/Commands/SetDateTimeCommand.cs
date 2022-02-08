using Polymath.Odin.KasaGE.Core;
using System;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class SetDateTimeCommand : WrappedMessage
    {
        public SetDateTimeCommand(DateTime dateTime)
        {
            Command = 61;
            Data = dateTime.ToString("dd-MM-yy HH:mm:ss") + "\t";
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
