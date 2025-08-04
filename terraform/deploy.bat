@echo off
echo Building Lambda function...
cd lambda
call npm install
powershell Compress-Archive -Path * -DestinationPath magic-request.zip -Force
cd ..

echo Initializing Terraform...
terraform init

echo Planning Terraform deployment...
terraform plan

echo Applying Terraform deployment...
terraform apply -auto-approve

echo Deployment complete!
echo GraphQL URL and API Key:
terraform output