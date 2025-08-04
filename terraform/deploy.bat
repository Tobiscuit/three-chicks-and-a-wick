@echo off
echo Building Lambda function...
cd lambda
call npm install
powershell Compress-Archive -Path * -DestinationPath magic-request.zip -Force
cd ..

set TERRAFORM_PATH=C:\Users\Jrami\Downloads\terraform_1.12.2_windows_amd64\terraform.exe

echo Initializing Terraform...
"%TERRAFORM_PATH%" init

echo Planning Terraform deployment...
"%TERRAFORM_PATH%" plan

echo Applying Terraform deployment...
"%TERRAFORM_PATH%" apply -auto-approve

echo Deployment complete!
echo GraphQL URL and API Key:
"%TERRAFORM_PATH%" output