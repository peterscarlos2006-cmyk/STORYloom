# Storyloom Technical Architecture

This document outlines the technical architecture of the Storyloom application, focusing on the recent updates.

## System Overview

Storyloom is a web application that helps users write stories with the assistance of AI. The application is built with a Next.js/React frontend and a Node/NestJS backend. The backend is responsible for managing user data, processing journal entries, and orchestrating the AI-powered story generation process.

## Backend Architecture

The backend is a monolithic application built with the NestJS framework. It uses a PostgreSQL database for data storage and Redis for queuing background jobs. The backend is responsible for the following key features:

-   **User Authentication:** Manages user accounts and authentication using JWT.
-   **Project Management:** Allows users to create and manage their writing projects.
-   **Journaling:** Provides a rich text editor for users to write journal entries.
-   **Story Compilation:** Orchestrates the AI-powered story generation process.

### Emotional Context Analyzer (ESE)

The ESE is a new module that analyzes the emotional context of journal entries. It uses a keyword-based approach to identify the dominant emotions in the text. The ESE is integrated into the story compilation process to influence the tone and style of the generated story.

### Library of Inspirations

The "Library of Inspirations" feature allows users to select a book or author to inspire the style of their generated story. The backend provides an API to search for books and authors using the Google Books API.

### Story Compilation Flow

The story compilation flow has been updated to incorporate the ESE and the "Library of Inspirations" feature. The updated flow is as follows:

1.  The user initiates a new story compilation, providing a page range and an optional inspiration.
2.  The backend creates a new compilation job and adds it to a BullMQ queue.
3.  A background worker processes the job, performing the following steps:
    1.  Fetches the project details and journal entries from the database.
    2.  Analyzes the emotional context of the journal entries using the ESE.
    3.  Generates a story outline using GPT-4, taking into account the project genre, style inspiration, and emotional context.
    4.  Generates each chapter of the story using GPT-3.5-Turbo, using the journal entries as source material.
    5.  Assembles the full story and saves it to the database.

## Frontend Architecture

The frontend is a single-page application built with Next.js and React. It uses a component-based architecture and communicates with the backend via a REST API. The frontend is responsible for the following key features:

-   **User Interface:** Provides a user-friendly interface for managing projects, writing journal entries, and initiating story compilations.
-   **Library of Inspirations:** Implements a search bar and preview modal for the "Library of Inspirations" feature.
-   **Page Range Selector:** Provides a grouped page range selector for choosing the target story length.
-   **Journal Editor:** Features a rich text editor with a clean, softly lined background.
