# Functional Specification

> Per-story Gherkin Acceptance Criteria.
> Appended automatically by apex after human approval.

## Epic 363085: Accounts And Developer Profiles

**Clarifications:**
- Q: What specific fields in the user profile are considered mandatory for registration and profile updates?
  A: During registration, the mandatory fields are: email, username, password, display_name; During profile editing, the mandatory fields are: display_name, username. The following profile fields are optional: bio location profile_image linkedin_url personal_website_url outsystems_community_url years_of_outsystems_experience certifications availability_status. Email can be changed later, but changing it should require validation and should not be treated as a simple profile-text edit.
- Q: What exact error messages or validation feedback should be shown for invalid inputs such as username, email, and URLs?
  A: Use clear, field-level validation messages. Recommended messages: Invalid email: Enter a valid email address. Email already taken: An account with this email already exists. Missing email: Email is required. Missing username: Username is required. Invalid username: Use 3-30 characters: letters, numbers, underscores, or hyphens. Username already taken: This username is already taken. Missing password: Password is required. Weak password: Use at least 8 characters. Missing display name: Display name is required. Invalid LinkedIn URL: Enter a valid LinkedIn profile URL. Invalid personal website URL: Enter a valid website URL. Invalid OutSystems Community URL: Enter a valid OutSystems Community profile URL. Invalid years of experience: Enter a number between 0 and 50.  General fallback message: Something went wrong. Please try again.
- Q: How is 'partial visibility of profile fields' managed—are there predefined visibility options per field or a custom per-field toggle?
  A: Use predefined per-field visibility toggles. Each optional profile field that may reveal personal information should have a visibility setting: public private Fields with visibility controls: email location linkedin_url personal_website_url outsystems_community_url years_of_outsystems_experience certifications availability_status Always-public fields: display_name username bio profile_image Reasoning: this is simpler than custom visibility rules, easier to test in Apex, and clear enough for an MVP.
- Q: What happens if a user attempts to register with a username or email that is already taken—does the system check both, and what is the priority?
  A: The system should enforce uniqueness for both: email username During registration: Validate the submitted field formats first. Then check whether the email is already taken. Then check whether the username is already taken. If both are already taken, show both field-level messages: An account with this email already exists. This username is already taken. During profile editing: If the user changes their username to one already used by another account, show This username is already taken. If email change is supported in the profile flow, duplicate email should show An account with this email already exists.
- Q: After logout, is the user redirected to the homepage or the login screen, or is this configurable?
  A: After logout, redirect the user to the homepage. If the user tries to access a protected page after logout, redirect them to the login screen. So the rule is: Manual logout: homepage. Unauthorized protected-route access: login screen. This gives a nicer public-product feel while keeping protected workflows explicit.

### Story 9431617: User Registration Process

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:39 UTC

```gherkin
Feature: User Registration Process

  @SC-1
  Scenario: Successful registration with valid details
    Given the visitor is not registered
    And the visitor has a unique username, valid email, and password
    When the visitor submits the registration form with the unique username, valid email, and password
    Then the system creates a new account for the visitor
    And the visitor receives confirmation that the account is created and ready to use

  @SC-2
  Scenario: Registration with an already taken username
    Given the visitor is not registered
    And the visitor attempts to register with a username that is already in use
    When the visitor submits the registration form with the taken username
    Then the visitor receives an error message indicating this username is already taken
    And the visitor is prompted to choose a different username
  <!-- assumes: the system validates email uniqueness before username uniqueness but this scenario focuses on username taken case -->

  @SC-3
  Scenario: Registration with invalid email format
    Given the visitor is not registered
    And the visitor enters an incorrectly formatted email address
    When the visitor attempts to submit the registration form with the invalid email
    Then the visitor is shown a validation error indicating to enter a valid email address
    And the form submission is prevented until the email is corrected
```

### Story 9431618: User Login Process

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:39 UTC

```gherkin
Feature: User Login Process

  @SC-1
  Scenario: Successful login with correct credentials
    Given the user is registered with a username and password
    When the user submits the login form with the correct username and password
    Then the user is granted access to their account dashboard

  @SC-2
  Scenario: Login attempt with incorrect password
    Given the user is registered with a username and password
    When the user submits the login form with the correct username and an incorrect password
    Then the user receives an error message indicating invalid credentials

  @SC-3
  Scenario: Login attempt with unregistered username
    Given the username does not exist in the system
    When the user attempts to log in with the unregistered username
    Then the user is informed that the account cannot be found
```

### Story 9431619: User Profile Editing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:39 UTC

```gherkin
Feature: User Profile Editing

  @SC-1
  Scenario: Update profile with valid information
    Given the user is logged in
    And the user is viewing their profile page
    When the user edits profile fields including name, bio, OutSystems experience, certifications, and links with valid information
    And the user saves the profile changes
    Then the updated profile information is immediately reflected in the user's profile

  @SC-2
  Scenario: Attempt to save profile with missing required fields
    Given the user is logged in
    And the user is viewing their profile page
    When the user attempts to save the profile without filling mandatory fields such as display name or username
    Then the user receives validation errors prompting completion of the missing required fields

  @SC-3
  Scenario: Enter invalid URL in profile links
    Given the user is logged in
    And the user is viewing their profile page
    When the user inputs incorrectly formatted URLs for LinkedIn or personal website fields
    And the user attempts to save the profile
    Then the user is shown validation errors indicating to enter valid URLs
    And the profile changes are not saved until the URLs are corrected
```

### Story 9431620: Profile Visibility Control

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:39 UTC

