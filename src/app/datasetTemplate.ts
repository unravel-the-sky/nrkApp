export class datasetTemplate {
    constructor(
        public dataset: string,
        public dimension: string[],
        public konsumgroup: string[]
        // actually i won't modify anything yet, just read it
        // so i don't have to worry about this now
    ){}
}