export interface ModalProps<ItemType> {
  data: ItemType
  onClose: (...args: any[]) => void,
  isOpen: boolean,
  onSubmit?: (...args: any[]) => void,
}