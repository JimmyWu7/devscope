# Data Model — DevScope

## Overview

The data model supports two main systems:

1. Developer identity + GitHub integration
2. Job application tracking system

---

## User

Represents a DevScope user authenticated via GitHub.

- id
- name
- email
- image
- createdAt
- updatedAt

---

## GithubProfile

Stores GitHub identity metadata.

- id
- userId
- githubId
- username
- avatarUrl
- profileUrl
- createdAt
- updatedAt

---

## GithubRepo

Cached repository data from GitHub.

- id
- userId
- repoId
- name
- fullName
- description
- stars
- forks
- language
- isFork
- isPrivate
- htmlUrl
- pushedAt
- createdAt
- updatedAt

---

## GithubSync

Tracks last sync time with GitHub API.

- id
- userId
- syncedAt

---

## JobApplication

Core entity for tracking job applications.

- id
- userId
- company
- role
- platform
- applicationUrl
- salaryMin
- salaryMax
- salaryCurrency
- salaryType
- location
- workMode
- status
- dateApplied
- datePosted
- notes
- createdAt
- updatedAt

---

## Resume

Stores metadata for resumes uploaded by users.

Resume files are stored in Cloudflare R2, while only metadata is stored in the database.

- id
- userId
- fileName
- fileKey (R2 object key)
- thumbnailKey (optional R2 object key)
- fileSize
- createdAt
- updatedAt
