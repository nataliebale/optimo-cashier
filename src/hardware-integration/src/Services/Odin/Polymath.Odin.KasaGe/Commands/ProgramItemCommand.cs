using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Utils;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class ProgramItemCommand : WrappedMessage
    {
        public ProgramItemCommand(
          string name,
          int plu,
          TaxGr taxGr,
          int dep,
          int group,
          decimal price,
          decimal quantity = 9999M,
          PriceType priceType = PriceType.FixedPrice)
        {
            Command = 107;
            Data = ((IEnumerable<object>)new object[14]
            {
                 "P",
                 plu,
                 taxGr,
                 dep,
                 group,
                 (int) priceType,
                 price,
                 "",
                 quantity,
                 "",
                 "",
                 "",
                 "",
                 name
            }).StringJoin("\t");
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
