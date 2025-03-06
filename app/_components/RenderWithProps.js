import React from 'react';

// Safely render the child component with additional props
export function renderWithProps(children, props) {
    if (React.isValidElement(children)) {
        return React.cloneElement(children, props);
    }
    console.warn('Invalid child component:', children);
    return <p className="text-red-500">Invalid component provided.</p>;
}

export default renderWithProps;