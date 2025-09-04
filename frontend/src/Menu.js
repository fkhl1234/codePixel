import React from "react";
import { Link } from "react-router-dom";

import Layout from "./Layout";

import Button from '@mui/material/Button';

export default function Menu() {
    return (
        <Layout>
            <Button variant="contained" component={Link} to="/challenge"> challenge </Button>
        </Layout>
    )
}