```gherkin
Feature: Profile Visibility Control

  @SC-1
  Scenario: Set profile visibility to public
    Given the user is logged in
    And the user is viewing their profile settings
    When the user selects the public visibility option for their profile
    And the user saves the visibility setting
    Then the profile is publicly accessible to visitors
    And visitors can see the profile information on the public page

  @SC-2
  Scenario: Set profile visibility to private
    Given the user is logged in
    And the user is viewing their profile settings
    When the user selects the private visibility option for their profile
    And the user saves the visibility setting
    Then visitors attempting to access the public profile receive a message that the profile is not available

  @SC-3
  Scenario: Partial visibility of profile fields
    Given the user is logged in
    And the user is viewing their profile settings
    When the user marks certain profile fields as private or hidden using predefined visibility toggles
    And the user saves the visibility changes
    Then visitors see only the profile fields marked as public on the public profile page
  <!-- assumes: visibility toggles are predefined per field as public or private -->
```

### Story 9431621: Public Profile Viewing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:39 UTC

```gherkin
Feature: Public Profile Viewing

  @SC-1
  Scenario: View complete public profile
    Given the visitor is not logged in
    And the developer's profile visibility is set to public with all fields visible
    When the visitor opens the developer's public profile URL
    Then the visitor sees the developer's name, bio, OutSystems experience, certifications, and public links clearly and professionally

  @SC-2
  Scenario: View profile with limited visibility
    Given the visitor is not logged in
    And the developer's profile has some fields marked as private or hidden
    When the visitor accesses the developer's public profile
    Then the visitor sees only the information the developer has made public

  @SC-3
  Scenario: Attempt to view a private profile
    Given the visitor is not logged in
    And the developer's profile visibility is set to private
    When the visitor attempts to access the developer's public profile
    Then the visitor receives a message indicating the profile is not publicly available
```

### Story 9431622: User Logout Process

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:39 UTC

```gherkin
Feature: User Logout Process

  @SC-1
  Scenario: Successful logout
    Given the user is logged in
    When the user initiates logout
    Then the user is signed out
    And the user is redirected to the homepage
    And the user cannot access protected pages without logging in again
  <!-- assumes: after logout, unauthorized access to protected pages redirects to login screen -->
```

### Story 9431632: OutSystems Experience And Certifications

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:43 UTC

```gherkin
Feature: OutSystems Experience And Certifications

  @SC-1
  Scenario: Add years of OutSystems experience within valid range
    Given the user is editing their profile
    And the user has access to the years of OutSystems experience field
    When the user enters a number between 0 and 50 for years of OutSystems experience
    And the user saves the profile changes
    Then the system accepts the input
    And the years of OutSystems experience is saved in the user profile

  @SC-2
  Scenario: Add certifications with visibility control
    Given the user is editing their profile
    And the user has access to the certifications field and its visibility setting
    When the user adds certification details
    And the user sets the certifications visibility to public or private
    And the user saves the profile changes
    Then the system saves the certification details
    And the system applies the selected visibility setting to the certifications information

  @SC-3
  Scenario: Reject invalid years of experience input
    Given the user is editing their profile
    And the user has access to the years of OutSystems experience field
    When the user enters a number outside the range 0 to 50 for years of OutSystems experience
    And the user attempts to save the profile changes
    Then the system shows a validation error message indicating the years of experience must be between 0 and 50
    And the invalid input is not saved in the user profile
```

## Epic 363086: OutSystems Project Portfolio Management

### Story 9431636: Project Draft Creation

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:46 UTC

```gherkin
Feature: Project Draft Creation

  @SC-1
  Scenario: Create a new project draft successfully
    Given the developer is authenticated and on the new project creation page
    When the developer provides all required fields including title and role
    And the developer saves the project as a draft
    Then the project is listed as a draft in the developer's dashboard

  @SC-2
  Scenario: Attempt to create a project without required fields
    Given the developer is authenticated and on the new project creation page
    When the developer attempts to save a new project without filling mandatory fields
    Then validation errors are shown preventing project creation
```

### Story 9431637: Project Details Editing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:46 UTC

```gherkin
Feature: Project Details Editing

  @SC-1
  Scenario: Edit project metadata successfully
    Given the developer is authenticated and has access to an existing project
    When the developer updates project fields such as summary, tags, or dates
    And the developer saves the changes
    Then the updated project information is reflected in the project details

  @SC-2
  Scenario: Attempt to edit a project that does not exist or is inaccessible
    Given the developer is authenticated
    When the developer attempts to access a project that has been deleted or belongs to another user
    Then an error or access denied message is shown
```

### Story 9431638: Project Status and Visibility Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:46 UTC

```gherkin
Feature: Project Status and Visibility Management

  @SC-1
  Scenario: Change project visibility and status
    Given the developer is authenticated and has access to a project
    When the developer updates the project's visibility setting to public, private, or unlisted
    And the developer changes the project's status to draft, published, or archived
    Then the project reflects the updated visibility and status settings

  @SC-2
  Scenario: Attempt to set invalid visibility or status values
    Given the developer is authenticated and has access to a project
    When the developer attempts to set the project's visibility or status to an unsupported value
    Then an error is shown preventing the change
```

### Story 9431639: Project Publishing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:46 UTC

```gherkin
Feature: Project Publishing

  @SC-1
  Scenario: Publish a draft project successfully
    Given the developer is authenticated and has a project in draft status
    When the developer selects the draft project to publish
    And the developer confirms any warnings about sensitive information
    Then the project becomes publicly visible
    And the project has a shareable URL

  @SC-2
  Scenario: Attempt to publish a project missing required public information
    Given the developer is authenticated and has a project in draft status missing mandatory public metadata or sections
    When the developer attempts to publish the project
    Then a prompt is shown to complete the missing information before publishing
```

