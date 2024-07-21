
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

interface FooterDialogAlertProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  leaveRoom: () => void;
}

const FooterDialogAlert = ({ showDialog, setShowDialog, leaveRoom }: FooterDialogAlertProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger />
      <DialogContent>
        <DialogTitle>Confirm Leave</DialogTitle>
        <DialogDescription>Are you sure you want to leave the meeting?</DialogDescription>
        <DialogFooter>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button variant="destructive" onClick={leaveRoom}>Leave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FooterDialogAlert;
