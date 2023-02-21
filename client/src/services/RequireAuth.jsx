import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import { Context } from "..";

const RequireAuth = observer(({children}) => {
    const location = useLocation()
    const {authState} = useContext(Context)


    if (!authState.isAuth) {
        if (localStorage.getItem('token')) {
            authState.checkAuth()
        }
        console.log(authState.isAuth)
        if (authState.isAuth) {
            return children
        }
        else {
            return <Navigate to='/login' state={{from: location}}/>
        }
    }

    return children
});

export {RequireAuth};