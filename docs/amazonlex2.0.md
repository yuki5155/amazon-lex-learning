Creating Amazon Lex V2 resources with AWS CloudFormation
 PDF
 RSS
Focus mode
On this page
Amazon Lex V2 and AWS CloudFormation templates
Learn more about AWS CloudFormation
Recently added to this guide
Did this page help you?
Yes
No
Provide feedback

Amazon Lex V2 is integrated with AWS CloudFormation, a service that helps you to model and set up your AWS resources so that you can spend less time creating and managing your resources and infrastructure. You create a template that describes all the AWS resources that you want (such as Amazon Lex V2 chatbots), and AWS CloudFormation provisions and configures those resources for you.

When you use AWS CloudFormation, you can reuse your template to set up your Amazon Lex V2 resources consistently and repeatedly. Describe your resources once, and then provision the same resources over and over in multiple AWS accounts and Regions.

Amazon Lex V2 and AWS CloudFormation templates

To provision and configure resources for Amazon Lex V2 and related services, you must understand AWS CloudFormation templates. Templates are formatted text files in JSON or YAML. These templates describe the resources that you want to provision in your AWS CloudFormation stacks. If you're unfamiliar with JSON or YAML, you can use AWS CloudFormation Designer to help you get started with AWS CloudFormation templates. For more information, see What is AWS CloudFormation Designer? in the AWS CloudFormation User Guide.

Amazon Lex V2 supports creating the following resources in AWS CloudFormation:

AWS::Lex::Bot

AWS::Lex::BotAlias

AWS::Lex::BotVersion

AWS::Lex::ResourcePolicy

For more information, including examples of JSON and YAML templates for these resources, see the Amazon Lex V2 resource type reference in the AWS CloudFormation User Guide.