export type RequestNewClubDTO = {
    clubID: string;
    name: string;
    desc?: string;
    avatar?: string;
    background?: string;
    user: string;
}