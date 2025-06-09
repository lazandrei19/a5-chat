import type { FC } from "react";
import Layout from "../Layout";

const Home: FC = () => {
    return (
        <h1>Hello!</h1>
    )
}

Home.layout = (page) => {
    return <Layout children={page} />
}

export default Home;