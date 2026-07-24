# Technical Specification

> Project API + data contracts (endpoints + data model).
> Written automatically by apex after human approval.

## Project Design

**Locked at:** 2026-07-23 17:38 UTC

**Stories:** #9431617, #9431618, #9431619, #9431620, #9431621, #9431622, #9431632, #9431636, #9431637, #9431638, #9431639, #9431640, #9431641, #9431642, #9431673, #9431675, #9431677, #9431678, #9431679, #9431680, #9431681, #9431682, #9431683, #9431694, #9431695, #9431696, #9431697, #9431698, #9431699, #9431700, #9431708, #9431709, #9431710, #9431711, #9431712, #9431713, #9431714, #9431715, #9431733, #9431734, #9431735, #9431736, #9431738, #9431739, #9431740, #9431763, #9431764, #9431765, #9431766, #9431767, #9431768, #9431769, #9431793, #9431794, #9431795, #9431796, #9431798, #9431799

### Endpoints

### Accounts And Developer Profiles
- **EP-1** `POST /api/v1/accounts/register` — register a new user account (Story 9431617) · auth:none · in:username:str,email:str,password:str · out:user_id:int,message:str · errors:400:invalid_input,409:username_taken,422:invalid_email,500:server_error
- **EP-2** `POST /api/v1/accounts/login` — authenticate user and return access token (Story 9431618) · auth:none · in:username:str,password:str · out:access_token:str,token_type:str,user_id:int · errors:400:invalid_input,401:invalid_credentials,404:user_not_found,500:server_error
- **EP-3** `GET /api/v1/users/me/profile` — get current logged-in user profile (Story 9431619, 9431632) · auth:bearer · out:name:str,bio:str,location:str,profile_image:str,linkedin_url:str,website_url:str,community_url:str,years_experience:int,certifications:list,visibility:str · errors:401:unauthorized,404:not_found,500:server_error
- **EP-4** `PUT /api/v1/users/me/profile` — update current logged-in user profile (Story 9431619, 9431632) · auth:bearer · in:name:str?,bio:str?,location:str?,profile_image:str?,linkedin_url:str?,website_url:str?,community_url:str?,years_experience:int?,certifications:list?,visibility:str? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,422:validation_error,500:server_error
- **EP-5** `PUT /api/v1/users/me/profile/visibility` — update profile visibility settings (Story 9431620) · auth:bearer · in:visibility:str,field_visibility:dict? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,500:server_error
- **EP-6** `GET /api/v1/users/{username}/public-profile` — get public profile of a developer by username (Story 9431621) · auth:none · out:name:str,bio:str,years_experience:int,certifications:list,public_links:dict,visibility:str,message:str? · errors:404:not_found,403:profile_private,500:server_error
- **EP-7** `POST /api/v1/accounts/logout` — logout current user (Story 9431622) · auth:bearer · out:success:bool,message:str · errors:401:unauthorized,500:server_error

