import * as cdk from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as PersonalWebsiteCdk from '../lib/personal-website-cdk-stack';

describe('PersonalWebsiteCdkStack', () => {
  test('matches snapshot', () => {
    const app = new cdk.App();
    const stack = new PersonalWebsiteCdk.PersonalWebsiteCdkStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);
    
    expect(template.toJSON()).toMatchSnapshot();
  });
});
