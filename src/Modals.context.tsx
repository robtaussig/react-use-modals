import React from 'react';

import { MantineProvider } from '@mantine/core';
import classNames from 'classnames';

import ConfirmationModal from './components/ConfirmationModal';
import { InputModal, InputModalProps } from './components/InputModal';
import Modal from './components/Modal';
import type { ModalProps } from './components/Modal';

type ConfirmationOptions = {
  className?: string;
};

type Context = {
  getInput: <T>(inputProps: InputProps<T>) => void;
  showModal: (modalProps: Omit<ModalProps, 'onRequestClose'>) => void;
  confirm: (
    confirmText: string,
    options?: ConfirmationOptions
  ) => Promise<boolean>;
};

const DEFAULT_CONTEXT = {
  getInput: () => null,
  confirm: async () => false,
  showModal: () => null,
};

const ModalsContext = React.createContext<Context>(DEFAULT_CONTEXT);

type InputProps<T = any> = Pick<
  InputModalProps<T>,
  | 'className'
  | 'header'
  | 'subHeader'
  | 'formItems'
  | 'onSubmit'
  | 'submitButtonText'
  | 'onCancel'
  | 'formItems'
  | 'initialValues'
>;

const DEFAULT_MY_INPUT_MODAL_PROPS: Omit<InputModalProps, 'open' | 'setOpen'> =
  {
    formItems: [],
    onSubmit: async () => null,
  };

export type ModalsProviderProps = {
  children: React.ReactElement;
  classNames?: {
    formContainer?: string;
    modalContainer?: string;
    button?: string;
    primaryButton?: string;
    secondaryButton?: string;
    text?: string;
    textarea?: string;
    select?: string;
    checkbox?: string;
    radio?: string;
    label?: string;
  };
};

export function ModalsProvider({
  children,
  classNames: customClassNames,
}: ModalsProviderProps) {
  const [myInputModal, setInputModal] = React.useState<InputProps>();
  const [modalContent, setModalContent] =
    React.useState<Omit<ModalProps, 'onRequestClose'>>();
  const [showConfirm, setShowConfirm] = React.useState<{
    text: string;
    options?: ConfirmationOptions;
  }>();
  const confirmPromiseRef = React.useRef<
    ((value: boolean | PromiseLike<boolean>) => void) | null
  >(null);

  const contextValue = React.useMemo(
    () => ({
      getInput: setInputModal,
      showModal: setModalContent,
      confirm: (confirmText: string, options?: ConfirmationOptions) => {
        setShowConfirm({ text: confirmText, options });
        return new Promise<boolean>((resolve) => {
          confirmPromiseRef.current = resolve;
        });
      },
    }),
    []
  );

  return (
    <MantineProvider>
      <ModalsContext.Provider value={contextValue}>
        {children}
        <ConfirmationModal
          className={showConfirm?.options?.className}
          inputClassNames={customClassNames}
          confirmText={showConfirm?.text}
          onConfirm={() => {
            setShowConfirm(undefined);
            if (confirmPromiseRef.current) {
              confirmPromiseRef.current(true);
              confirmPromiseRef.current = null;
            }
          }}
          onReject={() => {
            setShowConfirm(undefined);
            if (confirmPromiseRef.current) {
              confirmPromiseRef.current(false);
              confirmPromiseRef.current = null;
            }
          }}
        />
        <InputModal
          {...(myInputModal ?? DEFAULT_MY_INPUT_MODAL_PROPS)}
          inputClassNames={customClassNames}
          open={Boolean(myInputModal)}
          setOpen={() => setInputModal(undefined)}
        />
        {Boolean(modalContent) && (
          <Modal
            {...modalContent}
            className={classNames(
              customClassNames.modalContainer,
              modalContent.className
            )}
            onRequestClose={() => setModalContent(undefined)}
          />
        )}
        <div id="full-screen-menu-root" />
      </ModalsContext.Provider>
    </MantineProvider>
  );
}

export const useModals = () => React.useContext(ModalsContext);
