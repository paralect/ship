# Product Constitution (VERSION: **1.0.0**)

**Last Updated:** January 31, 2018

**Constitution read and signed by the following members:**

1. Product Owner Name [Product changes approvals]
2. Developer Name [Development]
4. Tech Lead/CTO Name [Development, Technical approvals]
6. QA Lead NAME [QA & production approvals]

## General information [Everyone]

1. Product constitution is a list of laws that must be followed by every team member.
2. By breaking the law you can get into the prison.
3. The main goal of the constitution is to make sure consistency of approaches, transparency between team members, quality and stability of the product.
4. Every change to the constitution **must be pull requested and approved by every team member**
5. Every constitution change should trigger version update.
6. Different topics are relevant to the different team members (see if relevant in square brackets near each topic)

## Branching, pull requests, code review, commits [Development]

### Branch naming [Development]

Every branch in upstream must starts with a prefix that is based on user initials. For example, for developer `Andrew Orsich` prefix would be `ao_`. In case of prefix collisions in the future the common rule is to dive deeper into the last name, for example: `aors_`.

### Pull request review [Development]

1. Ideally, every pull request should be assigned to the two reviewers: primary and secondary. Primary reviewers at the moment are: Uladzimir Mitschevich, Anton Tsapliuk and Nikita Nesterenko. Assignments should be done in github.
2. Pull request, which is ready for review must have label `to review`.
3. Once reviewer finish pull request review he must either approve or reject pull request. If pull request was rejected, reviewer must assign label `in progress`.
4. Pull request can be merged only if it **approved by both reviewers or primary reviewer** and **CI tests pass**. Second or primary reviewer can merge pull request.
5. As a reviewer, I promise to review pull requests assigned to me at least twice a day. In the morning and in the evening, before I leave, to make sure that my peers can move forward with their tasks and pull requests does not stuck waiting for me to review them.

### Commit message [Development]

1. Commit message must explain the change that was made. Commit messages aka: `I am even stupider than I thought`, `fail`, `fix`, `Too tired to write descriptive message`, `fixed errors in the previous commit`, `Friday, 5pm`, `This will definitely break in 2031 (TODO)`, `fixed some minor stuff, might need some additional work.` are not allowed.


## Deployments [Development]

### Staging Deployments
Staging deployment happens automatically as soon as pull request has been merged to the master branch. In some cases there is a need to deploy some changes to staging to test them in `production like` environment. We use branch name `staging-experiment` for that purpose. This branch is set to automatically deploy changes to staging and everyone is allowed to use this branch anytime to test his changes without a need for pull request to be merged.

Note: Please, let the team know when you using this branch to avoid conflicts and to not stop normal QA workflow.

Note: This branch is allowed to be force-pushed. It's better to reset to the exact commit whenever you need this branch.


### Production Deployments [Development]

Production deployments happens automatically as soon as changes has been merged to the `production` branch. Anyone in a team can do the deployment. Before deploying to production make sure that QA approved the deployment. Person, who deploying to production should quickly check that new changes looks as expected on production.
