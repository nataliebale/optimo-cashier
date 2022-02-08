using Polymath.Odin.HAL.CashierService;
using Polymath.Odin.IntegrationShared;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Printing;
using System.Linq;

namespace Polymath.Odin.HAL.PrinterService.Thermal
{
    public class ThermalPrinterService : PrinterService
    {
        private static PrintDocument document = null;
        private int X = 0;
        private int Y = 0;

        public ThermalPrinterService(ICashierService cashierService) : base(cashierService)
        {
        }

        public override void IngenicoPrintingHandler(string type, string details, string text)
        {
            if (type == "OnPrint" && details == "TEXT")
            {
                if (!printing && text == "--------------------------")
                {
                    CreatePrintDocument();
                    return;
                }

                if (printing && text != "--------------------------")
                {
                    PreparePrintDocument(() =>
                    new PrinterPageLine[1] {
                        new PrinterPageLine
                        {
                            Text = new PrinterPageLineText[]{ new PrinterPageLineText{ String = text } }
                        }
                    });
                    return;
                }

                if (printing && text == "--------------------------")
                {
                    PrintDocument();
                    return;
                }
            }
        }

        public override void ReceiptPrintingHandler<TReceipt, TRceiptModel>(TReceipt receipt, TRceiptModel rceiptModel)
        {
            CreatePrintDocument();
            PreparePrintDocument(() => receipt.PrepareReceipt(rceiptModel));
            PrintDocument();
        }

        private void CreatePrintDocument()
        {
            printing = true;
            document = new PrintDocument();
            var printerSettings = new PrinterSettings();
            document.DefaultPageSettings.PrinterSettings.PrinterName = printerSettings.PrinterName;
            document.DefaultPageSettings.Landscape = false;
            document.DefaultPageSettings.PaperSize = new PaperSize();
            document.DefaultPageSettings.Margins = new Margins(15, 15, 15, 45);
            X = 0;
            Y = 0;
        }

        private void PreparePrintDocument(Func<IEnumerable<PrinterPageLine>> action)
        {
            void printPage(object sender, PrintPageEventArgs e)
            {
                float availableWidth = (float)Math.Floor(((PrintDocument)sender).OriginAtMargins
                    ? e.MarginBounds.Width
                    : (e.PageSettings.Landscape
                        ? e.PageSettings.PrintableArea.Height
                        : e.PageSettings.PrintableArea.Width)) - 15;

                float availableHeight = (float)Math.Floor(((PrintDocument)sender).OriginAtMargins
                    ? e.MarginBounds.Height
                    : (e.PageSettings.Landscape
                        ? e.PageSettings.PrintableArea.Width
                        : e.PageSettings.PrintableArea.Height));

                var layoutArea = new RectangleF(
                    e.MarginBounds.Left,
                    e.MarginBounds.Top,
                    availableWidth - (e.MarginBounds.Left + e.MarginBounds.Right),
                    14);

                var layoutSize = layoutArea.Size;

                foreach (var line in action())
                {
                    if (line.LineType == PrinterPageLineType.Line)
                    {
                        Y += line.OffsetTop;
                        e.Graphics.DrawLine(new Pen(line.Color, 1), 0, Y, e.PageSettings.PrintableArea.Width, Y);
                        Y += line.OffsetBottom;
                        continue;
                    }
                    else if (line.LineType == PrinterPageLineType.Image)
                    {
                        Y += line.OffsetTop;
                        e.Graphics.DrawImage(line.Image, new PointF(X, Y));
                        Y += line.Image.Height + line.OffsetBottom;
                    }
                    else if (line.LineType == PrinterPageLineType.Text)
                    {
                        var sizeF = e.Graphics.MeasureString(line.Text.First().String, line.Font);
                        int iLineSpacing = (int)(e.Graphics.MeasureString("X", line.Font).Height * (100 / (float)100));
                        Y += line.OffsetTop;
                        foreach (var text in line.Text)
                        {
                            int charsFitted, linesFilled;
                            var newLine = false;
                            while (text.String.Length > 0)
                            {
                                text.String = $" {text.String}";
                                if (newLine)
                                {
                                    Y += iLineSpacing;
                                }

                                // measure how many characters will fit of the remaining text
                                var realsize = e.Graphics.MeasureString(
                                    text.String,
                                    line.Font,
                                    layoutSize,
                                    StringFormat.GenericDefault,
                                    out charsFitted,
                                    out linesFilled);

                                charsFitted = Math.Min(charsFitted, text.String.Length);

                                var fitsOnPage = text.String.Substring(0, charsFitted);

                                text.String = text.String.Substring(charsFitted).Trim();

                                switch (text.Allignment)
                                {
                                    case TextAlignment.Left:
                                    case TextAlignment.Justify:
                                        e.Graphics.DrawString(fitsOnPage,
                                                              line.Font,
                                                              new SolidBrush(line.Color),
                                                              new PointF(X, Y)
                                                              );
                                        break;
                                    case TextAlignment.Right:
                                        e.Graphics.DrawString(fitsOnPage,
                                                              line.Font,
                                                              new SolidBrush(line.Color),
                                                              new PointF(availableWidth - e.Graphics.MeasureString(fitsOnPage, line.Font).Width * 0.955F, Y) // 0.0955 fixes numbers
                                                              );
                                        break;
                                    case TextAlignment.Center:
                                        e.Graphics.DrawString(fitsOnPage,
                                                              line.Font,
                                                              new SolidBrush(line.Color),
                                                              new PointF((availableWidth - e.Graphics.MeasureString(fitsOnPage, line.Font).Width) / 2, Y)
                                                              );
                                        break;
                                }
                                newLine = true;
                            }
                        }
                        Y += iLineSpacing + line.OffsetBottom;
                    }
                }
            }

            document.PrintPage += printPage;
        }

        private void PrintDocument()
        {
            document.Print();
            document = null;
            printing = false;
        }
    }
}
