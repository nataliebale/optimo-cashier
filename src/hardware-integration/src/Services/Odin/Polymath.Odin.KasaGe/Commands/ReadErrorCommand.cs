﻿using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class ReadErrorCommand : WrappedMessage
    {
        public ReadErrorCommand(string errorCode)
        {
            Command = 100;
            Data = errorCode + "\t";
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
