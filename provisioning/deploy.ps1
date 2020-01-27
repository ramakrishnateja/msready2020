Param([String]$clientId,
    [String]$clientSecret,
    [String]$tenantId,
    [String]$subscriptionId,
    [String]$paramsDirectory,
    [Parameter(Mandatory = $false)] [String]$windowsAdminPassword)

$rgDetailsPath = $paramsDirectory + '/rg.json'
$aksParamsPath = $paramsDirectory + '/aks.json'
$routesParamsPath = $paramsDirectory + '/routes.json'

[PSCustomObject]$rgConfig = @{ }
$rgConfig = Get-Content -Path $rgDetailsPath -Force | Out-String | ConvertFrom-Json
$resourceGroup = $rgConfig.name
$region = $rgConfig.location
$tags = $rgConfig.tags -join " "
Function Login() {
    az login --service-principal --username $clientId --password $clientSecret --tenant $tenantId --output none
}

Function SetSubscription() {
    az account set --subscription $subscriptionId --output json
}

Function CreateResourceGroup() {
    az group create -l $region -n $resourceGroup --tags $tags
}

try {
    Login
    SetSubscription
    CreateResourceGroup

    $createdResourceGroupName = ''
    if($windowsAdminPassword -eq ''){
        $createdResourceGroupName = az group deployment create `
        -g $resourceGroup `
        --template-file ./templates/aks.json `
        --parameters @$aksParamsPath `
        --parameters clientSecret=$clientSecret `
        --parameters clientId=$clientId `
        --handle-extended-json-format `
        --query properties.outputs.resourceGroupName.value
    }else {
        $createdResourceGroupName = az group deployment create `
        -g $resourceGroup `
        --template-file ./templates/aks.json `
        --parameters @$aksParamsPath `
        --parameters clientSecret=$clientSecret `
        --parameters clientId=$clientId `
        --parameters windowsAdminPassword=$windowsAdminPassword `
        --handle-extended-json-format `
        --query properties.outputs.resourceGroupName.value
    }
    

    Write-Host $createdResourceGroupName

    $routeTableName = (az network route-table list -g "$createdResourceGroupName" `
            --subscription $subscriptionId `
            --query "[].{Name:name}" -o json | ConvertFrom-Json)[0].Name

    Write-Host $routeTableName

    az group deployment create `
        -g $createdResourceGroupName `
        --template-file ./templates/udr.json `
        --parameters @$routesParamsPath `
        --parameters routeTableName=$routeTableName `
        --handle-extended-json-format
}
catch {
    Write-Error $_.Exception.Message
}