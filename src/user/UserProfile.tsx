import React, {useContext} from "react";
import {Container} from "../ui/components/Container";
import {UserProfileProps} from "../auth/types";
import {JackInTheBox} from "react-awesome-reveal";
import {Title} from "../ui/components/Title";
import {LogOut} from "../auth/LogOut";
import {FirebaseAuthContext} from "../firebase";
import {WishList} from "./WishList";
import {Tabs} from "../ui/components/Tabs/Tabs";

import styles from './styles.scss';
import {SantaProfile} from "./SantaProfile";


const ProfileImage = ({url}: {url: string}) =>
    <div className={styles.avatar}>
        <img src={url} alt='user image'/>
    </div>


const tabs = [
    {label: 'Santa profile', children: <SantaProfile />},
    {label: 'Wish List', children: <WishList />},
];


const UserProfile = ({given_name: givenName, picture}: UserProfileProps) => {
    const firebaseCtx = useContext(FirebaseAuthContext);
    const {signOut} = firebaseCtx;

    return <JackInTheBox>
        <Container>
            <LogOut logoutHandler={() => signOut()} />

            <div className={styles.avatarWrapper}>
                <ProfileImage url={picture}/>
            </div>

            <Title text={`Welcome, ${givenName}!`} size={1}/>

            <Tabs items={tabs}/>
        </Container>
    </JackInTheBox>;
};

export {UserProfile};
