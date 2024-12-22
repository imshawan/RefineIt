export namespace ApiRequests {
    // Interface for authentication payload
    interface AuthPayload {
        token: string;
    }

    interface SagaRequestPayload {
        formValues: FormValues;
        success: Function
        failure: Function
    }
}

export interface IFetchQueryPayload {
    page?: number
    limit?: number
    sortBy?: string
    q?: string
}