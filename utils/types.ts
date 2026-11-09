export interface ContactsTable {
    id: number,
    startdate: number,
    enddate: number,
    callsign: string,
    freq: number,
    mode: string,
    power: number,
    country: string,
    coments: string
    userid: string
};

export interface ProfileTable {
    userid: string,
    callsign: string,
    country: string
};

export interface RepeatersTable {
    id: number,
    name: string,
    freq: number,
    offset: number,
    mode: string,
    userid: string
};