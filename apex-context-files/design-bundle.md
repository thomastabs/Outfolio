# Design Bundle

**Locked at:** 2026-07-23 17:38 UTC

## UX Brief

## Screens

### Accounts And Developer Profiles
- **Registration Screen** {SCR-1} [Story 9431617]: Visitor enters username, email, password. Actions: submit registration, receive confirmation, handle validation errors.
- **Login Screen** {SCR-2} [Story 9431618]: User enters username and password. Actions: submit login, receive error on failure, redirect to dashboard on success.
- **User Profile Screen** {SCR-3} [Story 9431619, 9431632]: Logged-in user views and edits profile fields including experience and certifications. Actions: save changes, validate inputs, control field visibility.
- **Profile Visibility Settings Screen** {SCR-4} [Story 9431620]: User sets profile visibility (public/private/partial). Actions: toggle visibility, save settings, confirm changes.
- **Public Profile Page** {SCR-5} [Story 9431621]: Visitor views developer's public profile with visible fields. Actions: view profile details, handle private profile message.
- **Logout Action** {SCR-6} [Story 9431622]: Logged-in user initiates logout. Actions: sign out, redirect to homepage.

### OutSystems Project Portfolio Management
- **Project List / Dashboard Screen** {SCR-7} [Story 9431636, 9431638, 9431641]: Developer views projects with statuses and visibility. Actions: create new project, select project, filter by status.
- **Project Creation Screen** {SCR-8} [Story 9431636]: Developer inputs required fields for new project draft. Actions: save draft, validate required fields.
- **Project Details Editing Screen** {SCR-9} [Story 9431637]: Developer edits project metadata and dates. Actions: save changes, handle access errors.
- **Project Visibility and Status Settings Screen** {SCR-10} [Story 9431638, 9431763]: Developer sets project visibility (public/private/unlisted) and status (draft/published/archived). Actions: save settings, validate inputs.
- **Project Publishing Confirmation Screen** {SCR-11} [Story 9431639, 9431766]: Developer reviews publishing checklist including privacy and redaction notes. Actions: confirm checklist, publish project, block publishing if unchecked.
- **Project Unpublishing Confirmation Screen** {SCR-12} [Story 9431640]: Developer unpublishes a published project. Actions: confirm unpublish, show message if project not public.
- **Project Archiving Screen** {SCR-13} [Story 9431641]: Developer archives active project. Actions: archive project, notify if already archived.
- **Project Deletion Confirmation Screen** {SCR-14} [Story 9431642]: Developer deletes a project with confirmation. Actions: confirm deletion, handle errors.

### Project Content And Case Study Builder
- **Project Editor Main Screen** {SCR-15} [Story 9431673]: Developer manages project sections. Actions: add section, prevent duplicates, reorder sections.
- **Project Section Edit Screen** {SCR-16} [Story 9431675]: Developer edits core sections like problem, solution, role. Actions: save content, validate non-empty required fields.
- **Main Features Management Screen** {SCR-17} [Story 9431677]: Developer adds and edits main features. Actions: add feature, save, validate title presence.
- **Screens and Workflows Management Screen** {SCR-18} [Story 9431678]: Developer adds screens and workflows with names and descriptions. Actions: add screen/workflow, save, validate name.
- **Architecture Modules Management Screen** {SCR-19} [Story 9431679]: Developer adds modules with notes. Actions: add module, save, validate name.
- **Data Model Summary Screen** {SCR-20} [Story 9431680]: Developer writes and edits data model summaries. Actions: save summary, validate non-empty content.
- **Integrations Management Screen** {SCR-21} [Story 9431681]: Developer adds integrations with name and description. Actions: add integration, save, validate name.
- **Technical Challenges and Business Impact Screen** {SCR-22} [Story 9431682]: Developer edits technical challenges and business impact sections. Actions: save content, validate non-empty.
- **Project Section Reordering Controls** {SCR-23} [Story 9431683]: Developer reorders sections by drag or controls. Actions: reorder up/down, handle single section case.

### Artifact And Media Uploads
- **Artifact Upload Screen** {SCR-24} [Story 9431694, 9431700]: Developer uploads supported artifact files. Actions: upload file, validate type and size, show errors.
- **Media Upload Screen** {SCR-25} [Story 9431695]: Developer uploads screenshots and diagrams. Actions: upload images, validate formats, show gallery.
- **Demo Video Link Screen** {SCR-26} [Story 9431696]: Developer adds demo video URLs. Actions: add link, validate URL, show errors.
- **Artifact Visibility Settings Screen** {SCR-27} [Story 9431697, 9431765]: Developer sets artifact visibility (public/private). Actions: change visibility, confirm warnings for source files.
- **Private Artifact Download Screen** {SCR-28} [Story 9431698]: Project owner downloads private artifacts. Actions: download file, deny access for non-owners.
- **Public Media Gallery Screen** {SCR-29} [Story 9431699]: Visitor views public media gallery on project page. Actions: view images/videos, show no media message.

