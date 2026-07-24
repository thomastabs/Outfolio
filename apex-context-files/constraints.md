# Constraints

EARS-structured quality constraints for the whole project. Behavioural requirements live in the Gherkin acceptance criteria.

## Availability

- **NFR-6** _(ubiquitous)_: The system shall ensure that public developer profiles and project pages are available to visitors without requiring an OutSystems account.
  - _Rationale:_ To allow recruiters and clients to access portfolio content easily without platform barriers.

## Maintainability

- **NFR-8** _(ubiquitous)_: The system shall be designed to support manual entry and editing of OutSystems-specific project concepts before automatic extraction capabilities are implemented.
  - _Rationale:_ To ensure MVP usefulness and facilitate future extensibility.

## Observability

- **NFR-13** _(ubiquitous)_: The system shall log user actions related to project publishing, artifact uploads, and privacy setting changes for audit and troubleshooting purposes.
  - _Rationale:_ To enable monitoring and ensure compliance with privacy and security policies.

## Performance

- **NFR-7** _(event-driven)_: When a user uploads project artifacts or media assets, the system shall process and store the files within a reasonable time frame to maintain responsiveness (target - confirm).
  - _Rationale:_ To provide a smooth user experience during artifact uploads.

## Scalability

- **NFR-12** _(ubiquitous)_: The system shall be designed to support multiple projects per user and scale to accommodate growing portfolios without degradation of performance.
  - _Rationale:_ To support developers building comprehensive professional portfolios.

## Security

- **NFR-1** _(unwanted-behaviour)_: If a user uploads project artifacts, then the system shall keep these artifacts private by default until explicitly made public by the user.
  - _Rationale:_ To protect sensitive enterprise information and comply with privacy requirements.
- **NFR-2** _(unwanted-behaviour)_: If a project is published, then the system shall require explicit user confirmation before making the project publicly accessible.
  - _Rationale:_ To prevent accidental exposure of sensitive or private project data.
- **NFR-3** _(ubiquitous)_: The system shall support privacy settings including public, private, unlisted, and anonymized project visibility modes.
  - _Rationale:_ To enable users to control the exposure level of their projects and protect confidential information.
- **NFR-4** _(ubiquitous)_: The system shall provide redaction guidance and warnings to users when sensitive client or company information is detected in project content or AI-generated text.
  - _Rationale:_ To help users avoid unintentional disclosure of confidential information.
- **NFR-5** _(ubiquitous)_: The system shall restrict access to user accounts and developer profiles to authenticated users except for public profiles and projects explicitly marked as public or unlisted.
  - _Rationale:_ To ensure that private user data and projects are not accessible without authorization.
- **NFR-10** _(unwanted-behaviour)_: If AI-generated content is uncertain or contains assumptions, then the system shall clearly mark such content and prompt the user for review or clarification.
  - _Rationale:_ To avoid misleading or inaccurate project representations.
- **NFR-11** _(ubiquitous)_: The system shall not automatically publish or share uploaded source artifacts without explicit user action.
  - _Rationale:_ To protect user privacy and control over sensitive project data.

## Usability

- **NFR-9** _(ubiquitous)_: The system shall allow users to edit AI-generated project case study content before publishing to ensure accuracy and user control.
  - _Rationale:_ To prevent misinformation and maintain user trust in AI assistance.