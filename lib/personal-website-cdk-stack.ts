import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PersonalWebsiteCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Route53 Hosted Zone for babalawo.dev
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

    // example resource
    // const queue = new sqs.Queue(this, 'PersonalWebsiteCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
