# Project Concept

## Working Name

Outfolio

## One-Line Summary

Outfolio is a public portfolio and project documentation platform where OutSystems developers can showcase their work through structured case studies, screenshots, architecture notes, metadata, and privacy-safe project artifacts.

## Problem

OutSystems developers often struggle to demonstrate their work publicly.

Traditional software developers can usually share a GitHub repository, open-source contribution, code sample, or deployed demo. OutSystems developers often cannot do this because their work lives inside the OutSystems platform, and exported project artifacts such as `.oml` or `.oap` files are not easily readable, inspectable, or renderable by people outside the OutSystems ecosystem.

This creates a professional visibility problem:

- Developers cannot easily prove the quality, complexity, or technical depth of their OutSystems work.
- Recruiters and clients may not understand what was built or what the developer contributed.
- Enterprise projects are often confidential, making direct demos or screenshots difficult to share.
- OutSystems artifacts are not equivalent to a public source repository.
- Project evidence is scattered across screenshots, exports, diagrams, documentation, and personal explanations.
- OutSystems work may be undervalued because there is no familiar public inspection layer similar to GitHub.

## Target Users

### Primary Users

OutSystems developers who want to create a professional public portfolio of their projects.

This includes:

- Junior OutSystems developers seeking jobs or internships.
- Experienced OutSystems developers building a public professional profile.
- Freelancers and consultants who need to show previous project experience.
- Students or bootcamp graduates learning OutSystems.
- Developers transitioning from traditional software development to OutSystems.

### Secondary Users

People who need to evaluate OutSystems experience:

- Recruiters
- Hiring managers
- Technical leads
- Clients
- Consulting firms
- OutSystems team managers

### Tertiary Users

Organizations and agencies that want to showcase anonymized OutSystems projects without exposing private client systems, credentials, internal data, or proprietary implementation details.

## Core Value Proposition

Outfolio helps OutSystems developers turn platform-specific project artifacts into clear, professional, shareable project case studies.

The platform does not attempt to run an OutSystems application outside OutSystems. Instead, it creates a structured public representation of the project: what it does, what screens and workflows exist, what entities and integrations were involved, what the developer contributed, and what business or technical problem the project solved.

In short:

> GitHub shows source code. Outfolio shows OutSystems work.

## Product Goals

The product should allow an OutSystems developer to:

1. Create a public developer profile.
2. Create project pages for OutSystems applications.
3. Upload supporting project artifacts such as screenshots, diagrams, documentation, `.oml`, or `.oap` files.
4. Describe their role, contribution, technical decisions, and project impact.
5. Generate an AI-assisted project case study from provided information.
6. Redact or anonymize sensitive client and company information.
7. Share a public project URL with recruiters, clients, peers, or employers.

The product should allow a visitor to:

1. Browse a developer's public OutSystems projects.
2. Understand what each project does.
3. Inspect screenshots, workflows, architecture notes, data model summaries, integrations, and technical highlights.
4. See what the developer personally contributed.
5. Evaluate project credibility without needing an OutSystems account or access to the original environment.

## MVP Scope

The first version should prove that OutSystems work can be showcased clearly without requiring the app to run outside OutSystems.

### MVP Features

- User registration and login.
- Developer profile page.
- Create, edit, publish, unpublish, and delete OutSystems projects.
- Project metadata:
  - title
  - summary
  - project type
  - OutSystems version or environment type
  - developer role
  - client/company visibility setting
  - start date
  - end date
  - project status
  - tags
- Project media:
  - screenshots
  - demo video links
  - architecture diagrams
  - data model diagrams
  - workflow diagrams
- Artifact uploads:
  - `.oml`
  - `.oap`
  - `.zip`
  - `.pdf`
  - `.md`
  - images
- Manual project sections:
  - problem solved
  - main features
  - screens and workflows
  - entities/data model
  - integrations
  - business logic
  - security/roles
  - technical challenges
  - personal contribution
  - business impact
- AI-assisted case study generation.
- Public project page.
- Public developer profile page.
- Privacy settings:
  - public
  - private
  - unlisted
  - anonymized
- Redaction guidance for sensitive enterprise information.
- Uploaded artifacts private by default.

## Out of Scope for MVP

The MVP should not attempt to:

- Run an OutSystems app outside the OutSystems platform.
- Fully render `.oml` or `.oap` files as executable applications.
- Replace Service Studio.
- Replace Architecture Dashboard, LifeTime, or AI Mentor Studio.
- Guarantee complete parsing of OutSystems proprietary formats.
- Provide deployment or hosting for OutSystems applications.
- Publish uploaded source artifacts automatically.
- Require direct access to a user's OutSystems environment.

## Important Product Principle

Outfolio should represent OutSystems projects honestly.

It should not pretend that an OutSystems project is the same as a traditional source-code repository. Instead, it should create a project inspection model suited to OutSystems: modules, screens, flows, entities, integrations, roles, timers, business logic, architecture patterns, and delivery context.

The goal is to make OutSystems work understandable and credible to outsiders without misrepresenting the platform.

## Key User Journeys

### Journey 1: Developer Creates a Public Project

An OutSystems developer signs in, creates a new project, uploads screenshots and optional `.oml` or `.oap` files, fills in project details, asks the AI to generate a case study, reviews the generated content, redacts sensitive names, and publishes the project.

### Journey 2: Recruiter Reviews a Project

A recruiter opens a shared project link and sees a clear overview of the application, screenshots, main features, developer role, architecture notes, data model summary, integrations, and project impact. The recruiter does not need an OutSystems account to understand the work.

