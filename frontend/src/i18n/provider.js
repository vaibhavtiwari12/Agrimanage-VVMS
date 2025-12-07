import React, { Fragment } from 'react';
import { IntlProvider } from 'react-intl';

import { LOCALES } from './locales';
import messages from './messages';

const Provider = ({ children, locale = LOCALES.ENGLISH }) => {
  return (
    <IntlProvider
      locale={locale}
      textComponent={Fragment}
      messages={messages[locale]}
      onError={err => {
        if (err.code === 'MISSING_TRANSLATION') {
          console.warn('Missing translation', err.message);
          return;
        }
        throw err;
      }}
    >
      {children}
    </IntlProvider>
  );
};

export default Provider;