### Story 9431640: Project Unpublishing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:46 UTC

```gherkin
Feature: Project Unpublishing

  @SC-1
  Scenario: Unpublish a published project successfully
    Given the developer is authenticated and has a published project
    When the developer selects the published project to unpublish
    Then the project is removed from public view
    And the project remains in the developer's dashboard as a draft or private project

  @SC-2
  Scenario: Attempt to unpublish a project that is already unpublished or draft
    Given the developer is authenticated and has a project that is not currently published
    When the developer attempts to unpublish the project
    Then a message is shown indicating the project is not public
```

### Story 9431641: Project Archiving

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:46 UTC

```gherkin
Feature: Project Archiving

  @SC-1
  Scenario: Archive an active project
    Given the developer is authenticated and has an active project
    When the developer marks the project as archived
    Then the project no longer appears in active project lists
    And the project remains accessible in an archive section

  @SC-2
  Scenario: Attempt to archive a project that is already archived
    Given the developer is authenticated and has a project that is already archived
    When the developer attempts to archive the project again
    Then a notification is shown that no action is needed
```

### Story 9431642: Project Deletion

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 16:46 UTC

```gherkin
Feature: Project Deletion

  @SC-1
  Scenario: Delete a project with confirmation
    Given the developer is authenticated and has a project to delete
    When the developer selects the project to delete
    And the developer confirms the deletion
    Then the project is permanently removed from the developer's account and public listings

  @SC-2
  Scenario: Attempt to delete a project that does not exist or belongs to another user
    Given the developer is authenticated
    When the developer attempts to delete a project that is not theirs or has already been deleted
    Then an error message is shown
```

## Epic 363088: Project Content And Case Study Builder

### Story 9431673: Project Section Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Project Section Management

  @SC-1
  Scenario: Add a new project section
    Given the developer is editing a project in the project editor
    And the project does not yet contain the selected section type
    When the developer adds a new section
    And the developer selects a section type from the available list
    Then the new section appears in the project
    And the new section has a default title
    And the new section has empty content

  @SC-2
  Scenario: Attempt to add a duplicate section type
    Given the developer is editing a project in the project editor
    And the project already contains a section of the selected type
    When the developer attempts to add another section of the same type
    Then the developer receives a warning that duplicate sections are not allowed
    And the duplicate section is not added to the project
  <!-- assumes: assumed the system prevents adding duplicates or shows a warning as per draft -->

  @SC-3
  Scenario: Add multiple different section types
    Given the developer is editing a project in the project editor
    When the developer adds several different section types one after another
    Then all added sections appear listed in the project editor
```

### Story 9431675: Editing Core Project Sections

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Editing Core Project Sections

  @SC-1
  Scenario: Edit problem section successfully
    Given the developer is editing the problem section of a project
    When the developer enters descriptive text explaining the business problem
    And the developer saves the problem section
    Then the updated problem content is displayed in the project

  @SC-2
  Scenario: Edit solution section successfully
    Given the developer is editing the solution section of a project
    When the developer enters a clear explanation of how the project solves the problem
    And the developer saves the solution section
    Then the updated solution content is displayed in the project

  @SC-3
  Scenario: Edit role section successfully
    Given the developer is editing the role section of a project
    When the developer describes their personal role and contributions
    And the developer saves the role section
    Then the updated role content is displayed in the project

  @SC-4
  Scenario: Attempt to save empty required section
    Given the developer is editing the problem section of a project
    When the developer attempts to save the problem section with empty content
    Then the developer receives a validation error prompting to enter text
```

### Story 9431677: Main Feature Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Main Feature Management

  @SC-1
  Scenario: Add a main feature with title and description
    Given the developer is editing the main features section of a project
    When the developer adds a new main feature
    And the developer enters a title and description
    And the developer saves the main feature
    Then the new main feature appears listed in the main features section

  @SC-2
  Scenario: Add multiple main features
    Given the developer is editing the main features section of a project
    When the developer adds several main features one by one
    Then all added main features appear listed in the order they were added

  @SC-3
  Scenario: Attempt to add a main feature without a title
    Given the developer is editing the main features section of a project
    When the developer attempts to save a main feature without entering a title
    Then the developer receives a validation error requiring a title
```

### Story 9431678: Screens and Workflows Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Screens and Workflows Management

  @SC-1
  Scenario: Add a screen with name and description
    Given the developer is editing the screens and workflows section of a project
    When the developer adds a new screen entry
    And the developer provides a name and description
    And the developer saves the screen
    Then the new screen appears listed in the screens and workflows section

  @SC-2
  Scenario: Add a workflow with name and description
    Given the developer is editing the screens and workflows section of a project
    When the developer adds a new workflow entry
    And the developer provides a name and description
    And the developer saves the workflow
    Then the new workflow appears listed in the screens and workflows section

  @SC-3
  Scenario: Attempt to add a screen without a name
    Given the developer is editing the screens and workflows section of a project
    When the developer attempts to save a screen without entering a name
    Then the developer receives an error prompting to enter a name
```

### Story 9431679: Module and Architecture Notes Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Module and Architecture Notes Management

  @SC-1
  Scenario: Add a module with name and description
    Given the developer is editing the architecture section of a project
    When the developer adds a new module entry
    And the developer enters a name and architecture notes
    And the developer saves the module
    Then the new module appears listed in the architecture section

  @SC-2
  Scenario: Add multiple modules
    Given the developer is editing the architecture section of a project
    When the developer adds several modules
    Then all added modules appear listed with their respective notes

  @SC-3
  Scenario: Attempt to add a module without a name
    Given the developer is editing the architecture section of a project
    When the developer attempts to save a module without entering a name
    Then the developer receives a validation error requiring a name
