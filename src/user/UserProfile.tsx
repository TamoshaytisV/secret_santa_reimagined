import React, {useContext, useEffect, useState} from "react";
import {Container} from "../ui/components/Container";
import {UserProfileProps} from "../auth/types";
import {JackInTheBox} from "react-awesome-reveal";
import {Title} from "../ui/components/Title";
import {LogOut} from "../auth/LogOut";
import {FirebaseAuthContext} from "../firebase";
import {SantaProfile} from "./SantaProfile";
import {WishList} from "./WishList";
import {Tab, Tabs} from "../ui/components/Tabs/Tabs";
import {Dashboard} from "../admin/Dashboard";
import {FeedbackForm} from "./Feedback";

import styles from './styles.scss';


export const ProfileImage = ({url}: { url: string }) =>
    <span className={styles.avatar}>
        <img src={url} alt='user image'/>
    </span>


const tabs = [
    {label: 'Santa profile', children: <SantaProfile/>},
    {label: 'My Wish List', children: <WishList/>},
    {label: 'Feedback', children: <FeedbackForm/>}
];


const UserProfile = ({given_name: givenName, picture}: UserProfileProps) => {
    const firebaseCtx = useContext(FirebaseAuthContext);
    const event = firebaseCtx.event;
    const userProfile = firebaseCtx.profile;
    const [tabsItems, setTabsItems] = useState<Tab[]>(tabs);
    const {signOut} = firebaseCtx;

    useEffect(() => {
        if (userProfile.isAdmin) {
            const adminTab: Tab = {label: 'Admin', children: <Dashboard />};
            setTabsItems([...tabsItems, adminTab]);
        }
    }, []);

    return <JackInTheBox>
        <Container>
            <LogOut logoutHandler={() => signOut()}/>

            <div className={styles.avatarWrapper}>
                <ProfileImage url={picture}/>
            </div>

            <Title text={`Welcome, ${givenName}!`} size={1}/>

            {event.started && <Tabs items={tabsItems}/>}

            {!event.started && <div className={styles.waitMsg}>
                <p>Thanks for joining!</p>
                <p>
                    Event has not started yet but don't worry, it will start soon :)
                    Let's just wait for others to register
                </p>
                <p>Meantime, click play icon at the top right to listen to the christmas song...</p>
            </div>}
        </Container>
    </JackInTheBox>;
};

export {UserProfile};
