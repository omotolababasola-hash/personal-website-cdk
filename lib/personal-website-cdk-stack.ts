import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

export class PersonalWebsiteCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.HostedZone(this, 'BabalawoDevHostedZone', {
      zoneName: 'babalawo.dev',
      comment: 'Hosted zone for babalawo.dev domain'
    });

    // Output the hosted zone ID and name servers for domain configuration
    new cdk.CfnOutput(this, 'HostedZoneId', {
      value: hostedZone.hostedZoneId,
      description: 'Route53 Hosted Zone ID for babalawo.dev'
    });

    new cdk.CfnOutput(this, 'NameServers', {
      value: cdk.Fn.join(', ', hostedZone.hostedZoneNameServers || []),
      description: 'Name servers for babalawo.dev domain'
    });

    // CodePipeline for CI/CD using CDK Pipelines
    const pipeline = new CodePipeline(this, 'PersonalWebsitePipeline', {
      pipelineName: 'personal-website-pipeline',
      synth: new ShellStep('TestAndDeploy', {
        input: CodePipelineSource.gitHub('omotolababasola-hash/personal-website-cdk', 'main'),
        commands: [
          'npm ci',
          'npm run test',
          'npm run build',
          'npx cdk deploy'
        ]
      })
    });

   }
}