```

### Story 9431680: Data Model Summary Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Data Model Summary Management

  @SC-1
  Scenario: Add data model description
    Given the developer is editing the data model section of a project
    When the developer writes a summary of the data model including key entities and relationships
    And the developer saves the data model section
    Then the data model summary content appears in the data model section

  @SC-2
  Scenario: Edit existing data model summary
    Given the developer has an existing data model summary in the project
    When the developer updates the data model summary text
    And the developer saves the changes
    Then the updated data model summary content appears in the data model section

  @SC-3
  Scenario: Attempt to save empty data model summary
    Given the developer is editing the data model section of a project
    When the developer attempts to save the data model section with empty content
    Then the developer receives a prompt to enter a description
```

### Story 9431681: Integration Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Integration Management

  @SC-1
  Scenario: Add an integration with name and description
    Given the developer is editing the integrations section of a project
    When the developer adds a new integration entry
    And the developer provides a name and description
    And the developer saves the integration
    Then the new integration appears listed in the integrations section

  @SC-2
  Scenario: Add multiple integrations
    Given the developer is editing the integrations section of a project
    When the developer adds several integrations
    Then all added integrations appear listed with their descriptions

  @SC-3
  Scenario: Attempt to add an integration without a name
    Given the developer is editing the integrations section of a project
    When the developer attempts to save an integration without entering a name
    Then the developer receives a validation error requiring a name
```

### Story 9431682: Technical Challenges and Business Impact

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Technical Challenges and Business Impact

  @SC-1
  Scenario: Add technical challenges description
    Given the developer is editing the technical challenges section of a project
    When the developer writes about technical challenges encountered
    And the developer saves the technical challenges section
    Then the technical challenges content is displayed in the project

  @SC-2
  Scenario: Add business impact description
    Given the developer is editing the business impact section of a project
    When the developer describes the business impact of the project
    And the developer saves the business impact section
    Then the business impact content is displayed in the project

  @SC-3
  Scenario: Attempt to save empty technical challenges section
    Given the developer is editing the technical challenges section of a project
    When the developer attempts to save the technical challenges section with empty content
    Then the developer receives a validation prompt to enter content
```

### Story 9431683: Project Section Reordering

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:04 UTC

```gherkin
Feature: Project Section Reordering

  @SC-1
  Scenario: Reorder sections by dragging
    Given the developer is editing a project with multiple sections
    When the developer drags a project section to a new position in the list
    Then the order of project sections updates immediately

  @SC-2
  Scenario: Reorder sections using up/down controls
    Given the developer is editing a project with multiple sections
    When the developer moves a project section up or down using controls
    Then the order of project sections changes accordingly

  @SC-3
  Scenario: Attempt to reorder when only one section exists
    Given the developer is editing a project with only one section
    When the developer attempts to reorder sections
    Then no reordering occurs
    And no error is shown to the developer
```

## Epic 363089: Artifact And Media Uploads

### Story 9431694: Project Artifact Upload

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:06 UTC

```gherkin
Feature: Project Artifact Upload

  @SC-1
  Scenario: Upload a supported artifact file
    Given the developer is authenticated
    And the project is open for artifact uploads
    When the developer uploads a file with a supported extension such as .oml, .oap, .pdf, .md, or .zip
    Then the artifact appears in the project artifact list
    And the artifact has private visibility by default

  @SC-2
  Scenario: Attempt to upload an unsupported file type
    Given the developer is authenticated
    And the project is open for artifact uploads
    When the developer attempts to upload a file with an unsupported extension
    Then the developer receives an error message preventing the upload

  @SC-3
  Scenario: Upload an artifact exceeding size limit
    Given the developer is authenticated
    And the project is open for artifact uploads
    When the developer attempts to upload a file larger than the allowed size limit
    Then the developer receives a clear error message indicating the size limit
```

### Story 9431695: Screenshot and Diagram Upload

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:06 UTC

```gherkin
Feature: Screenshot and Diagram Upload

  @SC-1
  Scenario: Upload multiple screenshots and diagrams
    Given the developer is authenticated
    And the project is open for media uploads
    When the developer uploads multiple image files
    Then all uploaded images appear in the media gallery
    And all uploaded images have private visibility by default

  @SC-2
  Scenario: Upload an unsupported image format
    Given the developer is authenticated
    And the project is open for media uploads
    When the developer attempts to upload an image file in an unsupported format
    Then the developer receives an error message preventing the upload
```

### Story 9431696: Demo Video Link Attachment

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:06 UTC

```gherkin
Feature: Demo Video Link Attachment

  @SC-1
  Scenario: Add a valid demo video link
    Given the developer is authenticated
    And the project is open for media link attachments
    When the developer enters a valid URL from a supported video platform
    Then the video link is saved in the project media section
    And the video link is displayed in the project media section

  @SC-2
  Scenario: Add an invalid or unsupported video link
    Given the developer is authenticated
    And the project is open for media link attachments
    When the developer enters a URL not from a supported video platform
    Then the developer receives an error message preventing the link from being saved
```

### Story 9431697: Artifact Visibility Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:07 UTC

