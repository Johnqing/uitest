import React, {lazy, Suspense} from 'react';
import { Route, HashRouter as Router } from 'react-router-dom';

import Layout from './layout';

const Index =  lazy(() => import('./pages/index'));
export default (
    <Router>
        <Layout>
            <Suspense fallback={<div></div>}>
                <Route path="/" exact component={Index} />
            </Suspense>
        </Layout>
    </Router>
)
        
        