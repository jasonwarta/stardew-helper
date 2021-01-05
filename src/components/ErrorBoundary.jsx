import React from 'react';
import * as Sentry from '@sentry/react';

const FallbackComponent = () => <div>An error has occurred.</div>;

const ErrorBoundary = (props) => (
  <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
    {props.children}
  </Sentry.ErrorBoundary>
);

export default ErrorBoundary;
