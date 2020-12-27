import { atom, DefaultValue, RecoilState } from 'recoil'

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any) => {
        if (newValue instanceof DefaultValue) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    });
};

const currentUserAuthTokenState: RecoilState<string> = atom({
    key: 'CurrentUserAuthToken',
    default: '',
    effects_UNSTABLE: [
        localStorageEffect('do_not_share_current_user_auth_token'),
    ]
});

export {
    currentUserAuthTokenState
}