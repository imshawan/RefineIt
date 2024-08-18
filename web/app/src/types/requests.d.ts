export namespace ApiRequests {
    // Interface for authentication payload
    export interface AuthPayload {
        token: string;
    }

    export interface SagaRequestPayload {
        formValues: FormValues;
        success: Function
        failure: Function
    }
}