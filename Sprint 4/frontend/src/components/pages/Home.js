import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '../fixed/Header'
import { Button, Typography, Box } from '@mui/material'

const Home = () => {
    return (
        <>
            <Header />
            <div className="footer">
                <p>Created By Eureka | All Rights Reserved</p>
            </div>
        </>
    )
}

export default Home