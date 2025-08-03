// amplify/functions/magic-request/resource.ts
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import * as path from 'path';

export class MagicRequestFunction extends Construct {
  public readonly function: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const geminiApiKeySecret = Secret.fromSecretNameV2(
      this,
      'gemini-api-key-secret',
      'GEMINI_API_KEY'
    );

    this.function = new NodejsFunction(this, 'magic-request-handler', {
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      entry: path.join(__dirname, 'handler.ts'),
      handler: 'handler',
      environment: {
        GEMINI_API_KEY_SECRET_NAME: geminiApiKeySecret.secretName,
      },
    });

    geminiApiKeySecret.grantRead(this.function);
  }
}
