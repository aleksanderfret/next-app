import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render as rtlRender } from '@testing-library/react';

import i18n from './i18nForTests';

type RenderParams = Parameters<typeof rtlRender>;

const render = (ui: RenderParams[0], options?: RenderParams[1]) =>
  rtlRender(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>, options);

export default render;
