import Tippy, { TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export const Popup = ({
  children,
  placement,
  content,
  ...props
}: TippyProps) => {
  return (
    <Tippy content={content} placement={placement} {...props}>
      {children}
    </Tippy>
  );
};
