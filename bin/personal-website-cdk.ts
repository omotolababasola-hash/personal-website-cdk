#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { PersonalWebsiteCdkStack } from '../lib/personal-website-cdk-stack';
import { WebsiteContentPipelineStack } from '../lib/website-content-pipeline-stack';

const app = new cdk.App();

// Infrastructure pipeline stack
new PersonalWebsiteCdkStack(app, 'PersonalWebsiteCdkStack', {
  env: { account: '003100375394', region: 'us-east-1' },
});

// Website content pipeline stack
new WebsiteContentPipelineStack(app, 'WebsiteContentPipelineStack', {
  env: { account: '003100375394', region: 'us-east-1' },
});

app.synth();
