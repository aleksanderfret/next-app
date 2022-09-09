import { ReactNode } from 'react';

const Title = ({ children }: { children: ReactNode }): JSX.Element => (
  <title>{children}</title>
);

export default Title;
