import React, {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import DocumentData = firebase.firestore.DocumentData;
import {FirebaseAuthContext} from "../firebase";


import styles from './styles.scss';


const Card = (props: {children: any}) => {
    return <div className={styles.card}>
      {props.children}
    </div>;
};


const Dashboard = () => {
    const firebaseCtx = useContext(FirebaseAuthContext);
    const [noSanta, setNoSanta] = useState<DocumentData[]>([]);
    const [totalProfiles, setTotalProfiles] = useState<number>(0);
    const [santas, setSantas] = useState<string[]>([]);
    const [presentees, setPresentees] = useState<string[]>([]);
    const [notSanta, setNotSanta] = useState<DocumentData[]>([]);
    const [invalidData, setInvalidData] = useState<{[key: string]: DocumentData[]}>({});
    const [listeners, setListeners] = useState<{ (): void }[]>([]);

    useEffect(() => {
        const profilesRef = firebaseCtx.client.db.collection('event/2021/users');
        const santasRef = firebaseCtx.client.db.collection('event/2021/santa');
        const totalProfilesListener = profilesRef
            .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
                setTotalProfiles(snapshot.size);
            });
        const santasListener = santasRef
            .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
                if (snapshot.empty) return;
                const santaIds: string[] = [];
                const presenteeIds: string[] = [];
                snapshot.forEach(doc => {
                    santaIds.push(doc.id);
                    if (!presentees.find((item: string) => item === doc.id))
                        presenteeIds.push(doc.id);
                })
                setSantas(santaIds);
                setPresentees(presenteeIds);
            });
        if (santas.length > 0) {
            const notSantaListener = profilesRef
                .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
                    const notSantas: DocumentData[] = [];
                    snapshot.forEach(doc => {
                        if (!santas.includes(doc.id))
                            notSantas.push(doc.data());
                    });
                    setNotSanta(notSantas);
                });
            setListeners([...listeners, notSantaListener]);
        }
        const noSantaListener = profilesRef
            .where('has_santa', '==', false)
            .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
                const profiles: DocumentData[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    profiles.push(data);
                });
                setNoSanta(profiles);
            });
        const invalidDataListener = profilesRef
            .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
                if (snapshot.empty) return;

                const invalidProfiles: {[key: string]: DocumentData[]} = {
                    'has more than one santa': [],
                    'was selecte but has_santa=false': [],
                    'has no santa but has_santa=true': [],
                };

                snapshot.forEach(doc => {
                    const data = doc.data();
                    santasRef.where('presentee', '==', doc.id).get().then(
                        (snapshotDoc: QuerySnapshot<DocumentData>) => {
                            // Check the case when i have more than one santa
                            if (snapshotDoc.size > 1) {
                                invalidProfiles['has more than one santa'].push(data);
                                return;
                            } else if (data.has_santa) {
                                if (snapshotDoc.empty) {
                                    invalidProfiles['has no santa but has_santa=true'].push(data);
                                }
                            } else if (snapshotDoc.size > 0) {
                                invalidProfiles['was selecte but has_santa=false'].push(data);
                            }

                            setInvalidData(invalidProfiles);
                        }
                    );
                });
            });

        setListeners([
            ...listeners,
            totalProfilesListener,
            santasListener,
            noSantaListener,
            invalidDataListener
        ]);
    }, [
        JSON.stringify(firebaseCtx.eventRef),
        JSON.stringify(santas)
    ]);

    useEffect(() => {
        return () => {
            listeners.map(f => f())
        };
    }, []);

    return <div className={styles.dashboard}>
        <Card>
            <div className={styles.title}>Total registered</div>
            <div className={styles.content}>{totalProfiles}</div>
        </Card>
        <Card>
            <div className={styles.title}>Number of santas</div>
            <div className={styles.content}>{santas.length}</div>
        </Card>
         <Card>
            <div className={styles.title}>Number of presentees</div>
            <div className={styles.content}>{presentees.length}</div>
        </Card>
        <Card>
            <div className={styles.title}>Not santa ({notSanta.length})</div>
            <div className={styles.content}>
                <ul>
                    {notSanta.map(profile =>
                        <li key={profile.id}>{profile.name}</li>
                    )}
                </ul>
            </div>
        </Card>
         <Card>
            <div className={styles.title}>Has no santa ({noSanta.length})</div>
            <div className={styles.content}>
                <ul>
                    {noSanta.map(profile =>
                        <li key={profile.id}>{profile.name}</li>
                    )}
                </ul>
            </div>
        </Card>
        <Card>
            <div className={styles.title}>Data discrepancy</div>
            <div className={styles.content}>
                <ul>
                    {Object.keys(invalidData).map((reason: string, idx: number) =>
                        invalidData[reason].length > 0 &&
                            <React.Fragment key={idx}>
                                {invalidData[reason].map(profile =>
                                    <li key={profile.id}>{profile.name} {reason}</li>
                                )}
                            </React.Fragment>
                    )}
                </ul>
            </div>
        </Card>
    </div>;
};

export {Dashboard};
