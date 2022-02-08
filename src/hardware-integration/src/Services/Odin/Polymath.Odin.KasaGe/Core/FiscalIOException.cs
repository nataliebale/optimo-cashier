using System.IO;

namespace Polymath.Odin.KasaGE.Core
{
    public class FiscalIOException : IOException
    {
        public FiscalIOException(string message)
          : base(message)
        {
        }
    }
}
