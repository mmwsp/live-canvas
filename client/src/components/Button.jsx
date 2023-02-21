import React from "react";
import '../styles/button.scss';

const Button = ({children, ...props}) => {
    
    return (
        <button {...props} className="btn">
            {children}
        </button>   
    );
};

export default Button;