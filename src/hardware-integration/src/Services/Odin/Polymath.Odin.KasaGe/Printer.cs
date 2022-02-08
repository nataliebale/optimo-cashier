namespace Polymath.Odin.KasaGE
{
    public class Printer
    {
        public Dp25 Open(string port)
        {
            return new Dp25(port);
        }
    }
}
