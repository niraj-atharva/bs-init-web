import React, { FC, ReactNode } from 'react';

import { XIcon } from "miruIcons";

interface IDialog {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

const Dialog: FC<IDialog> = ({ title, children, open, onClose }) => {

  if (!open) {
    return <></>;
  }
  return (
    <div className="flex items-center justify-center px-4">
      <div
        className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-10 flex items-start justify-center overflow-auto"
        style={{
          backgroundColor: "rgba(29, 26, 49, 0.6)"
        }}
      >
        <div className="relative h-full w-full px-4 md:flex md:items-center md:justify-center">
          <div className="modal-width transform rounded-lg bg-white px-6 pb-6 shadow-xl transition-all sm:max-w-md sm:align-middle">
            <div className="mt-6 flex items-center justify-between">
              <h6 className="mb-2 text-2xl font-bold">{title}</h6>
              <button type="button" onClick={onClose}>
                <XIcon size={16} weight="bold" className="text-col-han-app-1000" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog;
