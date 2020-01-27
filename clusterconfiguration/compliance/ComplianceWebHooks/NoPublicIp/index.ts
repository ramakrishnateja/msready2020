import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    var admissionRequest = req.body;
    context.log(`Request Body: ${JSON.stringify(req.body)}`);
    var object = admissionRequest.request.object;

    context.log(`validating the ${object.metadata.name} pod`);
    context.log(`${object.metadata.annotations}`);

    let isValid = true;
    let message = "";
    if (object.spec.type === "LoadBalancer") {
        if (!object.metadata.annotations) {
            isValid = false;
            message = `A service of type load balancer need to have an annotation 'service.beta.kubernetes.io/azure-load-balancer-internal: true'`
        }
        else {
            let annotation = object.metadata.annotations['service.beta.kubernetes.io/azure-load-balancer-internal'];
            if(!annotation || (annotation && annotation !== "true")){
                isValid = false;
                message = `A service of type load balancer need to have an annotation 'service.beta.kubernetes.io/azure-load-balancer-internal: true'`
            }
        }
    }

    if(object.spec.type === "NodePort"){
        isValid = false;
        message = `A service of type NodePort is not allowed`;
    }

    if (isValid) {
        context.res = {
            // status: 200, /* Defaults to 200 */
        };
    }
    else {
        context.res = {
            status: 400,
            body: message
        };
    }
};

export default httpTrigger;
