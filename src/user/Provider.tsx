import React from "react";
import bind from "bind-decorator";


export interface Presentee {
    name: string;
    uid: string;
    picture: string;
}


interface SantaProfileState {
    isSanta?: boolean;
    presentee?: Presentee | null;
    wishlist?: string | null;
    isLoading?: boolean;
}


interface SantaProfileContext extends SantaProfileState {
    update: (data: SantaProfileState) => void;
}

export const SantaContext = React.createContext<SantaProfileContext>({} as SantaProfileContext);


class SantaProfileProvider extends React.PureComponent<any, SantaProfileState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            isSanta: false,
            presentee: null,
            wishlist: null
        }
    }

    componentDidUpdate(prevProps: Readonly<any>) {
        const {client, user, isLoading} = this.props.firebaseCtx;

        if (prevProps.firebaseCtx.isLoading && !isLoading) {
            setTimeout(() => this.setState({isLoading: false}), 600);
        }

        if (!client.eventRef || !user) return;

        if (this.state.presentee) return;

        client.getPresentee(user.uid)
            .then(([presenteeUid, presentee]: [string, Presentee]) => {
                if (!presenteeUid || !presentee) {
                    this.setState({
                        isLoading: false
                    });
                    return;
                }

                this.setState({
                    presentee: {
                        uid: presenteeUid,
                        name: presentee.name,
                        picture: presentee.picture
                    },
                    isSanta: true,
                    isLoading: false
                });
            });
    }


    @bind
    update(data: SantaProfileState) {
        this.setState(data);
    }

    render() {
        return <SantaContext.Provider value={{
            presentee: this.state.presentee,
            isSanta: this.state.isSanta,
            update: this.update,
            isLoading: this.state.isLoading
        }}>
            {this.props.children}
        </SantaContext.Provider>;
    }
}

export default SantaProfileProvider;
