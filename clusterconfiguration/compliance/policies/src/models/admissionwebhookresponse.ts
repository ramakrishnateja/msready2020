export class AdmissionWebHookResponse {
    readonly apiVersion = "admission.k8s.io/v1beta1";
    readonly kind = "AdmissionReview";

    getFailureResponse(uid:string, message:string){
        return {
            "apiVersion": this.apiVersion,
            "kind": this.kind,
            "response": {
                "uid": uid,
                "allowed": false,
                "status": {
                    "code": 403,
                    "message": message
                }
            }
        }
    }
    
    getSuccessResponse(uid:string){
        return {
            "apiVersion": this.apiVersion,
            "kind": this.kind,
            "response": {
                "uid": uid,
                "allowed": true
            }
        }
    }
}