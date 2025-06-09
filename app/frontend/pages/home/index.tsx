import type { FC } from "react";
import Layout from "../Layout";
import { ChatLayout } from "@/components/chat";

const Home: FC = () => {
    return (
        <ChatLayout />
    )
}

// @ts-ignore
Home.layout = (page) => {
    return <Layout children={page} />
}

export default Home;