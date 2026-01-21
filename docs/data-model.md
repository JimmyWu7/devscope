# Data Model — DevScope

This document outlines the initial database entities for the MVP.
The model is intentionally simple and relational.

---

## User
- id
- githubId
- username
- name
- avatarUrl
- createdAt

---

## Repository
- id
- githubRepoId
- name
- description
- primaryLanguage
- stars
- userId

---

## Commit
- id
- githubCommitSha
- message
- committedAt
- repositoryId

---

## SyncStatus
- userId
- lastSyncedAt
- status
