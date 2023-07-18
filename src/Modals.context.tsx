import React from 'react';
import { InputModal, InputModalProps } from './components/InputModal';
import ConfirmationModal from './components/ConfirmationModal';

type ConfirmationOptions = {
  className?: string;
};

type Context = {
  getInput: <T>(inputProps: InputProps<T>) => void;
  confirm: (
    confirmText: string,
    options?: ConfirmationOptions
  ) => Promise<boolean>;
};

const DEFAULT_CONTEXT = {
  getInput: () => null,
  confirm: async () => false,
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
  children: React.ReactNode;
};

export function ModalsProvider({ children }: ModalsProviderProps) {
  const [myInputModal, setInputModal] = React.useState<InputProps>();
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
    <ModalsContext.Provider value={contextValue}>
      <>
        {children}
        <ConfirmationModal
          className={showConfirm?.options?.className}
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
          open={Boolean(myInputModal)}
          setOpen={() => setInputModal(undefined)}
        />
        <div id='full-screen-menu-root' />
      </>
    </ModalsContext.Provider>
  );
}

export const useModals = () => React.useContext(ModalsContext);
