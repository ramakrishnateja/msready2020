import { Request, Response, NextFunction } from "express";
import { AdmissionWebHookResponse } from "../models/admissionwebhookresponse";
//import { AdmissionRequest } from "../models/admissionrequest";

export class NoPublicIpController {
    async validate(req: Request, res: Response, next: NextFunction) {

        try {
            let admissionRequest: AdmissionRequest = req.body;
            const webHookResponse = new AdmissionWebHookResponse();
            if (admissionRequest
                && admissionRequest.request
                && admissionRequest.request.object
                && admissionRequest.request.object.metadata) {
                const kubeObject = admissionRequest.request.object;
                const internalLoadBalancerAnnotation = kubeObject.metadata.annotations["service.beta.kubernetes.io/azure-load-balancer-internal"];
                if (kubeObject.spec.type === "Nodeport") {
                    console.log(`attempted to create service type Nodeport. rejecting it`);
                    res.json(webHookResponse.getFailureResponse(admissionRequest.request.uid,
                        `service type Nodeport is restricted. please contact cluster administrator for more information`));
                } else if (kubeObject.spec.type === "LoadBalancer") {
                    if (!internalLoadBalancerAnnotation) {
                        console.log(`attempted to create service type LoadBalancer with out internal load balancer annotation. rejecting it`);
                        res.json(webHookResponse.getFailureResponse(admissionRequest.request.uid,
                            `public loadbalancer service is not allowed. please contact cluster administrator for more information `));
                    }
                    else if (internalLoadBalancerAnnotation !== "true") {
                        console.log(`attempted to create service type LoadBalancer with internal load balancer annotation not set to true. rejecting it`);
                        res.json(webHookResponse.getFailureResponse(admissionRequest.request.uid,
                            `public loadbalancer service is not allowed. please contact cluster administrator for more information `));
                    }
                } else {
                    res.json(webHookResponse.getSuccessResponse(admissionRequest.request.uid));
                }
            } else {
                console.log(` Invalid request object ${JSON.stringify(req.body)}`);
                res.status(500).json({ message: `Invalid Admission Request ${req.body}}` });
            }
        } catch (err) {
            res.json(err).status(500);
        }
    }
}