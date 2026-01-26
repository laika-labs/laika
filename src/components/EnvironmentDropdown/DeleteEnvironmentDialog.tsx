import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteEnvironmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  environmentName: string | undefined
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteEnvironmentDialog({
  open,
  onOpenChange,
  environmentName,
  onConfirm,
  onCancel,
}: DeleteEnvironmentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Environment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{environmentName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
