import { usePage } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginOrSignup } from "../components/LoginOrSignup";

export default function (props: any) {
  const { logged_in } = usePage().props;
  return (
    <>
      <Dialog open={!logged_in}>
        <DialogContent
          className="sm:max-w-[425px]"
          showCloseButton={false}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
          </DialogHeader>
          <LoginOrSignup />
        </DialogContent>
      </Dialog>
      {props.children}
    </>
  );
}