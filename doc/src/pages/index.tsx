import React from 'react';
import {Redirect} from '@docusaurus/router';
import Head from "@docusaurus/Head";

const Home = () => {
    return <Redirect to="/docs/intro" />;
};

export default Home;