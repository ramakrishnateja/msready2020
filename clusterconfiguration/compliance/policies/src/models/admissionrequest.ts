type AdmissionRequest = {
    kind: string,
    apiVersion: string,
    request: {
        uid: string,
        kind: {
            group: string,
            version: string,
            kind: string
        },
        resource: {
            group: string,
            version: string,
            resource: string
        },
        namespace: string,
        operation: string,
        userInfo: {
            username: string,
            groups: string[]
        },
        object: any,
        oldObject: any,
        dryRun: false
    }
}