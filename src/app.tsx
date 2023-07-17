import React from 'react';
import { useModals } from './Modals.context';

export function App() {
  const { getInput, confirm } = useModals();
  return (
    <div>
      <button
        onClick={async () => {
          const confirmed = await confirm('Are you sure?');

          if (confirmed) {
            getInput({
              header: 'This is a header',
              formItems: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Name',
                  placeholder: 'Enter Name',
                },
                {
                  name: 'age',
                  type: 'select',
                  label: 'Age',
                  options: ['1', '2', '3'],
                },
              ],
              onSubmit: async (input) => {
                console.log({ input });

                return null;
              },
            });
          }
        }}
      >
        Click me
      </button>
    </div>
  );
}
