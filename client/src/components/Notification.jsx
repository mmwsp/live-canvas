import React from "react";
import { useState } from "react";
import '../styles/notification.scss';

const Notification = ({active, setActive, children}) => {


    return (
            <div className={active ? "notification active" : "notification"}>
                <div className="notification__message">
                    {children}
                </div>
            </div>               
    );
}

export default Notification;