```gherkin
Feature: Artifact Visibility Management

  @SC-1
  Scenario: Set artifact visibility to public
    Given the developer is authenticated
    And the artifact exists with private visibility
    When the developer changes the artifact's visibility to public
    Then the artifact becomes visible on the public project page

  @SC-2
  Scenario: Attempt to make a source-like artifact public without confirmation
    Given the developer is authenticated
    And the artifact is a .oml or .oap file with private visibility
    When the developer attempts to change the artifact's visibility to public
    Then the developer is prompted with a warning about privacy risks
    And the developer confirms the warning before the visibility changes
  <!-- assumes: assumed confirmation is required before making source-like artifacts public -->

  @SC-3
  Scenario: Keep artifact private by default
    Given the developer is authenticated
    And the project is open for artifact uploads
    When the developer uploads an artifact
    Then the artifact is automatically set to private visibility
    And the artifact does not appear on the public project page until made public
```

### Story 9431698: Private Artifact Download

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:07 UTC

```gherkin
Feature: Private Artifact Download

  @SC-1
  Scenario: Download a private artifact successfully
    Given the user is the project owner
    And a private artifact exists in the project
    When the project owner selects the private artifact for download
    Then the private artifact is downloaded successfully

  @SC-2
  Scenario: Attempt to download an artifact as a non-owner
    Given the user is not the project owner
    And a private artifact exists in the project
    When the user attempts to download the private artifact
    Then the user is denied access to download the private artifact
```

### Story 9431699: Public Media Gallery Viewing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:07 UTC

```gherkin
Feature: Public Media Gallery Viewing

  @SC-1
  Scenario: View public media gallery with images and videos
    Given the visitor is viewing a public project page
    And there are media items marked as public in the project
    When the visitor opens the public project page
    Then all public media items are displayed in a gallery format

  @SC-2
  Scenario: View project with no public media
    Given the visitor is viewing a public project page
    And no media items are marked as public in the project
    When the visitor opens the public project page
    Then a message indicates that no media is available
```

### Story 9431700: File Type and Size Validation

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:07 UTC

```gherkin
Feature: File Type and Size Validation

  @SC-1
  Scenario: Upload a file within allowed types and size
    Given the developer is authenticated
    And the project is open for file uploads
    When the developer uploads a file that meets type and size requirements
    Then the upload succeeds

  @SC-2
  Scenario: Upload a file with unsupported type
    Given the developer is authenticated
    And the project is open for file uploads
    When the developer attempts to upload a file with an unsupported extension
    Then the developer is blocked with an error message

  @SC-3
  Scenario: Upload a file exceeding size limit
    Given the developer is authenticated
    And the project is open for file uploads
    When the developer attempts to upload a file larger than the maximum allowed size
    Then the developer receives a clear error message
```

## Epic 363090: OutSystems-Specific Project Model

### Story 9431708: OutSystems Module Inventory

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: OutSystems Module Inventory

  @SC-1
  Scenario: Add a new module successfully
    Given the developer has an open project
    And the developer is in the modules section
    When the developer enters module details including name and description
    And the developer saves the module
    Then the module appears in the inventory list

  @SC-2
  Scenario: Attempt to add a module with missing required fields
    Given the developer is adding a new module
    When the developer tries to save the module without entering a name
    Then an error prompts the developer to fill in the required fields

  @SC-3
  Scenario: View module inventory when no modules exist
    Given the developer has an open project with no modules added
    When the developer opens the modules section
    Then a message indicates that no modules have been added yet
```

### Story 9431709: Screen Inventory Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: Screen Inventory Management

  @SC-1
  Scenario: Add a new screen successfully
    Given the developer has an open project
    And the developer is in the screens section
    When the developer inputs screen name and description
    And the developer associates the screen with a module if applicable
    And the developer saves the screen
    Then the screen appears in the screen list

  @SC-2
  Scenario: Add a screen without associating a module
    Given the developer is adding a new screen
    When the developer adds a screen without selecting a module
    And the developer saves the screen
    Then the screen is saved as unassociated
    And the screen is visible in the inventory

  @SC-3
  Scenario: Attempt to add a screen with duplicate name
    Given the developer has an existing screen with a specific name in the project
    When the developer tries to add a new screen with the same name
    Then a warning about duplicate screen names is displayed
```

### Story 9431710: Entity and Data Model Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: Entity and Data Model Management

  @SC-1
  Scenario: Add a new entity with attributes
    Given the developer has an open project
    And the developer is in the data model section
    When the developer creates a new entity
    And the developer adds attributes including name and type
    And the developer saves the entity
    Then the entity appears in the data model list

  @SC-2
  Scenario: Attempt to add an entity without attributes
    Given the developer is adding a new entity
    When the developer tries to save the entity without any attributes
    Then a prompt requests the developer to add at least one attribute

  @SC-3
  Scenario: View data model when no entities exist
    Given the developer has an open project with no entities added
    When the developer opens the data model section
    Then a message indicates that no entities have been added yet
```

### Story 9431711: Role and Permission Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: Role and Permission Management

  @SC-1
  Scenario: Add a new role with permissions
    Given the developer has an open project
    And the developer is in the roles section
    When the developer adds a new role
    And the developer specifies permissions or access levels
    And the developer saves the role
    Then the role appears in the security section

  @SC-2
  Scenario: Attempt to add a role without a name
    Given the developer is adding a new role
    When the developer tries to save the role without entering a name
    Then an error message is displayed

  @SC-3
  Scenario: View roles list when empty
    Given the developer has an open project with no roles defined
    When the developer opens the roles section
    Then a message indicates that no roles have been defined yet
```

