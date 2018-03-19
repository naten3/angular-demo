export interface Page<T> {
    Type: any;
    content: Array<T>;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    sort: string;
    totalElements: number;
    totalPages: number;
}