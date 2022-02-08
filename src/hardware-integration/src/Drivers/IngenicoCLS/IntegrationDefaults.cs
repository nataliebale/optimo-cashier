using System;

namespace IngenicoCLS
{
    public class IntegrationDefaults : IntegrationTools
    {
        public string FormSelect(string Message, string[] Option)
        {
            throw new NotImplementedException();
            //SelectForm selectForm = new SelectForm();
            //try
            //{
            //    if (Option == null || Option.Length == 0)
            //        return "";
            //    selectForm.promptText.Text = Message;
            //    selectForm.selectValues.Items.Clear();
            //    Application.DoEvents();
            //    for (int index = 0; index < Option.Length; ++index)
            //        selectForm.selectValues.Items.Add((object)Option[index]);
            //    selectForm.selectValues.SelectedIndex = 0;
            //    int num = (int)selectForm.ShowDialog();
            //    return selectForm.selectValues.SelectedItem.ToString();
            //}
            //finally
            //{
            //    selectForm.Dispose();
            //}
        }

        public string FormPrompt(string Message, string Mask)
        {
            throw new NotImplementedException();
            //PromptForm promptForm = new PromptForm();
            //try
            //{
            //    promptForm.Process(Message, Mask);
            //    return promptForm.promptText.Text;
            //}
            //finally
            //{
            //    promptForm.Dispose();
            //}
        }

        public string FormMessageBox(string Message, string MessageBoxType)
        {
            throw new NotImplementedException();
            //MessageBoxButtons buttons = MessageBoxButtons.OK;
            //string str = MessageBoxType;
            //if (!(str == "Ok"))
            //{
            //    if (!(str == "YesNo"))
            //    {
            //        if (!(str == "OkCancel"))
            //        {
            //            if (str == "YesNoCancel")
            //                buttons = MessageBoxButtons.YesNoCancel;
            //        }
            //        else
            //            buttons = MessageBoxButtons.OKCancel;
            //    }
            //    else
            //        buttons = MessageBoxButtons.YesNo;
            //}
            //else
            //    buttons = MessageBoxButtons.OK;
            //switch (MessageBox.Show(Message, nameof(Message), buttons))
            //{
            //    case DialogResult.OK:
            //        return "Ok";
            //    case DialogResult.Cancel:
            //        return "Cancel";
            //    case DialogResult.Yes:
            //        return "Yes";
            //    case DialogResult.No:
            //        return "No";
            //    default:
            //        return "";
            //}
        }

        public void ConsolePrint(string Type, string Details, string Text)
        {
            //Console.WriteLine(string.Format("{0, -20} {1, -20}:{2}", Type, Details, Text));
        }
    }
}