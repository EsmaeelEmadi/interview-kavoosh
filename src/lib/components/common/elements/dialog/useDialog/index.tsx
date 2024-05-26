import { useState } from 'react';

// TYPES
import type { FC } from 'react';

interface IDialogActions<T> {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setData: (data: T | undefined) => void;
  data?: T;
}

export interface IUseDialogProps<T = any> extends IDialogActions<T> {
  isOpen: boolean;
}

interface IUseDialog<T = any> extends IDialogActions<T> {
  isOpen: () => boolean;
  Dialog: FC;
}

function useDialog<T = any>(Element: FC<IUseDialogProps<T>>): IUseDialog<T> {
  const [_isOpen, _setIsOpen] = useState(false);
  const [_data, _setData] = useState<T>();

  const open = () => {
    _setIsOpen(() => true);
  };

  const close = () => {
    _setIsOpen(() => false);
  };

  const isOpen = () => {
    return _isOpen;
  };

  const toggle = () => {
    _setIsOpen((prev) => !prev);
  };

  const Dialog: FC = () => {
    return (
      <Element
        data={_data}
        setData={_setData}
        isOpen={_isOpen}
        open={open}
        close={close}
        toggle={toggle}
      />
    );
  };

  return {
    open,
    close,
    isOpen,
    toggle,
    Dialog,
    data: _data,
    setData: _setData,
  };
}

export default useDialog;
