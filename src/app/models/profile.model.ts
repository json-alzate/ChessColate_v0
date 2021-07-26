export interface Settings {
    figures: boolean;
}

export interface Profile {
    uid: string;
    email: string;
    avatarUrl?: string;
    name?: string;
    createdAt: number;
    settings: Settings;
}