### OutSystems-Specific Project Model
- **Modules Inventory Screen** {SCR-30} [Story 9431708]: Developer views and adds modules. Actions: add module, save, show empty message.
- **Screens Inventory Screen** {SCR-31} [Story 9431709]: Developer manages screens, associates modules. Actions: add screen, save, warn on duplicates.
- **Entities and Data Model Screen** {SCR-32} [Story 9431710]: Developer adds entities with attributes. Actions: add entity, save, validate attributes, show empty message.
- **Roles and Permissions Screen** {SCR-33} [Story 9431711]: Developer adds roles with permissions. Actions: add role, save, validate name, show empty message.
- **Integrations Screen** {SCR-34} [Story 9431712]: Developer adds REST/SOAP integrations. Actions: add integration, save, validate endpoint, show empty message.
- **Timers and Background Jobs Screen** {SCR-35} [Story 9431713]: Developer adds timers with schedules. Actions: add timer, save, validate schedule, show empty message.
- **Forge Component Dependencies Screen** {SCR-36} [Story 9431714]: Developer adds Forge dependencies. Actions: add dependency, save, validate version, show empty message.
- **Public Project Technical Summary Screen** {SCR-37} [Story 9431715]: Visitor views technical summary with OutSystems concepts. Actions: view sections, show no data messages, handle unpublished project message.

### AI-Assisted Case Study Generation
- **AI Case Study Generation Screen** {SCR-38} [Story 9431733]: Developer triggers AI draft generation. Actions: generate draft, show placeholders, ignore unsupported files.
- **AI Draft Review and Edit Screen** {SCR-39} [Story 9431734]: Developer reviews and edits AI-generated draft. Actions: edit text, save changes, handle privacy edits.
- **AI Assumptions Display Panel** {SCR-40} [Story 9431735]: Developer views AI assumptions and flags. Actions: highlight assumptions, confirm no assumptions.
- **Single Section AI Regeneration Screen** {SCR-41} [Story 9431736]: Developer regenerates one project section. Actions: request regeneration, replace content, notify on missing input.
- **AI Rewrite For Recruiter Screen** {SCR-42} [Story 9431738]: Developer requests recruiter-friendly rewrite. Actions: request rewrite, show simplified text, handle empty content.
- **AI Rewrite For Technical Audience Screen** {SCR-43} [Story 9431739]: Developer requests technical rewrite. Actions: request rewrite, show detailed text, handle empty content.
- **AI Missing Information Suggestions Screen** {SCR-44} [Story 9431740]: Developer requests AI suggestions for missing info. Actions: analyze project, list missing sections, confirm completeness.

### Privacy, Redaction, And Publishing Safety
- **Project Privacy Settings Screen** {SCR-45} [Story 9431763]: Developer sets project visibility (public/private/unlisted). Actions: select visibility, save settings.
- **Project Anonymization Screen** {SCR-46} [Story 9431764]: Developer enables anonymization. Actions: toggle anonymization, save changes.
- **Redaction Notes Management Screen** {SCR-47} [Story 9431768]: Developer adds or edits redaction notes. Actions: add notes, save changes.
- **Sensitive Term Detection Panel** {SCR-48} [Story 9431767]: Developer views detected sensitive terms. Actions: highlight terms, confirm no sensitive terms.
- **Public Project Preview Screen** {SCR-49} [Story 9431769]: Developer previews public project with privacy applied. Actions: preview anonymized content, hide private artifacts.

### Public Project And Portfolio Browsing
- **Public Project Page Screen** {SCR-50} [Story 9431793]: Visitor views published project details and media. Actions: view project info, handle anonymization, show unavailable message.
- **Public Developer Portfolio Screen** {SCR-51} [Story 9431794]: Visitor views developer's public portfolio with projects. Actions: view project list, show no projects message, view profile details.
- **Project Tag Browsing Screen** {SCR-52} [Story 9431795]: Visitor browses projects by tag. Actions: select tag, view filtered projects, show no projects message.
- **Public Project Search Screen** {SCR-53} [Story 9431796]: Visitor searches projects by keywords. Actions: enter keywords, view results, show no results message.
- **Public Project Filtering Screen** {SCR-54} [Story 9431798]: Visitor filters projects by OutSystems concept. Actions: select concept filter, view filtered projects, show no projects message.
- **Public Project URL Sharing Action** {SCR-55} [Story 9431799]: User copies project URL for sharing. Actions: copy URL, show warning if project private.

## Navigation Paths

- Registration Screen → Login Screen → User Profile Screen (Stories: 9431617, 9431618, 9431619)  
- Login Screen → Project List / Dashboard Screen → Project Creation Screen → Project Details Editing Screen → Project Publishing Confirmation Screen (Stories: 9431618, 9431636, 9431637, 9431639)  
- Project List / Dashboard Screen → Project Details Editing Screen → Project Content And Case Study Builder → AI Case Study Generation Screen → AI Draft Review and Edit Screen → Project Publishing Confirmation Screen (Stories: 9431637, 9431673, 9431733, 9431734, 9431639)  
- Public Developer Portfolio Screen → Public Project Page Screen → Public Media Gallery Screen (Stories: 9431794, 9431793, 9431699)  
- Project Details Editing Screen → Artifact Upload Screen → Artifact Visibility Settings Screen (Stories: 9431637, 9431694, 9431697)  
- Public Project Page Screen → Public Project URL Sharing Action (Stories: 9431793, 9431799)

## Assumptions

- {SCR-1}: Entry point for new visitors to create accounts; assumes form validation and error display inline.  
- {SCR-2}: Entry point for registered users to access their account; assumes redirect to dashboard on success.  
- {SCR-7}: Serves as main developer dashboard for project management; assumed to list projects with statuses and visibility filters.  
- {SCR-15}: Central editor screen for managing all project sections; assumed to support drag-and-drop and add/remove actions.  
- {SCR-27}: Changing artifact visibility for sensitive files requires explicit confirmation to prevent accidental exposure.  
- {SCR-55}: Sharing action copies URL to clipboard and warns if project is private; assumed triggered from public or private project pages.