### Story 9431712: Integration Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: Integration Management

  @SC-1
  Scenario: Add a REST integration successfully
    Given the developer has an open project
    And the developer is in the integrations section
    When the developer enters integration details including name, type as REST, endpoint URL, and description
    And the developer saves the integration
    Then the integration appears in the integrations list

  @SC-2
  Scenario: Add a SOAP integration with missing endpoint
    Given the developer is adding a SOAP integration
    When the developer tries to save the integration without specifying the endpoint URL
    Then an error prompts the developer to fill in the endpoint URL

  @SC-3
  Scenario: View integrations list when empty
    Given the developer has an open project with no integrations added
    When the developer opens the integrations section
    Then a message indicates that no integrations have been added yet
```

### Story 9431713: Timer and Background Job Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: Timer and Background Job Management

  @SC-1
  Scenario: Add a timer with schedule details
    Given the developer has an open project
    And the developer is in the timers section
    When the developer creates a timer
    And the developer specifies the timer's name, schedule, and description
    And the developer saves the timer
    Then the timer appears in the timers list

  @SC-2
  Scenario: Attempt to add a timer without schedule
    Given the developer is adding a new timer
    When the developer tries to save the timer without specifying a schedule
    Then an error message is displayed

  @SC-3
  Scenario: View timers list when empty
    Given the developer has an open project with no timers or background jobs added
    When the developer opens the timers section
    Then a message indicates that no timers or background jobs have been added yet
```

### Story 9431714: Forge Component Dependency Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: Forge Component Dependency Management

  @SC-1
  Scenario: Add a Forge component dependency successfully
    Given the developer has an open project
    And the developer is in the dependencies section
    When the developer inputs the component name, version, and description
    And the developer saves the dependency
    Then the dependency appears in the dependencies list

  @SC-2
  Scenario: Attempt to add a dependency with missing version
    Given the developer is adding a new Forge component dependency
    When the developer tries to save the dependency without specifying the version
    Then a prompt requests the developer to provide the version

  @SC-3
  Scenario: View dependencies list when empty
    Given the developer has an open project with no Forge component dependencies added
    When the developer opens the dependencies section
    Then a message indicates that no Forge components have been added yet
```

### Story 9431715: Public Project Technical Summary

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:10 UTC

```gherkin
Feature: Public Project Technical Summary

  @SC-1
  Scenario: View technical summary with all sections populated
    Given the visitor is viewing a published public project page with all OutSystems concepts added
    When the visitor opens the public project page
    Then the summary lists modules, screens, entities, roles, integrations, timers, and dependencies clearly presented

  @SC-2
  Scenario: View technical summary with some sections empty
    Given the visitor is viewing a published public project page where some OutSystems concepts have not been added
    When the visitor opens the public project page
    Then sections with no data are marked as 'No data available' or hidden gracefully

  @SC-3
  Scenario: View technical summary on unpublished project
    Given the visitor attempts to access a project that is not published
    When the visitor opens the project page
    Then a message indicates that the project is not publicly available
```

## Epic 363091: AI-Assisted Case Study Generation

### Story 9431733: AI Draft Case Study Generation

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:14 UTC

```gherkin
Feature: AI Draft Case Study Generation

  @SC-1
  Scenario: Successful AI Draft Generation
    Given the developer has project metadata, manual sections, and uploaded artifacts available
    When the developer selects the option to generate a case study draft
    Then the system creates a draft using the provided project metadata, manual sections, and uploaded artifacts
    And the draft appears for the developer to review

  @SC-2
  Scenario: AI Draft Generation With Incomplete Data
    Given the developer has incomplete project sections or metadata
    When the developer attempts to generate a case study draft
    Then the system generates a draft including placeholders or notes indicating missing information

  @SC-3
  Scenario: AI Draft Generation With Unsupported Artifact Types
    Given the developer has uploaded unsupported artifact types along with supported data
    When the developer generates a case study draft
    Then the system ignores unsupported artifact files
    And the system generates the draft from available supported data without errors
```

### Story 9431734: AI-Generated Draft Review And Edit

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:14 UTC

```gherkin
Feature: AI-Generated Draft Review And Edit

  @SC-1
  Scenario: Successful Review And Edit
    Given the developer has an AI-generated draft available for review
    When the developer opens the AI-generated draft
    And the developer edits text sections to correct or improve content
    And the developer saves the changes
    Then the changes are saved successfully

  @SC-2
  Scenario: Attempt To Save Without Changes
    Given the developer has an AI-generated draft open for review
    When the developer makes no edits
    And the developer attempts to save the draft
    Then the system allows saving
    And the system indicates that no changes were made

  @SC-3
  Scenario: Editing With Privacy Concerns
    Given the developer has an AI-generated draft containing sensitive client information
    When the developer edits the draft to remove or redact sensitive client information
    And the developer saves the changes
    Then the draft is saved with privacy-compliant content
```

### Story 9431735: AI Assumptions Display

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:14 UTC

```gherkin
Feature: AI Assumptions Display

  @SC-1
  Scenario: Display AI Assumptions Clearly
    Given the developer has an AI-generated draft containing assumptions or uncertain statements
    When the developer views the draft
    Then the system highlights assumptions or uncertain statements flagged by the AI for review

  @SC-2
  Scenario: No Assumptions Present
    Given the developer has an AI-generated draft with no flagged assumptions
    When the developer views the draft
    Then the system confirms that all content is based on provided data
```

### Story 9431736: Single Project Section Regeneration

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:14 UTC

```gherkin
Feature: Single Project Section Regeneration

  @SC-1
  Scenario: Successful Single Section Regeneration
    Given the developer has a project section available for regeneration
    When the developer selects the project section
    And the developer requests AI to regenerate the selected section
    Then the system replaces only the selected section with new AI-generated content

  @SC-2
  Scenario: Regenerate Section With Missing Input
    Given the developer requests regeneration of a project section with insufficient data
    When the developer requests AI to regenerate the selected section
    Then the system notifies the developer that more input is needed before regeneration
