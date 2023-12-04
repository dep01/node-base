

export interface ResponseInterface<T>{
    success:boolean;
    code:number;
    message:string;
    data:T
}
export interface PaginationInterface<T>{
    totalRecords:number;
    rowsData:number;
    items:T[];
}