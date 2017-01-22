export class DatasetTemplate {
    constructor(
        public groupName: string,
        public time: string,
        public cpi: number,
        public monthlyChange: number,
        public twelveMonthRate: number
        // actually i won't modify anything yet, just read it
        // so i don't have to worry about this now
    ){}
}