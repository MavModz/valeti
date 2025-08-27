'use client';

import Choices from 'choices.js';
import { useEffect, useRef } from 'react';

const ChoicesFormInput = ({
  children,
  multiple,
  className,
  onChange,
  allowInput,
  options,
  ...props
}) => {
  const choicesRef = useRef(null);
  const choicesInstanceRef = useRef(null);

  useEffect(() => {
    if (choicesRef.current) {
      try {
        // Destroy existing instance if it exists
        if (choicesInstanceRef.current) {
          choicesInstanceRef.current.destroy();
        }

        // Create new Choices instance
        const choices = new Choices(choicesRef.current, {
          ...options,
          placeholder: true,
          allowHTML: true,
          shouldSort: false
        });

        choicesInstanceRef.current = choices;

        // Add event listener
        const handleChange = (e) => {
          if (!(e.target instanceof HTMLSelectElement)) return;
          if (onChange && typeof onChange === 'function') {
            try {
              onChange(e.target.value);
            } catch (error) {
              console.error('Error in onChange handler:', error);
            }
          }
        };

        choices.passedElement.element.addEventListener('change', handleChange);

        // Cleanup function
        return () => {
          if (choicesInstanceRef.current) {
            choicesInstanceRef.current.destroy();
          }
          if (choices.passedElement && choices.passedElement.element) {
            choices.passedElement.element.removeEventListener('change', handleChange);
          }
        };
      } catch (error) {
        console.error('Error initializing Choices:', error);
      }
    }
  }, [choicesRef, onChange, options]);

  return allowInput ? (
    <input ref={choicesRef} multiple={multiple} className={className} {...props} />
  ) : (
    <select ref={choicesRef} multiple={multiple} className={className} {...props}>
      {children}
    </select>
  );
};

export default ChoicesFormInput;