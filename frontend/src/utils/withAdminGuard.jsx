import React from 'react';

const WithAdminGuard = (WrappedComponent) => {
  const Component = (props) => {
    return <WrappedComponent {...props} />;
  };

  Component.displayName = `WithAdminGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Component;
};

export default WithAdminGuard;