### Journey 3: Developer Publishes an NDA-Safe Case Study

A developer who worked on a private enterprise OutSystems application creates an anonymized project. They hide client names, replace sensitive screenshots with redacted images, describe the architecture and contribution at a safe level of detail, and publish the project as proof of experience.

### Journey 4: Developer Builds an OutSystems Portfolio

A developer creates multiple OutSystems project pages. Their public profile becomes a professional portfolio that can be shared in job applications, proposals, interviews, and social profiles.

## Core Entities

### User

Represents a registered account.

Important fields:

- name
- email
- username
- bio
- location
- profile image
- LinkedIn URL
- personal website URL
- OutSystems community profile URL
- years of OutSystems experience
- certifications
- visibility settings

### Project

Represents an OutSystems project case study.

Important fields:

- owner
- title
- slug
- summary
- project type
- OutSystems platform version
- environment type
- role
- visibility
- anonymization enabled
- start date
- end date
- tags
- published date

### Artifact

Represents an uploaded file or external resource connected to a project.

Important fields:

- project
- file name
- file type
- storage URL/path
- visibility
- extracted metadata
- upload date

### Project Section

Represents structured content within a project page.

Important fields:

- project
- section type
- title
- body
- order
- visibility

### Media Asset

Represents screenshots, videos, diagrams, or visual material.

Important fields:

- project
- media type
- URL/path
- caption
- order
- visibility

### AI Case Study Draft

Represents AI-generated content created from project metadata and artifacts.

Important fields:

- project
- source inputs
- generated overview
- generated sections
- warnings
- assumptions
- redaction suggestions
- created date

## Suggested Public Project Sections

Each public project page should support these sections:

1. Overview
2. Problem
3. Solution
4. My Role
5. Main Features
6. Screens and Workflows
7. Modules
8. Data Model
9. Integrations
10. Business Logic
11. Roles and Permissions
12. Technical Challenges
13. Business Impact
14. Artifacts and Documentation
15. Privacy / Redaction Notes

## OutSystems-Specific Concepts To Support

The product should eventually support structured representation of common OutSystems concepts, including:

- Applications
- Modules
- Screens
- Blocks
- Client actions
- Server actions
- Service actions
- Entities
- Static entities
- Aggregates
- SQL queries
- Timers
- Site properties
- Roles
- REST integrations
- SOAP integrations
- Forge components
- Dependencies
- Environment information
- Deployment notes

The MVP does not need full automatic extraction of these concepts, but the data model and user interface should be designed so that these concepts can be added manually first and extracted automatically later.

## AI Assistance

AI should help the developer explain their project clearly, but it must not invent project details.

AI features should include:

- Generate a first draft of an OutSystems project case study.
- Rewrite project descriptions for recruiters or technical reviewers.
- Suggest missing project sections.
- Summarize uploaded documentation.
- Suggest tags.
- Suggest likely redaction risks.
- Convert informal developer notes into professional portfolio copy.
- Turn lists of screens, entities, integrations, and features into readable explanations.

AI must be constrained by the user's provided information and uploaded artifacts. If the system is unsure, it should mark content as an assumption or ask for clarification.

## Privacy and Trust Requirements

Privacy is critical because many OutSystems projects are enterprise applications.

The platform should support:

- Private projects.
- Unlisted projects.
- Public projects.
- Per-artifact visibility controls.
- Redaction warnings.
- Anonymized project/client names.
- Optional hiding of uploaded `.oml` and `.oap` files.
- Clear distinction between private uploaded artifacts and public project content.
- AI warnings when generated text may contain sensitive information.
- Explicit confirmation before publishing any project.

Uploaded artifacts should never become public automatically.

## Success Criteria

The project is successful if an OutSystems developer can create a public project page that:

- Explains what the project does.
- Shows credible evidence of the work.
- Communicates the developer's personal contribution.
- Is understandable to someone outside the OutSystems ecosystem.
- Avoids exposing sensitive client or company information.
- Can be shared as part of a professional portfolio.

## Differentiation

Outfolio is different from GitHub because it does not assume the primary artifact is source code.

It is different from a generic portfolio site because it understands OutSystems-specific project structure, including modules, screens, entities, roles, integrations, and business logic.

It is different from OutSystems tools like Service Studio, LifeTime, and Architecture Dashboard because it is not an internal development or governance tool. It is a public-facing portfolio and explanation layer.

## Long-Term Vision

Outfolio could become the professional identity layer for OutSystems developers.

Possible future capabilities include:

- Automatic metadata extraction from `.oml` and `.oap` files.
- OutSystems LifeTime integration.
- ODC integration.
- Architecture Dashboard import.
- AI-generated architecture diagrams.
- Public/private project comparison views.
- Team and agency profiles.
- Verified OutSystems projects.
- Certification badges.
- Recruiter search.
- Skill evidence based on project content.
- Versioned project histories.
- Collaboration on project case studies.
- Portfolio analytics.

## MVP Hypothesis

If OutSystems developers can turn private, platform-specific project artifacts into polished and privacy-safe public case studies, then they will be better able to demonstrate credibility, explain their work, and win jobs, clients, or professional recognition.

## Constraints

- The product must not depend on running uploaded OutSystems applications.
- The product must work even if `.oml` or `.oap` parsing is limited.
- Manual project creation must be useful without automatic extraction.
- AI-generated content must be editable before publishing.
- Uploaded artifacts must remain private by default.
- The system should be designed for OutSystems first, with possible expansion to other low-code platforms later.