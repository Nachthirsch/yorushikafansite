import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, type, title }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all border border-base-300">
                <div className="flex items-center gap-3 text-warning mb-4">
                  <ExclamationTriangleIcon className="h-10 w-10" />
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                    Confirm deletion
                  </Dialog.Title>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-base-content/70">
                    Are you sure you want to delete this {type}?{title && <span className="font-semibold block mt-2">"{title}"</span>}
                    This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-error btn-sm" onClick={onConfirm}>
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
