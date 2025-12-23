import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { PersonalWebsiteAppStack } from './personal-website-app-stack';

export class PersonalWebsiteCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'PersonalWebsitePipeline', {
      pipelineName: 'personal-website-pipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('omotolababasola-hash/personal-website-cdk', 'main', {
          authentication: cdk.SecretValue.secretsManager('github-token')
        }),
        commands: [
          'npm ci',
          'npm run test',
          'npm run build',
          'npx cdk synth'
        ]
      }),
      codeBuildDefaults: {
        rolePolicy: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'ssm:GetParameter',
              'ssm:GetParameters'
            ],
            resources: [
              `arn:aws:ssm:${this.region}:${this.account}:parameter/cdk-bootstrap/*`
            ]
          })
        ]
      }
    });

    // Add deployment stage for the application stack
    const deployStage = new PersonalWebsiteDeployStage(this, 'Deploy', {
      env: {
        account: this.account,
        region: this.region
      }
    });

    pipeline.addStage(deployStage);

    // Output pipeline information
    // new cdk.CfnOutput(this, 'PipelineName', {
    //   value: pipeline.pipeline.pipelineName,
    //   description: 'CodePipeline name for personal website'
    // });
  }
}

// Stage class for deployment
class PersonalWebsiteDeployStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new PersonalWebsiteAppStack(this, 'PersonalWebsiteApp');
  }
}
