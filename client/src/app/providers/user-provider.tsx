import {createContext, ReactNode, useEffect, useState} from 'react'
import {UserData} from '@/shared/types'
import {Fetch} from '@/shared/utils/methods'
import {getCookie} from '@/shared/utils'

export const UserContext = createContext<UserData | null>(null)

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        Fetch(import.meta.env.VITE_API_URL + '/api/users/get-user', {
            method: "POST",
            body: JSON.stringify({
                token: getCookie('token'),
            }),
        })
            .then((res) => {
                if (res.success) setUserData(res.data);
            })
    }, []);

    return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
}