### OutSystems Project Portfolio Management
- **EP-8** `GET /api/v1/projects` — list projects for authenticated user with optional filters (Story 9431636, 9431638, 9431641) · auth:bearer · in:status:str?,visibility:str? · out:projects:list[{id:int,title:str,status:str,visibility:str,published_date:str}] · errors:401:unauthorized,500:server_error
- **EP-9** `POST /api/v1/projects` — create a new project draft (Story 9431636) · auth:bearer · in:title:str,role:str,project_type:str?,outsystems_version:str?,environment_type:str? · out:project_id:int,message:str · errors:400:invalid_input,401:unauthorized,422:validation_error,500:server_error
- **EP-10** `GET /api/v1/projects/{project_id}` — get project details for editing (Story 9431637) · auth:bearer · out:project_id:int,title:str,summary:str,tags:list,status:str,visibility:str,start_date:str,end_date:str,role:str,anonymized:bool · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-11** `PUT /api/v1/projects/{project_id}` — update project metadata and dates (Story 9431637) · auth:bearer · in:title:str?,summary:str?,tags:list?,start_date:str?,end_date:str?,role:str?,project_type:str?,outsystems_version:str?,environment_type:str? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-12** `PUT /api/v1/projects/{project_id}/visibility-status` — update project visibility and status (Story 9431638) · auth:bearer · in:visibility:str,status:str · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-13** `POST /api/v1/projects/{project_id}/publish` — publish a draft project (Story 9431639) · auth:bearer · out:success:bool,message:str,public_url:str? · errors:400:invalid_input,401:unauthorized,403:forbidden,409:missing_required_info,404:not_found,500:server_error
- **EP-14** `POST /api/v1/projects/{project_id}/unpublish` — unpublish a published project (Story 9431640) · auth:bearer · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,409:not_published,404:not_found,500:server_error
- **EP-15** `POST /api/v1/projects/{project_id}/archive` — archive an active project (Story 9431641) · auth:bearer · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,409:already_archived,404:not_found,500:server_error
- **EP-16** `DELETE /api/v1/projects/{project_id}` — delete a project with confirmation (Story 9431642) · auth:bearer · out:success:bool,message:str · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error

