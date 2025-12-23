import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';

export class WebsiteContentPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    // CodeBuild project for building and deploying website content
    const buildProject = new codebuild.Project(this, 'WebsiteContentBuild', {
      projectName: 'website-content-build',
      description: 'Build and deploy website content to S3',
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              nodejs: '18'
            },
            commands: [
              'npm ci'
            ]
          },
          build: {
            commands: [
              'npm run build'
            ]
          },
          post_build: {
            commands: [
              `aws s3 cp dist s3://babalawo-dev-website-${this.account} --recursive`,
              `aws s3 cp public s3://babalawo-dev-website-${this.account} --recursive`
            ]
          }
        }
      })
    });

    // Grant permissions to deploy to S3 bucket
    buildProject.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:GetObject',
        's3:DeleteObject',
        's3:ListBucket'
      ],
      resources: [
        `arn:aws:s3:::babalawo-dev-website-${this.account}`,
        `arn:aws:s3:::babalawo-dev-website-${this.account}/*`
      ]
    }));

    // CodePipeline for website content
    const pipeline = new codepipeline.Pipeline(this, 'WebsiteContentPipeline', {
      pipelineName: 'website-content-pipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipelineActions.GitHubSourceAction({
              actionName: 'GitHub_Source',
              owner: 'omotolababasola-hash',
              repo: 'personal-website',
              branch: 'main',
              oauthToken: cdk.SecretValue.secretsManager('github-token'),
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'BuildAndDeploy',
          actions: [
            new codepipelineActions.CodeBuildAction({
              actionName: 'BuildAndDeploy',
              project: buildProject,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
      ],
    });

    // Output pipeline information
    new cdk.CfnOutput(this, 'ContentPipelineName', {
      value: pipeline.pipelineName,
      description: 'Website content pipeline name'
    });

    new cdk.CfnOutput(this, 'ContentPipelineArn', {
      value: pipeline.pipelineArn,
      description: 'Website content pipeline ARN'
    });
  }
}