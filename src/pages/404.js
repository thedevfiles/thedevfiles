import React from "react"
import Layout from "../components/layout";
import Helmet from "react-helmet";

const NotFoundPage = () => {
    return (
        <Layout>
            <Helmet
                title={' Page Not Found | The Dev Files'}
                meta={[
                    {name: 'robots', content: 'noindex, follow'}
                ]}
            >
            </Helmet>
            <div className="page card">
                <header className="page__header">
                    <h1 className="page__title card__title">404: Page Not Found</h1>
                </header>

                <div className="page__body">
                    The page you requested could not be found.
                </div>
            </div>

        </Layout>
    )
}

export default NotFoundPage