### Project Content And Case Study Builder
- **EP-17** `GET /api/v1/projects/{project_id}/sections` — list all project sections (Story 9431673) · auth:bearer · out:sections:list[{id:int,section_type:str,title:str,order:int}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-18** `POST /api/v1/projects/{project_id}/sections` — add a new project section (Story 9431673) · auth:bearer · in:section_type:str · out:section_id:int,title:str,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,409:duplicate_section,404:not_found,500:server_error
- **EP-19** `GET /api/v1/projects/{project_id}/sections/{section_id}` — get content of a project section (Story 9431675) · auth:bearer · out:section_id:int,section_type:str,title:str,body:str · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-20** `PUT /api/v1/projects/{project_id}/sections/{section_id}` — update content of a project section (Story 9431675) · auth:bearer · in:title:str?,body:str? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,422:validation_error,500:server_error
- **EP-21** `POST /api/v1/projects/{project_id}/main-features` — add a main feature (Story 9431677) · auth:bearer · in:title:str,description:str? · out:feature_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-22** `PUT /api/v1/projects/{project_id}/main-features/{feature_id}` — update a main feature (Story 9431677) · auth:bearer · in:title:str?,description:str? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,422:validation_error,500:server_error
- **EP-23** `POST /api/v1/projects/{project_id}/screens-workflows` — add a screen or workflow (Story 9431678) · auth:bearer · in:type:str,name:str,description:str?,module_id:int? · out:item_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-24** `PUT /api/v1/projects/{project_id}/screens-workflows/{item_id}` — update a screen or workflow (Story 9431678) · auth:bearer · in:name:str?,description:str?,module_id:int? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,422:validation_error,500:server_error
- **EP-25** `POST /api/v1/projects/{project_id}/modules` — add a module with notes (Story 9431679) · auth:bearer · in:name:str,notes:str? · out:module_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-26** `PUT /api/v1/projects/{project_id}/modules/{module_id}` — update a module (Story 9431679) · auth:bearer · in:name:str?,notes:str? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,422:validation_error,500:server_error
- **EP-27** `PUT /api/v1/projects/{project_id}/data-model-summary` — update data model summary (Story 9431680) · auth:bearer · in:summary:str · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-28** `POST /api/v1/projects/{project_id}/integrations` — add an integration (Story 9431681) · auth:bearer · in:name:str,description:str? · out:integration_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-29** `PUT /api/v1/projects/{project_id}/integrations/{integration_id}` — update an integration (Story 9431681) · auth:bearer · in:name:str?,description:str? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,422:validation_error,500:server_error
- **EP-30** `PUT /api/v1/projects/{project_id}/technical-challenges` — update technical challenges section (Story 9431682) · auth:bearer · in:content:str · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-31** `PUT /api/v1/projects/{project_id}/business-impact` — update business impact section (Story 9431682) · auth:bearer · in:content:str · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-32** `PUT /api/v1/projects/{project_id}/sections/reorder` — reorder project sections (Story 9431683) · auth:bearer · in:ordered_section_ids:list[int] · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,500:server_error

### Artifact And Media Uploads
- **EP-33** `POST /api/v1/projects/{project_id}/artifacts` — upload a project artifact file (Story 9431694, 9431700) · auth:bearer · in:file:binary · out:artifact_id:int,file_name:str,file_type:str,visibility:str,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,415:unsupported_media_type,413:file_too_large,500:server_error
- **EP-34** `POST /api/v1/projects/{project_id}/media` — upload screenshots or diagrams (Story 9431695) · auth:bearer · in:file:binary · out:media_id:int,media_type:str,url:str,visibility:str,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,415:unsupported_media_type,413:file_too_large,500:server_error
- **EP-35** `POST /api/v1/projects/{project_id}/media/demo-videos` — add a demo video link (Story 9431696) · auth:bearer · in:url:str · out:media_id:int,url:str,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:invalid_url,500:server_error
- **EP-36** `PUT /api/v1/projects/{project_id}/artifacts/{artifact_id}/visibility` — set artifact visibility (Story 9431697, 9431765) · auth:bearer · in:visibility:str,confirm_warning:bool? · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,409:confirmation_required,500:server_error
- **EP-37** `GET /api/v1/projects/{project_id}/artifacts/{artifact_id}/download` — download private artifact (Story 9431698) · auth:bearer · out:file:binary · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-38** `GET /api/v1/projects/{project_id}/media/public` — get public media gallery items (Story 9431699) · auth:none · out:media:list[{media_id:int,media_type:str,url:str,caption:str}] · errors:404:not_found,500:server_error

### OutSystems-Specific Project Model
- **EP-39** `GET /api/v1/projects/{project_id}/modules` — list modules (Story 9431708) · auth:bearer · out:modules:list[{id:int,name:str,notes:str}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-40** `POST /api/v1/projects/{project_id}/modules` — add a module (Story 9431708) · auth:bearer · in:name:str,notes:str? · out:module_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-41** `GET /api/v1/projects/{project_id}/screens` — list screens (Story 9431709) · auth:bearer · out:screens:list[{id:int,name:str,description:str,module_id:int?}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-42** `POST /api/v1/projects/{project_id}/screens` — add a screen (Story 9431709) · auth:bearer · in:name:str,description:str?,module_id:int? · out:screen_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,409:duplicate_name,500:server_error
- **EP-43** `GET /api/v1/projects/{project_id}/entities` — list entities (Story 9431710) · auth:bearer · out:entities:list[{id:int,name:str,attributes:list}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-44** `POST /api/v1/projects/{project_id}/entities` — add an entity with attributes (Story 9431710) · auth:bearer · in:name:str,attributes:list[{name:str,type:str}] · out:entity_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-45** `GET /api/v1/projects/{project_id}/roles` — list roles (Story 9431711) · auth:bearer · out:roles:list[{id:int,name:str,permissions:list}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-46** `POST /api/v1/projects/{project_id}/roles` — add a role with permissions (Story 9431711) · auth:bearer · in:name:str,permissions:list[str] · out:role_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-47** `GET /api/v1/projects/{project_id}/integrations` — list integrations (Story 9431712) · auth:bearer · out:integrations:list[{id:int,name:str,type:str,endpoint:str,description:str}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-48** `POST /api/v1/projects/{project_id}/integrations` — add an integration (Story 9431712) · auth:bearer · in:name:str,type:str,endpoint:str,description:str? · out:integration_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-49** `GET /api/v1/projects/{project_id}/timers` — list timers/background jobs (Story 9431713) · auth:bearer · out:timers:list[{id:int,name:str,schedule:str,description:str}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-50** `POST /api/v1/projects/{project_id}/timers` — add a timer (Story 9431713) · auth:bearer · in:name:str,schedule:str,description:str? · out:timer_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-51** `GET /api/v1/projects/{project_id}/dependencies` — list Forge component dependencies (Story 9431714) · auth:bearer · out:dependencies:list[{id:int,name:str,version:str,description:str}] · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-52** `POST /api/v1/projects/{project_id}/dependencies` — add a Forge component dependency (Story 9431714) · auth:bearer · in:name:str,version:str,description:str? · out:dependency_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,422:validation_error,500:server_error
- **EP-53** `GET /api/v1/projects/{project_id}/technical-summary` — get public technical summary of project (Story 9431715) · auth:none · out:modules:list,screens:list,entities:list,roles:list,integrations:list,timers:list,dependencies:list,message:str? · errors:404:not_found,403:not_published,500:server_error

### AI-Assisted Case Study Generation
- **EP-54** `POST /api/v1/projects/{project_id}/ai/generate-draft` — trigger AI draft case study generation (Story 9431733) · auth:bearer · out:draft_id:int,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,500:server_error
- **EP-55** `GET /api/v1/projects/{project_id}/ai/draft/{draft_id}` — get AI-generated draft for review (Story 9431734) · auth:bearer · out:draft_content:str,message:str · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-56** `PUT /api/v1/projects/{project_id}/ai/draft/{draft_id}` — save edits to AI-generated draft (Story 9431734) · auth:bearer · in:draft_content:str · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-57** `GET /api/v1/projects/{project_id}/ai/draft/{draft_id}/assumptions` — get AI assumptions and flags (Story 9431735) · auth:bearer · out:assumptions:list,message:str · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-58** `POST /api/v1/projects/{project_id}/ai/regenerate-section` — regenerate single project section with AI (Story 9431736) · auth:bearer · in:section_type:str · out:updated_content:str,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,409:missing_input,500:server_error
- **EP-59** `POST /api/v1/projects/{project_id}/ai/rewrite-for-recruiter` — rewrite section for recruiter audience (Story 9431738) · auth:bearer · in:section_type:str · out:rewritten_text:str,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,409:no_content,500:server_error
- **EP-60** `POST /api/v1/projects/{project_id}/ai/rewrite-for-technical` — rewrite section for technical audience (Story 9431739) · auth:bearer · in:section_type:str · out:rewritten_text:str,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,409:no_content,500:server_error
- **EP-61** `GET /api/v1/projects/{project_id}/ai/missing-info-suggestions` — get AI suggestions for missing project info (Story 9431740) · auth:bearer · out:suggestions:list,message:str · errors:401:unauthorized,403:forbidden,500:server_error

### Privacy, Redaction, And Publishing Safety
- **EP-62** `PUT /api/v1/projects/{project_id}/visibility` — set project visibility (Story 9431763) · auth:bearer · in:visibility:str · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-63** `PUT /api/v1/projects/{project_id}/anonymization` — enable or disable project anonymization (Story 9431764) · auth:bearer · in:anonymized:bool · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-64** `PUT /api/v1/projects/{project_id}/redaction-notes` — add or edit redaction notes (Story 9431768) · auth:bearer · in:notes:str · out:success:bool,message:str · errors:400:invalid_input,401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-65** `GET /api/v1/projects/{project_id}/sensitive-terms` — get detected sensitive terms in project (Story 9431767) · auth:bearer · out:terms:list,message:str · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error
- **EP-66** `GET /api/v1/projects/{project_id}/preview` — preview public project with privacy applied (Story 9431769) · auth:bearer · out:preview_content:str,message:str · errors:401:unauthorized,403:forbidden,404:not_found,500:server_error

### Public Project And Portfolio Browsing
- **EP-67** `GET /api/v1/public/projects/{slug}` — view published public project page (Story 9431793) · auth:none · out:title:str,summary:str,main_features:list,screenshots:list,architecture_notes:str,role:str,personal_contribution:str,anonymized:bool,message:str? · errors:404:not_found,403:not_public,500:server_error
- **EP-68** `GET /api/v1/public/developers/{username}/portfolio` — view public developer portfolio with projects (Story 9431794) · auth:none · out:developer_info:dict,projects:list,message:str? · errors:404:not_found,403:profile_private,500:server_error
- **EP-69** `GET /api/v1/public/projects/tags/{tag}` — browse public projects by tag (Story 9431795) · auth:none · out:projects:list,message:str? · errors:404:not_found,500:server_error
- **EP-70** `GET /api/v1/public/projects/search` — search public projects by keywords (Story 9431796) · auth:none · in:keywords:str · out:projects:list,message:str? · errors:400:invalid_input,500:server_error
- **EP-71** `GET /api/v1/public/projects/filter` — filter public projects by OutSystems concept (Story 9431798) · auth:none · in:concept:str · out:projects:list,message:str? · errors:400:invalid_input,500:server_error
- **EP-72** `POST /api/v1/public/projects/{slug}/share-url` — copy/share public project URL (Story 9431799) · auth:none · out:url:str,message:str,warning:str? · errors:404:not_found,403:not_public,500:server_error

### Assumptions
- {EP-1}: auth:none because registration is for visitors; username, email, password are strings; 409 for username taken; 422 for invalid email format.
- {EP-2}: auth:none for login; returns access token; 401 for invalid credentials; 404 for user not found.
- {EP-3}: auth:bearer for profile access; returns user profile fields including certifications and experience.
- {EP-4}: auth:bearer for profile update; partial updates allowed; validation errors possible.
- {EP-5}: auth:bearer; visibility is string enum; field_visibility is optional dict for partial visibility.
- {EP-6}: auth:none; returns public profile fields; 403 if profile private.
- {EP-7}: auth:bearer; logout invalidates session/token.
- {EP-8}: auth:bearer; filters optional; returns project list with minimal info.
- {EP-9}: auth:bearer; required fields title and role; returns new project id.
- {EP-10}: auth:bearer; returns full project metadata.
- {EP-11}: auth:bearer; partial update allowed.
- {EP-12}: auth:bearer; visibility and status enums validated.
- {EP-13}: auth:bearer; publishing requires confirmation; 409 if missing info.
- {EP-14}: auth:bearer; unpublish only if published; 409 if not published.
- {EP-15}: auth:bearer; archive only if active; 409 if already archived.
- {EP-16}: auth:bearer; deletion requires confirmation.
- {EP-17}: auth:bearer; returns list of sections with order.
- {EP-18}: auth:bearer; prevents duplicate section types.
- {EP-19}: auth:bearer; returns section content.
- {EP-20}: auth:bearer; validates non-empty required fields.
- {EP-21}: auth:bearer; main feature requires title.
- {EP-22}: auth:bearer; update main feature.
- {EP-23}: auth:bearer; type is "screen" or "workflow".
- {EP-24}: auth:bearer; update screen/workflow.
- {EP-25}: auth:bearer; module requires name.
- {EP-26}: auth:bearer; update module.
- {EP-27}: auth:bearer; data model summary required non-empty.
- {EP-28}: auth:bearer; integration requires name.
- {EP-29}: auth:bearer; update integration.
- {EP-30}: auth:bearer; technical challenges required non-empty.
- {EP-31}: auth:bearer; business impact required non-empty.
- {EP-32}: auth:bearer; reorder sections by list of IDs.
- {EP-33}: auth:bearer; file upload with validation; private visibility default.
- {EP-34}: auth:bearer; image upload with validation; private visibility default.
- {EP-35}: auth:bearer; demo video URL validation.
- {EP-36}: auth:bearer; visibility change requires confirmation for source files.
- {EP-37}: auth:bearer; only project owner can download private artifacts.
- {EP-38}: auth:none; returns public media items.
- {EP-39}: auth:bearer; list modules.
- {EP-40}: auth:bearer; add module requires name.
- {EP-41}: auth:bearer; list screens.
- {EP-42}: auth:bearer; add screen; warns on duplicate names.
- {EP-43}: auth:bearer; list entities.
- {EP-44}: auth:bearer; add entity requires attributes.
- {EP-45}: auth:bearer; list roles.
- {EP-46}: auth:bearer; add role requires name.
- {EP-47}: auth:bearer; list integrations.
- {EP-48}: auth:bearer; add integration requires endpoint.
- {EP-49}: auth:bearer; list timers.
- {EP-50}: auth:bearer; add timer requires schedule.
- {EP-51}: auth:bearer; list dependencies.
- {EP-52}: auth:bearer; add dependency requires version.
- {EP-53}: auth:none; public technical summary; 403 if not published.
- {EP-54}: auth:bearer; trigger AI draft generation.
- {EP-55}: auth:bearer; get AI draft content.
- {EP-56}: auth:bearer; save AI draft edits.
- {EP-57}: auth:bearer; get AI assumptions.
- {EP-58}: auth:bearer; regenerate single section; 409 if missing input.
- {EP-59}: auth:bearer; rewrite for recruiter; 409 if no content.
- {EP-60}: auth:bearer; rewrite for technical audience; 409 if no content.
- {EP-61}: auth:bearer; get AI missing info suggestions.
- {EP-62}: auth:bearer; set project visibility.
- {EP-63}: auth:bearer; toggle anonymization.
- {EP-64}: auth:bearer; add/edit redaction notes.
- {EP-65}: auth:bearer; get sensitive terms detected.
- {EP-66}: auth:bearer; preview project with privacy applied.
- {EP-67}: auth:none; view public project page.
- {EP-68}: auth:none; view public developer portfolio.
- {EP-69}: auth:none; browse projects by tag.
- {EP-70}: auth:none; search projects by keywords.
- {EP-71}: auth:none; filter projects by OutSystems concept.
- {EP-72}: auth:none; share public project URL with warning if private.

### Data Model

## Data Model

### User [ENT-1]
- Fields: user_id: int, username: str, email: str, password_hash: str, name: str, bio: str, location: str, profile_image: str, linkedin_url: str, website_url: str, community_url: str, years_experience: int, certifications: list[str], visibility: str, field_visibility: dict
- Relations: has many Projects, has one DeveloperProfile
- Evolution: Optional fields (e.g. bio, location, profile_image, URLs) can be null; certifications stored as list; visibility is enum; field_visibility is optional JSON/dict for partial field visibility.

### Project [ENT-2]
- Fields: project_id: int, owner_id: int, title: str, slug: str, summary: str, project_type: str, outsystems_version: str, environment_type: str, role: str, visibility: str, anonymized: bool, start_date: date, end_date: date, tags: list[str], status: str, published_date: datetime
- Relations: belongs to User (owner), has many Artifacts, has many ProjectSections, has many MediaAssets, has many Modules, has many Screens, has many Entities, has many Roles, has many Integrations, has many Timers, has many Dependencies, has many MainFeatures, has many ScreensWorkflows, has many AI_CaseStudyDrafts
- Evolution: Optional fields (e.g. summary, project_type, dates) can be null; tags stored as list; visibility and status are enums; anonymized is boolean.

### Artifact [ENT-3]
- Fields: artifact_id: int, project_id: int, file_name: str, file_type: str, storage_path: str, visibility: str, extracted_metadata: dict, upload_date: datetime
- Relations: belongs to Project
- Evolution: extracted_metadata is optional JSON/dict; visibility is enum; file_type includes extensions like .oml, .oap, .pdf, .md, .zip, images.

### ProjectSection [ENT-4]
- Fields: section_id: int, project_id: int, section_type: str, title: str, body: str, order: int, visibility: str
- Relations: belongs to Project
- Evolution: section_type is enum of predefined section types; order is integer for sorting; visibility is enum.

### MediaAsset [ENT-5]
- Fields: media_id: int, project_id: int, media_type: str, url: str, caption: str, order: int, visibility: str
- Relations: belongs to Project
- Evolution: media_type enum includes screenshot, video_link, diagram; visibility is enum; order for display sequence.

### Module [ENT-6]
- Fields: module_id: int, project_id: int, name: str, notes: str
- Relations: belongs to Project, has many Screens
- Evolution: notes optional; name required.

### Screen [ENT-7]
- Fields: screen_id: int, project_id: int, name: str, description: str, module_id: int?
- Relations: belongs to Project, optionally belongs to Module
- Evolution: description optional; module_id nullable.

### Entity [ENT-8]
- Fields: entity_id: int, project_id: int, name: str, attributes: list[dict{name: str, type: str}]
- Relations: belongs to Project
- Evolution: attributes stored as list of name/type dicts; required at least one attribute.

### Role [ENT-9]
- Fields: role_id: int, project_id: int, name: str, permissions: list[str]
- Relations: belongs to Project
- Evolution: permissions stored as list of strings; name required.

### Integration [ENT-10]
- Fields: integration_id: int, project_id: int, name: str, type: str, endpoint: str, description: str
- Relations: belongs to Project
- Evolution: description optional; type enum includes REST, SOAP, etc.

### Timer [ENT-11]
- Fields: timer_id: int, project_id: int, name: str, schedule: str, description: str
- Relations: belongs to Project
- Evolution: description optional; schedule required string.

### Dependency [ENT-12]
- Fields: dependency_id: int, project_id: int, name: str, version: str, description: str
- Relations: belongs to Project
- Evolution: description optional; version required.

### AI_CaseStudyDraft [ENT-13]
- Fields: draft_id: int, project_id: int, source_inputs: dict, generated_overview: str, generated_sections: dict, warnings: list[str], assumptions: list[str], redaction_suggestions: list[str], created_date: datetime, draft_content: str
- Relations: belongs to Project
- Evolution: source_inputs and generated_sections stored as JSON/dict; draft_content editable text.

### MainFeature [ENT-14]
- Fields: feature_id: int, project_id: int, title: str, description: str
- Relations: belongs to Project
- Evolution: description optional; title required.

### ScreensWorkflowItem [ENT-15]
- Fields: item_id: int, project_id: int, type: str, name: str, description: str, module_id: int?
- Relations: belongs to Project, optionally belongs to Module
- Evolution: type enum ("screen" or "workflow"); description optional; module_id nullable.

### RedactionNote [ENT-16]
- Fields: note_id: int, project_id: int, notes: str, created_date: datetime, updated_date: datetime
- Relations: belongs to Project
- Evolution: notes required; timestamps for tracking edits.

## Assumptions

- {ENT-1}: password_hash stored securely; certifications stored as list of strings; field_visibility is optional dict mapping field names to visibility states.
- {ENT-2}: slug is unique string generated from title; tags stored as list of strings; published_date nullable until published.
- {ENT-3}: extracted_metadata stored as JSON/dict to hold parsed info; storage_path is string path or URL to file storage.
- {ENT-4}: section_type is enum of known section types (e.g. Overview, Problem, Solution, etc.); visibility enum matches project visibility options.
- {ENT-5}: url is string path or external link; media_type includes image, video link, diagram.
- {ENT-6}: notes field holds architecture notes; module name required.
- {ENT-7}: module_id nullable to allow unassociated screens.
- {ENT-8}: attributes list contains dicts with attribute name and type; at least one attribute required.
- {ENT-9}: permissions stored as list of strings representing access rights.
- {ENT-10}: type field indicates integration type (REST, SOAP, etc.); endpoint is URL string.
- {ENT-11}: schedule is string describing timer schedule (e.g. cron expression).
- {ENT-12}: version required; description optional.
- {ENT-13}: source_inputs and generated_sections stored as JSON/dict; draft_content is editable text version of the draft.
- {ENT-14}: description optional; title required.
- {ENT-15}: type is "screen" or "workflow"; description optional; module_id nullable.
- {ENT-16}: notes required; timestamps for creation and updates.