#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { PersonalWebsiteCdkStack } from '../lib/personal-website-cdk-stack';

const app = new cdk.App();
new PersonalWebsiteCdkStack(app, 'PersonalWebsiteCdkStack', {
  env: { account: '003100375394', region: 'us-east-1' },
});
app.synth();
