using Polymath.Odin.HAL.CashierService;
using Polymath.Odin.HAL.Receipts;
using Polymath.Odin.IntegrationShared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Polymath.Odin.HAL.PrinterService
{
    public abstract class PrinterService : IPrinterService
    {
        protected bool printing = false;
        protected ICashierService _cashier;

        public PrinterService(ICashierService cashierService)
        {
            _cashier = cashierService;
        }

        public abstract void IngenicoPrintingHandler(string Type, string Details, string Text);

        public abstract void ReceiptPrintingHandler<TReceipt, TRceiptModel>(TReceipt receipt, TRceiptModel rceiptModel)
            where TReceipt : IReceipt<TRceiptModel>
            where TRceiptModel : IReceiptModel;

        protected static IEnumerable<string> TextWrapper(string text, int lineLength = 28)
        {
            var words = text.Split(new char[] { ' ' });
            var sentenceParts = new List<string>();
            sentenceParts.Add(string.Empty);

            int partCounter = 0;

            foreach (string word in words)
            {
                if ((sentenceParts[partCounter] + word).Length > lineLength)
                {
                    partCounter++;
                    sentenceParts.Add(string.Empty);
                }

                sentenceParts[partCounter] += word + " ";
            }

            return sentenceParts;
        }

        protected void PrintLine(string line, TextAlignment allignment = TextAlignment.Left, int maxLength = 28)
        {
            line = line.Trim();

            if (line.Length >= maxLength || allignment == TextAlignment.Left)
            {
                var lineNum = 0;

                while (lineNum * maxLength < line.Length)
                {
                    var text = string.Join("", line.AsQueryable().Skip(lineNum * maxLength).Take(maxLength).ToArray());
                    _cashier.PrintNonFiscalText(text);
                    if (text.Contains("-------") || text.Contains("_______")) { return; }
                    lineNum++;
                }

                return;
            }

            if (allignment == TextAlignment.Right)
            {
                _cashier.PrintNonFiscalText(line.PadLeft(maxLength));
                return;
            }

            if (allignment == TextAlignment.Center)
            {
                var pad = (int)Math.Floor((maxLength - line.Length) / 2d);
                _cashier.PrintNonFiscalText(line.PadLeft(pad + line.Length));
                return;
            }
        }

        protected void PrintText(string text, int maxLength = 28)
        {
            var lines = text.Split('\n');

            foreach (var line in lines)
            {
                if (line.StartsWith(" "))
                {
                    PrintLine(line, TextAlignment.Center);
                }
                else if (line.Length > maxLength)
                {
                    if (line.Contains(": "))
                    {
                        var parameters = line.Split(new string[] { ": " }, StringSplitOptions.None);
                        PrintLine(parameters[0].Trim() + ":");
                        PrintLine(parameters[1], TextAlignment.Right);
                    }
                    else if (line.Contains("  "))
                    {
                        var lineText = line;

                        while (lineText.Contains("  "))
                        {
                            lineText = lineText.Replace("  ", "");
                        }

                        PrintLine(text);
                    }
                    else
                    {
                        PrintLine(line);
                    }
                }
                else
                {
                    foreach (var sentence in TextWrapper(line))
                    {
                        PrintLine(sentence, TextAlignment.Left);
                    }
                }
            }
        }
    }
}
