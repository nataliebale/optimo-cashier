using Polymath.Odin.IntegrationShared;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Text;
using System.IO;
using System.Reflection;

namespace Polymath.Odin.HAL.PrinterService
{
    public class PrinterPageLine
    {
        private static PrivateFontCollection _fontFamilies = null;
        public static FontFamily[] FontFamilies
        {
            get
            {
                if (_fontFamilies == null)
                {
                    var executableLocation =
                        Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                    _fontFamilies = new PrivateFontCollection();
                    _fontFamilies.AddFontFile(Path.Combine(executableLocation, "Resources", "HelveticaNeue.ttf"));
                    _fontFamilies.AddFontFile(Path.Combine(executableLocation, "Resources", "HelveticaNeueBold.ttf"));
                }

                return _fontFamilies.Families;
            }
        }
        public IEnumerable<PrinterPageLineText> Text { get; set; }
        public PrinterPageLineType LineType { get; set; } = PrinterPageLineType.Text;
        public Font Font { get; set; } = new Font("Arial", 8);
        public int OffsetTop { get; set; } = 1;
        public int OffsetBottom { get; set; } = 1;
        public Color Color { get; set; } = Color.Black;
        public Image Image { get; set; }
    }

    public class PrinterPageLineText
    {
        public string String { get; set; }
        public TextAlignment Allignment { get; set; } = TextAlignment.Left;

    }

    public enum PrinterPageLineType
    {
        Text,
        Line,
        Image
    }
}
