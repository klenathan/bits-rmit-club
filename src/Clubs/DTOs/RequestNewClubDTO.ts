export type RequestNewClubDTO = {
    clubid: string;
    name: string;
    desc?: string;
    avatar?: string;
    background?: string;
    user: string; // requester
    president?: string;
}