import React from "react";
import canvasState from "../store/canvasState";
import '../styles/toolbar.scss';
import { observer } from "mobx-react-lite";

const UsersCounter = observer(() => {
    return (
        <div className="counter">
            Users connected: {canvasState.usersConnected}
        </div>               
    );
});

export default UsersCounter;