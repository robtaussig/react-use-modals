import React from 'react';
import { InputModal, InputModalProps } from './components/InputModal';
import ConfirmationModal from './components/ConfirmationModal';

type Context = {
  getInput: <T>(inputProps: InputProps<T>) => void;
  confirm: (confirmText: string) => Promise<boolean>;
};

const DEFAULT_CONTEXT = {
  getInput: () => null,
  confirm: async () => false,
};

const ModalsContext = React.createContext<Context>(DEFAULT_CONTEXT);

type InputProps<T = any> = Pick<
  InputModalProps<T>,
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

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [myInputModal, setInputModal] = React.useState<InputProps>();
  const [showConfirm, setShowConfirm] = React.useState<string>();
  const confirmPromiseRef = React.useRef<
    ((value: boolean | PromiseLike<boolean>) => void) | null
  >(null);

  const contextValue = React.useMemo(
    () => ({
      getInput: setInputModal,
      confirm: (confirmText: string) => {
        setShowConfirm(confirmText);
        return new Promise<boolean>((resolve) => {
          confirmPromiseRef.current = resolve;
        });
      },
    }),
    []
  );

  return (
    <ModalsContext.Provider value={contextValue}>
      <>
        {children}
        <ConfirmationModal
          confirmText={showConfirm}
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
          open={Boolean(myInputModal)}
          setOpen={() => setInputModal(undefined)}
        />
        <div id='full-screen-menu-root' />
      </>
    </ModalsContext.Provider>
  );
}

export const useModals = () => React.useContext(ModalsContext);
