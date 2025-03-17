import { Outlet, Navigate } from 'react-router-dom'
import React from 'react'
import AuthContext from '../context/AuthContext'
import { useEffect, useContext } from "react";

const LoggedRoutes = () => {
    let {user} = useContext(AuthContext)
    
    return(

        user != null ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default LoggedRoutes