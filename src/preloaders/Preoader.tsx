import React, {useEffect, useState} from "react";
import {Loader} from "./types";
import {useMergeState} from "../firebase/utils";
import FontFaceObserver from "fontfaceobserver";


export const PreoaderContext = React.createContext<Loader>({} as Loader);


interface PreloaderProviderProps {
    images?: any[];
    fonts?: any[];
    children: any;
}

interface PreloaderState {
    fonts?: boolean;
    images?: boolean;
}


const PreloaderProvider = ({images, fonts, children}: PreloaderProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [results, setResult] = useMergeState<PreloaderState>({fonts: false, images: false});
    const [imagesCache, setImagesCache] = useMergeState<any>({});

    useEffect(() => {
        if (fonts && fonts.length)
            Promise.all(fonts.map(name => {
                const font = new FontFaceObserver(name);
                return font.load()
            })).then(() => {
                console.log('Fonts loaded');
                setResult({fonts: true});
            });

        if (images && images.length)
            Promise.all(images.map(path => {
                return new Promise<void>((resolve, reject) => {
                    import(`../assets/images/${path}`)
                        .then((img) => {
                            const el = new Image();
                            el.onload = () => {resolve()};
                            el.onerror = () => {reject()};
                            el.src = img.default;
                            setImagesCache({[path]: img.default})
                        });
                });
            })).then(() => {
                console.log('Images loaded');
                setResult({images: true});
            });
    }, []);

    useEffect(() => {
        const itemsNum = Object.values(results).length;
        const all = Object.values(results).filter(type => type);
        if (isLoading && all.length == itemsNum) {
            setIsLoading(false);
        }
    }, [JSON.stringify(results)])

    return <PreoaderContext.Provider value={{
        isLoading: isLoading,
        cache: imagesCache
    }}>
        {children}
    </PreoaderContext.Provider>
};

export {PreloaderProvider};
