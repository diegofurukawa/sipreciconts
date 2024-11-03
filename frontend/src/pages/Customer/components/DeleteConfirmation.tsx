// src/pages/Customer/components/DeleteConfirmation.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  
  interface DeleteConfirmationProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
const DeleteConfirmation = ({
open,
onConfirm,
onCancel
}: DeleteConfirmationProps) => {
return (
    <AlertDialog open={open}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
        <AlertDialogDescription>
            Tem certeza que deseja excluir este cliente? 
            Esta ação não pode ser desfeita.
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>
            Cancelar
        </AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>
            Excluir
        </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
);
};


export {
    DeleteConfirmation
};