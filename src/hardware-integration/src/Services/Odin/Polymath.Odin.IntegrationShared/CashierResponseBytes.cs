namespace Polymath.Odin.IntegrationShared
{
    public class CashierResponseBytes
    {
        public static readonly CashierResponseBytes[][] Bytes = new CashierResponseBytes[][]
        {
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 0, Index = 0, Description = "Syntax error", IsError = true },
                new CashierResponseBytes { Byte = 0, Index = 1, Description = "Invalid command", IsError = true },
                new CashierResponseBytes { Byte = 0, Index = 2, Description = "The clock needs setting", IsError = false },
                new CashierResponseBytes { Byte = 0, Index = 3, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 0, Index = 4, Description = "Failure in printing mechanism", IsError = true },
                new CashierResponseBytes { Byte = 0, Index = 5, Description = "Error indicator (byte 0,1,2)", IsError = true },
                new CashierResponseBytes { Byte = 0, Index = 6, Description = "Reserved", IsError = false },
                new CashierResponseBytes { Byte = 0, Index = 7, Description = "Reserved", IsError = false }
            },
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 1, Index = 0, Description = "Sums overflow", IsError = false },
                new CashierResponseBytes { Byte = 1, Index = 1, Description = "Command cannot be performed in the current fiscal mode", IsError = true },
                new CashierResponseBytes { Byte = 1, Index = 2, Description = "Operational memory closure has been performed", IsError = true },
                new CashierResponseBytes { Byte = 1, Index = 3, Description = "Not used", IsError = true },
                new CashierResponseBytes { Byte = 1, Index = 4, Description = "RAM failure after switch ON", IsError = true },
                new CashierResponseBytes { Byte = 1, Index = 5, Description = "Error in cutter", IsError = false },
                new CashierResponseBytes { Byte = 1, Index = 6, Description = "Wrong password", IsError = false },
                new CashierResponseBytes { Byte = 1, Index = 7, Description = "Reserved", IsError = false }
            },
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 2, Index = 0, Description = "No paper", IsError = true },
                new CashierResponseBytes { Byte = 2, Index = 1, Description = "Not enough paper", IsError = false },
                new CashierResponseBytes { Byte = 2, Index = 2, Description = "No paper (control tape)", IsError = false },
                new CashierResponseBytes { Byte = 2, Index = 3, Description = "Fiscal receipt is opened", IsError = false },
                new CashierResponseBytes { Byte = 2, Index = 4, Description = "Insufficient paper in EJT", IsError = false },
                new CashierResponseBytes { Byte = 2, Index = 5, Description = "Non-fiscal receipt is opened", IsError = false },
                new CashierResponseBytes { Byte = 2, Index = 6, Description = "Print of document is allowed", IsError = false },
                new CashierResponseBytes { Byte = 2, Index = 7, Description = "Reserved", IsError = false }
            },
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 3, Index = 0, Description = "Error number of Fiscal device(see the User manual)", IsError = false },
                new CashierResponseBytes { Byte = 3, Index = 1, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 3, Index = 2, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 3, Index = 3, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 3, Index = 4, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 3, Index = 5, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 3, Index = 6, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 3, Index = 7, Description = "Reserved", IsError = false }
            },
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 4, Index = 0, Description = "Record error in fiscal memory", IsError = true },
                new CashierResponseBytes { Byte = 4, Index = 1, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 4, Index = 2, Description = "Invalid record in fiscal memory", IsError = false },
                new CashierResponseBytes { Byte = 4, Index = 3, Description = "Room for less than 50 records in fiscal memory", IsError = false },
                new CashierResponseBytes { Byte = 4, Index = 4, Description = "Fiscal memory full", IsError = true },
                new CashierResponseBytes { Byte = 4, Index = 5, Description = "Error indicator (byte 4,5)", IsError = true },
                new CashierResponseBytes { Byte = 4, Index = 6, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 4, Index = 7, Description = "Reserved", IsError = false }
            },
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 5, Index = 0, Description = "FM overflowed", IsError = true },
                new CashierResponseBytes { Byte = 5, Index = 1, Description = "Fiscal memory has been formatted", IsError = false },
                new CashierResponseBytes { Byte = 5, Index = 2, Description = "Not used", IsError = true },
                new CashierResponseBytes { Byte = 5, Index = 3, Description = "Printer is in the fiscal mode", IsError = false },
                new CashierResponseBytes { Byte = 5, Index = 4, Description = "Tax rate is programmed", IsError = false },
                new CashierResponseBytes { Byte = 5, Index = 5, Description = "MRC is programmed", IsError = false },
                new CashierResponseBytes { Byte = 5, Index = 6, Description = "FM ready", IsError = false },
                new CashierResponseBytes { Byte = 5, Index = 7, Description = "Reserved", IsError = false }
            },
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 6, Index = 0, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 6, Index = 1, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 6, Index = 2, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 6, Index = 3, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 6, Index = 4, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 6, Index = 5, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 6, Index = 6, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 6, Index = 7, Description = "Not used", IsError = false }
            },
            new CashierResponseBytes[]
            {
                new CashierResponseBytes { Byte = 7, Index = 0, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 7, Index = 1, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 7, Index = 2, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 7, Index = 3, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 7, Index = 4, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 7, Index = 5, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 7, Index = 6, Description = "Not used", IsError = false },
                new CashierResponseBytes { Byte = 7, Index = 7, Description = "Not used", IsError = false }
            }
        };

        public byte Byte { get; set; }
        public byte Index { get; set; }
        public string Description { get; set; }
        public bool IsError { get; set; }
    }
}