```

### Story 9431738: Rewrite Project Section For Recruiter

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:14 UTC

```gherkin
Feature: Rewrite Project Section For Recruiter

  @SC-1
  Scenario: Successful Rewrite For Recruiter Audience
    Given the developer has a project section with content
    When the developer selects the section
    And the developer requests AI to rewrite the section for recruiters
    Then the system provides a simplified, jargon-free version of the section

  @SC-2
  Scenario: Rewrite Request On Empty Section
    Given the developer selects a project section that has no content
    When the developer requests AI to rewrite the empty section for recruiters
    Then the system informs the developer that there is no content to rewrite
```

### Story 9431739: Rewrite Project Section For Technical Audience

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:14 UTC

```gherkin
Feature: Rewrite Project Section For Technical Audience

  @SC-1
  Scenario: Successful Rewrite For Technical Audience
    Given the developer has a project section with content
    When the developer selects the section
    And the developer requests AI to rewrite the section with technical details
    Then the system generates a detailed, technical version of the section

  @SC-2
  Scenario: Rewrite Request On Empty Section
    Given the developer selects a project section that has no content
    When the developer requests AI to rewrite the empty section with technical details
    Then the system informs the developer that there is no content to rewrite
```

### Story 9431740: AI Suggestions For Missing Information

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:14 UTC

```gherkin
Feature: AI Suggestions For Missing Information

  @SC-1
  Scenario: AI Suggests Missing Sections
    Given the developer has a project with incomplete information
    When the developer requests AI suggestions for missing project information
    Then the system analyzes the project
    And the system identifies missing sections or metadata
    And the system presents a list of recommended additions to the developer

  @SC-2
  Scenario: No Missing Information Detected
    Given the developer has a project with complete information
    When the developer requests AI suggestions for missing project information
    Then the system informs the developer that no missing information was found
```

## Epic 363092: Privacy, Redaction, And Publishing Safety

### Story 9431763: Project Visibility Settings

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:20 UTC

```gherkin
Feature: Project Visibility Settings

  @SC-1
  Scenario: Set project visibility to public
    Given the developer has a project
    When the developer selects the public visibility option for the project
    Then the project becomes accessible to anyone with the link

  @SC-2
  Scenario: Set project visibility to private
    Given the developer has a project
    When the developer selects the private visibility option for the project
    Then the project is only accessible to the developer when logged in

  @SC-3
  Scenario: Set project visibility to unlisted
    Given the developer has a project
    When the developer selects the unlisted visibility option for the project
    Then the project is not listed publicly
    And the project can be accessed by anyone with the direct URL
```

### Story 9431764: Project Anonymization

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:20 UTC

```gherkin
Feature: Project Anonymization

  @SC-1
  Scenario: Mark project as anonymized
    Given the developer has a project containing sensitive client or company information
    When the developer enables anonymization on the project
    Then client names, company names, and other sensitive details are replaced or hidden in the public view

  @SC-2
  Scenario: Attempt to mark project as anonymized without any sensitive info
    Given the developer has a project with no sensitive information
    When the developer enables anonymization on the project
    Then the system allows anonymization without errors
```

### Story 9431765: Artifact Visibility Configuration

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:20 UTC

```gherkin
Feature: Artifact Visibility Configuration

  @SC-1
  Scenario: Set artifact visibility to private
    Given the developer has uploaded an artifact to a project
    When the developer sets the artifact visibility to private
    Then the artifact is not accessible on the public project page

  @SC-2
  Scenario: Set artifact visibility to public
    Given the developer has uploaded an artifact to a project
    When the developer sets the artifact visibility to public
    Then the artifact appears on the public project page

  @SC-3
  Scenario: Attempt to set artifact visibility without upload
    Given the developer has no artifact uploaded with the specified identifier
    When the developer tries to change visibility for the non-existent artifact
    Then the system displays an error message indicating the artifact does not exist
  <!-- assumes: assumed the system identifies artifacts by unique identifiers to detect non-existence -->
```

### Story 9431766: Publishing Confirmation Checklist

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:20 UTC

```gherkin
Feature: Publishing Confirmation Checklist

  @SC-1
  Scenario: View publishing checklist with all privacy items
    Given the developer is preparing to publish a project
    When the developer views the publishing checklist
    Then the checklist includes project visibility
    And the checklist includes anonymization status
    And the checklist includes artifact visibility
    And the checklist includes redaction notes

  @SC-2
  Scenario: Attempt to publish without confirming checklist
    Given the developer is preparing to publish a project
    When the developer attempts to publish without confirming the checklist
    Then the system prevents publishing until the checklist is confirmed
```

### Story 9431767: Sensitive Term Detection

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:20 UTC

```gherkin
Feature: Sensitive Term Detection

  @SC-1
  Scenario: Detect sensitive terms in project description
    Given the developer is editing the project description
    When the developer inputs project text containing client names
    Then the system highlights these terms as potentially sensitive

  @SC-2
  Scenario: No sensitive terms detected
    Given the developer is editing the project description
    When the developer inputs project text with no sensitive information
    Then the system confirms no sensitive terms found

  @SC-3
  Scenario: Detect sensitive terms in uploaded artifact metadata
    Given the developer has uploaded artifacts with metadata
    When the system scans the uploaded artifact metadata
    Then the system flags terms that may be sensitive for developer review
