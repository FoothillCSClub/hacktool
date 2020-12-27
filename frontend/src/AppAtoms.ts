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

const currentUserAuthToken: RecoilState<string> = atom({
    key: 'CurrentUserAuthToken',
    default: '',
    effects_UNSTABLE: [
        localStorageEffect('current_user_auth_token'),
    ]
});

export {
    currentUserAuthToken
}