```

### Story 9431768: Redaction Notes Management

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:20 UTC

```gherkin
Feature: Redaction Notes Management

  @SC-1
  Scenario: Add redaction notes before publishing
    Given the developer is preparing to publish a project
    When the developer adds notes describing what client information was redacted
    Then the redaction notes appear on the public project page

  @SC-2
  Scenario: Edit existing redaction notes
    Given the developer has previously added redaction notes to a project
    When the developer updates the redaction notes
    Then the changes are saved
    And the updated notes are reflected on the public project page
```

### Story 9431769: Public Project Preview

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:20 UTC

```gherkin
Feature: Public Project Preview

  @SC-1
  Scenario: Preview public project with anonymization enabled
    Given the developer has enabled anonymization on the project
    When the developer previews the project
    Then client names are replaced as they will appear publicly
    And sensitive screenshots are redacted as they will appear publicly

  @SC-2
  Scenario: Preview public project without anonymization
    Given the developer has not enabled anonymization on the project
    When the developer previews the project
    Then all content appears as it will to public visitors

  @SC-3
  Scenario: Preview project with private artifacts hidden
    Given the developer has artifacts marked as private in the project
    When the developer previews the project
    Then artifacts marked private are not visible in the public preview
```

## Epic 363093: Public Project And Portfolio Browsing

### Story 9431793: Public Project Page Viewing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:27 UTC

```gherkin
Feature: Public Project Page Viewing

  @SC-1
  Scenario: View a fully published project page
    Given the visitor is not logged in
    And the project is fully published and public
    When the visitor opens the public project URL
    Then the project title is displayed
    And the project summary is displayed
    And the main features of the project are displayed
    And screenshots of the project are displayed
    And architecture notes are displayed
    And the developer role is displayed
    And the personal contribution is displayed

  @SC-2
  Scenario: View a project page with anonymized content
    Given the visitor is not logged in
    And the project is marked as anonymized and public
    When the visitor opens the public project URL
    Then client and company names are replaced or redacted
    And explanations about privacy safeguards are displayed

  @SC-3
  Scenario: Attempt to view a private or unpublished project
    Given the visitor is not logged in
    And the project is private or unpublished
    When the visitor tries to access the project URL
    Then a message is displayed indicating the project is not available publicly
```

### Story 9431794: Public Developer Portfolio Viewing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:27 UTC

```gherkin
Feature: Public Developer Portfolio Viewing

  @SC-1
  Scenario: View a developer portfolio with multiple projects
    Given the visitor is not logged in
    And the developer has multiple published projects
    When the visitor opens the developer's public profile page
    Then a list of the developer's published projects is displayed
    And each project shows its title
    And each project shows its summary
    And each project shows a thumbnail image

  @SC-2
  Scenario: View a developer portfolio with no public projects
    Given the visitor is not logged in
    And the developer has no published projects
    When the visitor opens the developer's public profile page
    Then a message is displayed indicating no public projects are available

  @SC-3
  Scenario: View developer profile details
    Given the visitor is not logged in
    And the developer has a public profile
    When the visitor views the developer's public profile page
    Then the developer's bio is displayed
    And the developer's years of experience are displayed
    And the developer's certifications are displayed
    And links to the developer's social or community profiles are displayed
```

### Story 9431795: Project Browsing By Tag

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:28 UTC

```gherkin
Feature: Project Browsing By Tag

  @SC-1
  Scenario: Browse projects by selecting a tag
    Given the visitor is not logged in
    And there are public projects tagged with the selected tag
    When the visitor selects a project tag
    Then a list of public projects with that tag is displayed

  @SC-2
  Scenario: Browse projects by a tag with no matching projects
    Given the visitor is not logged in
    And there are no public projects tagged with the selected tag
    When the visitor selects a project tag
    Then a message is displayed indicating no projects found
```

### Story 9431796: Public Project Keyword Search

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:28 UTC

```gherkin
Feature: Public Project Keyword Search

  @SC-1
  Scenario: Search projects with matching keywords
    Given the visitor is not logged in
    And there are public projects whose titles, summaries, or tags match the keywords
    When the visitor enters keywords in the search box
    Then a list of public projects matching the keywords is displayed

  @SC-2
  Scenario: Search projects with no results
    Given the visitor is not logged in
    And there are no public projects matching the keywords
    When the visitor enters keywords in the search box
    Then a message is displayed indicating no results found
```

### Story 9431798: Public Project Filtering By Concept

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:28 UTC

```gherkin
Feature: Public Project Filtering By Concept

  @SC-1
  Scenario: Filter projects by a selected OutSystems concept
    Given the visitor is not logged in
    And there are public projects that include the selected concept
    When the visitor applies a filter for the selected OutSystems concept
    Then only projects that include the selected concept are displayed

  @SC-2
  Scenario: Filter projects by a concept with no matches
    Given the visitor is not logged in
    And there are no public projects that include the selected concept
    When the visitor applies a filter for the selected OutSystems concept
    Then a message is displayed indicating no projects found
```

### Story 9431799: Public Project URL Sharing

**Status:** Gherkin Locked  
**Locked at:** 2026-07-23 17:28 UTC

```gherkin
Feature: Public Project URL Sharing

  @SC-1
  Scenario: Copy and share a public project URL
    Given the user is viewing a public project page
    When the user clicks the share button
    Then the public project URL is copied for sharing

  @SC-2
  Scenario: Attempt to share a URL for a private project
    Given the user is viewing a private project page
    When the user attempts to share the project URL
    Then a warning is displayed indicating the project is not publicly accessible
```